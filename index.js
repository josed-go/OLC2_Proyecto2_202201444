import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm'
import { CompiladorVisitor } from './compilador/compilador.js'

import { parse } from './compilador/gramatica.js'
//import { IntepreteVisitor } from './analizador/interprete.js'
//import { ErrorSemantico } from './analizador/sentTransferencia.js'


const btn_archivos = document.getElementById('btn-archivos')
const btn_nuevo = document.getElementById('btn-nuevo')
const btn_abrir = document.getElementById('btn-abrir')
const btn_guardar = document.getElementById('btn-guardar')
const btn_errores = document.getElementById('btn-errores')
const btn_cerrar_err = document.getElementById('btn-cerrar-err')
const btn_cerrar_simb = document.getElementById('btn-cerrar-simbolos')
const btn_simbolos = document.getElementById('btn-simbolos')
const p_archivos = document.getElementById('p-archivos')
const p_reportes = document.getElementById('p-reportes')
const p_ejecutar = document.getElementById('p-ejecutar')
const dropdown_archivos = document.getElementById('dropdown-archivos')
const dropdown_reportes = document.getElementById('dropdown-reportes')
const fileInput = document.getElementById('fileInput')
const modal_errores = document.getElementById("reporte-errores")
const modal_simbolos = document.getElementById("reporte-simbolos")

const tbodyErrores = document.getElementById('tbody-errores')
const tbodySimbolos = document.getElementById('tbody-simbolos')

const errorTemplate = document.querySelector('[data-error]')
const simboloTemplate = document.querySelector('[data-simbolo]')

const sidebar = document.getElementById('sidebar')

let fileCounter = 0
const filesList = []
let currentFile = null
export const errores = []
export const simbolos = []

const editor = monaco.editor.create(
    document.getElementById('editor'), {
        value:'',
        language: 'java',
        theme: 'vs-dark',
        automaticLayout: true
    }
)

const consola = monaco.editor.create(
    document.getElementById('consola'), {
        value:'',
        language: 'java',
        theme: 'vs-dark',
        readOnly: true,
        automaticLayout: true
    }
)

p_ejecutar.addEventListener('click', () => {
    const entrada = editor.getValue()
    // var err = ""
    // errores.length = 0
    // simbolos.length = 0
    try {
        const sentencias = parse(entrada)
    
        const interprete = new CompiladorVisitor()
        console.log({sentencias})
        sentencias.forEach(sentencia => {
            try {
                
                sentencia.accept(interprete)
            } catch (error) {
                console.log(error)
                /*if(error instanceof ErrorSemantico) {
                    console.log(error)
                    err = err +"\n"+ error.message + ' en linea ' + error.location.start.line + ' column ' + error.location.start.column
                    errores.push(error)
                }*/
            }
        })
        consola.setValue(interprete.codigo.toString())

        /*if(obtenerErrores() != "") {
            consola.setValue(consola.getValue()+'\nERRORES ENCONTRADOS\n'+ obtenerErrores())
        }*/
    } catch (error) {
        console.log(error)
        /*var err = error.message + ' en linea ' + error.location.start.line + ' column ' + error.location.start.column
        errores.push({message: error.message, location: error.location, tipo: "Lexico/Sintactico"})
        consola.setValue(err)*/
    }

    // if(obtenerErrores() != "") {
    //     consola.setValue(consola.getValue()+'\nERRORES ENCONTRADOS\n'+ obtenerErrores())
    // }

    /*tbodyErrores.replaceChildren([])
    tbodySimbolos.replaceChildren([])
    errores.forEach((error, index) => {
        agregarError(index+1, error)
    })

    simbolos.forEach(simbolo => {
        agregarSimbolo(simbolo)
    })
    
    console.log(simbolos)*/
})

function obtenerErrores() {
    let err = ""
    errores.forEach(error => {
        err = err +"\n"+ error.message + ' en linea ' + error.location.start.line + ' column ' + error.location.start.column
    })
    return err
}

btn_archivos.addEventListener('click', () => {
    var element = document.getElementById('svg-archivos')
    if (element.classList.contains('-rotate-90')) {

        element.classList.remove('-rotate-90')
        element.classList.add('rotate-0')
        sidebar.classList.remove('hidden')
    }else {
        element.classList.remove('rotate-0')
        element.classList.add('-rotate-90')
        sidebar.classList.add('hidden')
    }
})

btn_nuevo.addEventListener('click', () => {
    if (currentFile) {
        // Guardar el contenido actual antes de cambiar de archivo
        filesList[currentFile] = editor.getValue();
    }

    fileCounter++;
    const fileName = `Archivo ${fileCounter}`;
    filesList[fileName] = ''; // Inicializar el contenido vacío
    currentFile = fileName; // Establecer como archivo actual

    // Crear el elemento del archivo en el sidebar
    const fileElement = document.createElement('div');
    fileElement.classList.add('flex', 'flex-row', 'justify-between', 'items-center', 'gap-0', 'text-gray-100', 'hover:text-white', 'hover:bg-grist', 'w-full', 'pl-4', 'cursor-pointer', 'p-2');
    fileElement.innerHTML = `
        <span>${fileName}</span>
        <button class="remove-file" data-file="${fileName}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
    `;
    sidebar.appendChild(fileElement);

    // Mostrar el nombre del archivo en la etiqueta `filename`
    document.getElementById('filename').textContent = fileName;

    // Configurar el editor para un nuevo archivo
    editor.setValue(filesList[fileName]);
    editor.focus();

    // Añadir el evento para hacer clic en el archivo
    fileElement.addEventListener('click', () => {
        if (currentFile) {
            // Guardar el contenido actual antes de cambiar de archivo
            filesList[currentFile] = editor.getValue();
        }
        currentFile = fileName;
        editor.setValue(filesList[fileName]);
        document.getElementById('filename').textContent = fileName;
    });

    // Añadir el evento para eliminar el archivo
    fileElement.querySelector('.remove-file').addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que se dispare el evento de clic en el archivo
        const fileToRemove = event.target.closest('.remove-file').dataset.file;
        delete filesList[fileToRemove];
        sidebar.removeChild(fileElement);

        // Si el archivo eliminado es el actual, limpiar el editor
        if (currentFile === fileToRemove) {
            currentFile = null;
            editor.setValue('');
            document.getElementById('filename').textContent = '';
        }
    });

    dropdown_archivos.classList.add('hidden');
});

fileInput.addEventListener('change', (event) => {
    if (currentFile) {
        // Guardar el contenido actual antes de cambiar de archivo
        filesList[currentFile] = editor.getValue();
    }

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const content = e.target.result;
        const fileName = file.name;
        filesList[fileName] = content;
        currentFile = fileName; // Establecer como archivo actual

        // Añadir el archivo al sidebar
        const fileElement = document.createElement('div');
        fileElement.classList.add('flex', 'flex-row', 'justify-between', 'items-center', 'gap-0', 'text-gray-100', 'hover:text-white', 'hover:bg-grist', 'w-full', 'pl-4', 'cursor-pointer', 'p-2');
        fileElement.innerHTML = `
            <span>${fileName}</span>
            <button class="remove-file" data-file="${fileName}">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;
        sidebar.appendChild(fileElement);

        // Mostrar el nombre del archivo en la etiqueta `filename`
        document.getElementById('filename').textContent = fileName;

        // Mostrar el contenido en el editor
        editor.setValue(content);
        editor.focus();

        // Añadir el evento para hacer clic en el archivo
        fileElement.addEventListener('click', () => {
            if (currentFile) {
                // Guardar el contenido actual antes de cambiar de archivo
                filesList[currentFile] = editor.getValue();
            }
            currentFile = fileName;
            editor.setValue(filesList[fileName]);
            document.getElementById('filename').textContent = fileName;
        });

        // Añadir el evento para eliminar el archivo
        fileElement.querySelector('.remove-file').addEventListener('click', (event) => {
            event.stopPropagation(); // Evitar que se dispare el evento de clic en el archivo
            const fileToRemove = event.target.closest('.remove-file').dataset.file;
            delete filesList[fileToRemove];
            sidebar.removeChild(fileElement);

            // Si el archivo eliminado es el actual, limpiar el editor
            if (currentFile === fileToRemove) {
                currentFile = null;
                editor.setValue('');
                document.getElementById('filename').textContent = '';
            }
        });
    };

    reader.readAsText(file);
    dropdown_archivos.classList.add('hidden');
});

btn_guardar.addEventListener('click', () => {
    if (currentFile) {
        // Guardar el contenido actual del editor en el archivo actual
        saveFile(currentFile, editor.getValue());
    } else {
        // Si no hay un archivo actual, solicitar un nombre para crear un nuevo archivo
        let newFileName = prompt("Introduce el nombre del nuevo archivo:");
        if (newFileName) {
            // Asegurarse de que el nombre tenga la extensión .oak
            if (!newFileName.endsWith('.oak')) {
                newFileName += '.oak';
            }
            saveFile(newFileName, editor.getValue());
            currentFile = newFileName;

            // Crear el nuevo archivo en el sidebar
            const fileElement = document.createElement('div');
            fileElement.classList.add('flex', 'flex-row', 'justify-between', 'items-center', 'gap-0', 'text-gray-100', 'hover:text-white', 'hover:bg-grist', 'w-full', 'pl-4', 'cursor-pointer', 'p-2');
            fileElement.innerHTML = `
                <span>${newFileName}</span>
                <button class="remove-file" data-file="${newFileName}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            `;
            sidebar.appendChild(fileElement);

            // Actualizar el nombre del archivo en la etiqueta `filename`
            document.getElementById('filename').textContent = newFileName;

            // Añadir el evento para hacer clic en el archivo
            fileElement.addEventListener('click', () => {
                if (currentFile) {
                    filesList[currentFile] = editor.getValue();
                }
                currentFile = newFileName;
                editor.setValue(filesList[newFileName]);
                document.getElementById('filename').textContent = newFileName;
            });

            fileElement.querySelector('.remove-file').addEventListener('click', (event) => {
                event.stopPropagation();
                const fileToRemove = event.target.closest('.remove-file').dataset.file;
                delete filesList[fileToRemove];
                sidebar.removeChild(fileElement);

                if (currentFile === fileToRemove) {
                    currentFile = null;
                    editor.setValue('');
                    document.getElementById('filename').textContent = '';
                }
            });

            alert(`Archivo "${newFileName}" creado y guardado exitosamente.`);
        }
    }
});

function saveFile(fileName, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

p_archivos.addEventListener('click', () => {
    if (dropdown_archivos.classList.contains('hidden')) {

        dropdown_archivos.classList.remove('hidden')
    }else {
        dropdown_archivos.classList.add('hidden')
    }
})

p_reportes.addEventListener('click', () => {
    if (dropdown_reportes.classList.contains('hidden')) {

        dropdown_reportes.classList.remove('hidden')
    }else {
        dropdown_reportes.classList.add('hidden')
    }
})

btn_abrir.addEventListener('click', () => {
    fileInput.click();
});

btn_errores.addEventListener('click', () => {
    dropdown_reportes.classList.add('hidden')
    // tbodyErrores.replaceChildren([])
    // errores.forEach((error, index) => {
    //     agregarError(index+1, error)
    // })
    showErrores()
});

btn_simbolos.addEventListener('click', () => {
    dropdown_reportes.classList.add('hidden')
    showSimbolos()
});

const showErrores = () => {
    modal_errores.classList.toggle("hidden");
};

const showSimbolos = () => {
    modal_simbolos.classList.toggle("hidden");
}

btn_cerrar_err.addEventListener('click', () => {
    showErrores()
});

btn_cerrar_simb.addEventListener('click', () => {
    showSimbolos()
});

const agregarError = (no, error) => {
    const errorElement = errorTemplate.content.cloneNode(true)
    const noError = errorElement.querySelector('[no-error]')
    const description = errorElement.querySelector('[description-error]')
    const linea = errorElement.querySelector('[linea-error]')
    const columna = errorElement.querySelector('[column-error]')
    const tipo = errorElement.querySelector('[tipo-error]')

    noError.textContent = no
    description.textContent = error.message
    linea.textContent = error.location.start.line
    columna.textContent = error.location.start.column
    tipo.textContent = error.tipo
    tbodyErrores.appendChild(errorElement)
}

const agregarSimbolo = (simbolo) => {
    const simboloElement = simboloTemplate.content.cloneNode(true)
    const id = simboloElement.querySelector('[id-simbolo]')
    const tipo = simboloElement.querySelector('[tipo-simbolo]')
    const tipoDato = simboloElement.querySelector('[tipo-dato]')
    const ambito = simboloElement.querySelector('[ambito-simbolo]')
    const linea = simboloElement.querySelector('[linea-simbolo]')
    const columna = simboloElement.querySelector('[column-simbolo]')

    id.textContent = simbolo.id
    tipo.textContent = simbolo.tipoSimbolo
    tipoDato.textContent = simbolo.tipoDato
    ambito.textContent = simbolo.ambito
    linea.textContent = simbolo.linea
    columna.textContent = simbolo.columna
    tbodySimbolos.appendChild(simboloElement)
}