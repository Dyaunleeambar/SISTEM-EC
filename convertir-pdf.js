const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const marked = require('marked');

// Configuración de archivos a convertir
const archivos = [
    {
        entrada: 'README.md',
        salida: 'README.pdf',
        titulo: 'Documentación del Sistema'
    },
    {
        entrada: 'GUIA-USUARIO.md',
        salida: 'GUIA-USUARIO.pdf',
        titulo: 'Guía de Usuario'
    },
    {
        entrada: 'RESUMEN-EJECUTIVO.md',
        salida: 'RESUMEN-EJECUTIVO.pdf',
        titulo: 'Resumen Ejecutivo'
    },
    {
        entrada: 'SISTEMA_RESPALDOS.md',
        salida: 'SISTEMA_RESPALDOS.pdf',
        titulo: 'Sistema de Respaldos'
    }
];

// Función para convertir Markdown a HTML
function markdownToHtml(markdown, titulo) {
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h1 {
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 5px;
        }
        code {
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border-left: 4px solid #3498db;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 0;
            padding-left: 15px;
            color: #7f8c8d;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .emoji {
            font-size: 1.2em;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
        }
        .version {
            background-color: #3498db;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9em;
            display: inline-block;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${titulo}</h1>
        <p>Sistema de Estimulación de Colaboradores</p>
        <div class="version">Versión 2.0</div>
    </div>
    
    ${marked.parse(markdown)}
    
    <div class="footer">
        <p><strong>© 2025 Sistema de Estimulación de Colaboradores</strong></p>
        <p>Documentación generada automáticamente</p>
        <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
</body>
</html>`;
    
    return html;
}

// Función principal para convertir archivos
async function convertirArchivos() {
    console.log('🚀 Iniciando conversión de archivos a PDF...\n');
    
    // Verificar si existe el directorio docs
    if (!fs.existsSync('docs')) {
        fs.mkdirSync('docs');
        console.log('📁 Directorio "docs" creado');
    }
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    for (const archivo of archivos) {
        try {
            console.log(`📄 Procesando: ${archivo.entrada}`);
            
            // Verificar si existe el archivo
            if (!fs.existsSync(archivo.entrada)) {
                console.log(`❌ Archivo no encontrado: ${archivo.entrada}`);
                continue;
            }
            
            // Leer el archivo Markdown
            const markdown = fs.readFileSync(archivo.entrada, 'utf8');
            
            // Convertir a HTML
            const html = markdownToHtml(markdown, archivo.titulo);
            
            // Crear archivo HTML temporal
            const htmlPath = path.join('docs', `${archivo.salida.replace('.pdf', '.html')}`);
            fs.writeFileSync(htmlPath, html);
            
            // Convertir HTML a PDF
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            
            const pdfPath = path.join('docs', archivo.salida);
            await page.pdf({
                path: pdfPath,
                format: 'A4',
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm'
                },
                printBackground: true
            });
            
            await page.close();
            
            // Eliminar archivo HTML temporal
            fs.unlinkSync(htmlPath);
            
            console.log(`✅ Convertido: ${archivo.salida}`);
            
        } catch (error) {
            console.error(`❌ Error procesando ${archivo.entrada}:`, error.message);
        }
    }
    
    await browser.close();
    
    console.log('\n🎉 Conversión completada!');
    console.log('📁 Los archivos PDF se encuentran en el directorio "docs"');
    
    // Mostrar archivos generados
    const archivosGenerados = fs.readdirSync('docs').filter(file => file.endsWith('.pdf'));
    console.log('\n📋 Archivos PDF generados:');
    archivosGenerados.forEach(archivo => {
        console.log(`   📄 ${archivo}`);
    });
}

// Ejecutar la conversión
convertirArchivos().catch(console.error); 