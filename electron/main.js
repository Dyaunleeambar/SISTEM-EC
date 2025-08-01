const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

// Mantener una referencia global del objeto de ventana
let mainWindow;
let serverProcess;

function createWindow() {
    // Crear la ventana del navegador
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        icon: path.join(__dirname, '../assets/icon.ico'),
        title: 'Sistema de Estimulación de Colaboradores',
        show: false, // No mostrar hasta que esté listo
        autoHideMenuBar: false,
        resizable: true,
        maximizable: true,
        minimizable: true
    });

    // Cargar la aplicación
    const startUrl = isDev 
        ? 'http://localhost:3001' 
        : 'http://localhost:3001';
    
    // En producción, iniciar el servidor embebido
    if (!isDev) {
        startServer();
    }
    
    // Esperar un poco para que el servidor se inicie
    setTimeout(() => {
        mainWindow.loadURL(startUrl);
    }, 2000);

    // Mostrar la ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Abrir DevTools en desarrollo
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Manejar cuando la ventana se cierra
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Prevenir navegación a URLs externas
    mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        
        if (isDev && parsedUrl.origin === 'http://localhost:3001') {
            return; // Permitir navegación local en desarrollo
        }
        
        event.preventDefault();
        dialog.showErrorBox('Navegación Bloqueada', 
            'No se permite navegar a sitios externos desde esta aplicación.');
    });

    // Manejar nuevas ventanas
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        dialog.showErrorBox('Ventana Bloqueada', 
            'No se permite abrir nuevas ventanas desde esta aplicación.');
        return { action: 'deny' };
    });
}

// Crear menú de la aplicación
function createMenu() {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Salir',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                { role: 'reload', label: 'Recargar' },
                { role: 'forceReload', label: 'Forzar Recarga' },
                { role: 'toggleDevTools', label: 'Herramientas de Desarrollo' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom Normal' },
                { role: 'zoomIn', label: 'Aumentar Zoom' },
                { role: 'zoomOut', label: 'Reducir Zoom' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Pantalla Completa' }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Acerca de',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Acerca de',
                            message: 'Sistema de Estimulación de Colaboradores',
                            detail: 'Versión 1.0.0\n\nSistema completo para la gestión y estimulación de colaboradores con autenticación JWT y roles de usuario.'
                        });
                    }
                }
            ]
        }
    ];

    // En macOS, agregar menú de aplicación
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about', label: 'Acerca de' },
                { type: 'separator' },
                { role: 'services', label: 'Servicios' },
                { type: 'separator' },
                { role: 'hide', label: 'Ocultar' },
                { role: 'hideOthers', label: 'Ocultar Otros' },
                { role: 'unhide', label: 'Mostrar Todo' },
                { type: 'separator' },
                { role: 'quit', label: 'Salir' }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Este método será llamado cuando Electron haya terminado de inicializar
app.whenReady().then(() => {
    createWindow();
    createMenu();

    app.on('activate', () => {
        // En macOS es común recrear una ventana cuando se hace clic en el icono del dock
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
    // En macOS es común que las aplicaciones permanezcan activas hasta que el usuario las cierre explícitamente
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Función para iniciar el servidor embebido
function startServer() {
    const serverPath = path.join(__dirname, '../server.exe');
    const nodePath = path.join(__dirname, '../node_modules/.bin/node');
    
    try {
        // Intentar usar server.exe primero (si existe)
        if (require('fs').existsSync(serverPath)) {
            serverProcess = spawn(serverPath, [], {
                stdio: 'pipe',
                cwd: path.join(__dirname, '..')
            });
        } else {
            // Fallback: usar node con server.js
            serverProcess = spawn('node', ['server.js'], {
                stdio: 'pipe',
                cwd: path.join(__dirname, '..')
            });
        }
        
        serverProcess.stdout.on('data', (data) => {
            console.log('Servidor:', data.toString());
        });
        
        serverProcess.stderr.on('data', (data) => {
            console.error('Error del servidor:', data.toString());
        });
        
        serverProcess.on('error', (error) => {
            console.error('Error al iniciar servidor:', error);
            dialog.showErrorBox('Error del Servidor', 
                'No se pudo iniciar el servidor backend. La aplicación puede no funcionar correctamente.');
        });
        
        serverProcess.on('close', (code) => {
            console.log('Servidor cerrado con código:', code);
        });
        
    } catch (error) {
        console.error('Error al iniciar servidor:', error);
        dialog.showErrorBox('Error del Servidor', 
            'No se pudo iniciar el servidor backend. La aplicación puede no funcionar correctamente.');
    }
}

// Función para cerrar el servidor
function stopServer() {
    if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
    }
}

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
    dialog.showErrorBox('Error', 'Ha ocurrido un error inesperado en la aplicación.');
});

// Manejar advertencias
process.on('warning', (warning) => {
    console.warn('Advertencia:', warning);
});

// Cerrar el servidor cuando la aplicación se cierre
app.on('before-quit', () => {
    stopServer();
}); 
