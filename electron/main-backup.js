const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Importar el servidor
let serverProcess = null;

// Mantener una referencia global del objeto de ventana
let mainWindow;

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
        // icon: path.join(__dirname, '../assets/icon.png'), // Comentado temporalmente
        title: 'Sistema de Estimulación de Colaboradores',
        show: false // No mostrar hasta que esté listo
    });

    // Cargar la aplicación
    const startUrl = 'http://localhost:3001';
    
    // En producción, iniciar el servidor
    if (!isDev) {
        const { spawn } = require('child_process');
        const serverPath = path.join(__dirname, '../server.js');
        
        // Usar node directamente
        serverProcess = spawn('node', [serverPath], {
            stdio: 'pipe',
            cwd: path.join(__dirname, '../')
        });
        
        serverProcess.stdout.on('data', (data) => {
            console.log('Servidor:', data.toString());
        });
        
        serverProcess.stderr.on('data', (data) => {
            console.error('Error servidor:', data.toString());
        });
        
        // Esperar a que el servidor esté listo
        setTimeout(() => {
            mainWindow.loadURL(startUrl);
        }, 3000);
    } else {
        mainWindow.loadURL(startUrl);
    }

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
    // Terminar el servidor si está ejecutándose
    if (serverProcess) {
        serverProcess.kill();
    }
    
    // En macOS es común que las aplicaciones permanezcan activas hasta que el usuario las cierre explícitamente
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
    dialog.showErrorBox('Error', `Ha ocurrido un error inesperado en la aplicación.\n\nDetalles: ${error.message}`);
});

// Manejar advertencias
process.on('warning', (warning) => {
    console.warn('Advertencia:', warning);
});

// Manejar errores del servidor
if (serverProcess) {
    serverProcess.on('error', (error) => {
        console.error('Error del servidor:', error);
        dialog.showErrorBox('Error del Servidor', `No se pudo iniciar el servidor.\n\nDetalles: ${error.message}`);
    });
} 
