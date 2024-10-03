import { errores, simbolos } from "../../index.js"
import { FuncionForeanea } from "./funcForeana.js"
import { ErrorSemantico } from "./sentTransferencia.js"
import { Simbolo } from "./simbolo.js"
import { EncontrarTipo } from "./utilidades.js"

export class Entorno {
    /**
     * 
     * @param {Entorno} entornoPadre 
     */
    constructor(entornoPadre = undefined, nombre = "") {
        this.valores = {}
        this.estructuras = {}
        this.entornoPadre = entornoPadre
        this.nombre = nombre
    }

    /**
     * @param {string} nombre 
     * @param {any} valor 
     */
    setVariable(tipo, nombre, valor, location) {
        if(this.valores[nombre]) throw new ErrorSemantico(`Variable ${nombre} ya esta declarada.`, location)

        this.valores[nombre] = {valor, tipo}
        if(valor instanceof FuncionForeanea){
            simbolos.push(new Simbolo(nombre, "Funcion", tipo, this.nombre, location.start.line, location.start.column))
        }else {
            if(!(simbolos.find(item => item.id === nombre && item.ambito === this.nombre))){
                simbolos.push(new Simbolo(nombre, "Variable", tipo, this.nombre, location.start.line, location.start.column))
            }
        }
        // simbolos.push(new Simbolo(nombre, , EncontrarTipo(valor), "variable", location.start.line, location.start.column))
    }

    setVariableTemp(tipo, nombre, valor, location) {
        if(this.valores[nombre]) throw new ErrorSemantico(`Variable ${nombre} ya esta declarada.`, location)

        this.valores[nombre] = {valor, tipo, temp: true}
    }

    setStruct(nombre, atributos, location) {
        if(this.valores[nombre]) throw new ErrorSemantico(`ID ${nombre} ya esta declarado.`, location)
        if(this.estructuras[nombre]) throw new ErrorSemantico(`Estructura ${nombre} ya esta declarada.`, location)

        this.estructuras[nombre] = {nombre, atributos}
        simbolos.push(new Simbolo(nombre, "Struct", "Estructura", this.nombre, location.start.line, location.start.column))
    }

    /**
     * @param {string} nombre 
     */
    getVariable(nombre) {
        const actual = this.valores[nombre]

        if(actual != undefined) {
            return actual
        }

        if(!actual && this.entornoPadre) {
            return this.entornoPadre.getVariable(nombre)
        }
    }

    /**
     * @param {string} nombre 
     */
    getStruct(nombre) {
        const actual = this.estructuras[nombre]

        if(actual != undefined) {
            return actual
        }

        if(!actual && this.entornoPadre) {
            return this.entornoPadre.getStruct(nombre)
        }
    }

    /**
     * @param {string} nombre 
     * @param {any} valor 
     */
    actualizarVariable(nombre, valor, location) {
        const actual = this.valores[nombre]

        if(actual != undefined) {
            if('temp' in actual) {
                // throw new ErrorSemantico(`No se puede modificar una variable temporal`, location)
                errores.push(new ErrorSemantico(`No se puede modificar una variable en un forEach`, location))
                return
            }

            if(valor.tipo == "int" && actual.tipo == "float") {
                this.valores[nombre].valor = valor.valor
                return
            } else if(actual.tipo != valor.tipo) {
                this.valores[nombre].valor = null
                throw new ErrorSemantico(`El tipo de la variable ${nombre}(${actual.tipo}) no es igual al tipo del valor(${valor.tipo})`, location)
            }
            this.valores[nombre].valor = valor.valor

            return
        }

        if(!actual && this.entornoPadre) {
            this.entornoPadre.actualizarVariable(nombre, valor, location)
            return
        }

        throw new ErrorSemantico(`Variable ${nombre} no declarada`, location)
    }

    actualizarVariableArray(nombre, valor, index, location) {
        const actual = this.valores[nombre]

        if(actual != undefined) {
            if('temp' in actual) throw new ErrorSemantico(`No se puede modificar una variable temporal`, location)

            if(!Array.isArray(actual.valor)) throw new ErrorSemantico(`La variable ${nombre} no es un array`, location)

            // if(Array.isArray(actual.valor[index.valor])) throw new ErrorSemantico(`La variable ${nombre} es una matriz`, location)

            if(index.valor >= actual.valor.length) throw new ErrorSemantico(`El indice ${index.valor} esta fuera de rango`, location)

            if(valor.tipo == "int" && actual.tipo == "float") {
                this.valores[nombre].valor[index.valor] = valor.valor
                return
            } else if(actual.tipo != valor.tipo) throw new ErrorSemantico(`El tipo de la variable ${nombre} no es igual al tipo del valor`, location)
            
            this.valores[nombre].valor[index.valor] = valor.valor

            return
        }

        if(!actual && this.entornoPadre) {
            this.entornoPadre.actualizarVariableArray(nombre, valor, index)
            return
        }

        throw new ErrorSemantico(`Variable ${nombre} no declarada`, location)
    }

    actualizarVariableMatriz(nombre, valor, posiciones, location) {
        const actual = this.valores[nombre]

        if(actual != undefined) {
            if('temp' in actual) throw new ErrorSemantico(`No se puede modificar una variable temporal`, location)

            if(!Array.isArray(actual.valor)) throw new ErrorSemantico(`La variable ${nombre} no es un array`, location)

            let arreglo = actual.valor

            for (let i = 0; i < posiciones.length; i++) {
                const exp = posiciones[i];

                if (!Array.isArray(arreglo)) throw new ErrorSemantico(`Error al acceder al arreglo, la variable no es un arreglo`, location);

                if (exp.tipo !== "int") throw new ErrorSemantico(`Error la expresión para acceder al arreglo no es de tipo int`, location);

                if (exp.valor > arreglo.length - 1) throw new ErrorSemantico(`Error al acceder al arreglo, el índice excede el tamaño del arreglo`, location);

                // Si es la última posición, asignamos el valor.
                if (i === posiciones.length - 1) {
                    if(valor.tipo == "int" && actual.tipo == "float") {
                        arreglo[exp.valor] = valor.valor;
                        return
                    } else if(actual.tipo != valor.tipo) throw new ErrorSemantico(`El tipo de la variable ${nombre} no es igual al tipo del valor`, location)
                    arreglo[exp.valor] = valor.valor;
                } else {
                    arreglo = arreglo[exp.valor];
                }
            }

            return
        }

        if(!actual && this.entornoPadre) {
            this.entornoPadre.actualizarVariableMatriz(nombre, valor, posiciones)
            return
        }

        throw new ErrorSemantico(`Variable ${nombre} no declarada`, location)
    }

    deleteVariable(nombre, location) {
        const actual = this.valores[nombre]

        if(actual != undefined) {
            delete this.valores[nombre]
            return
        }

        if(!actual && this.entornoPadre) {
            this.entornoPadre.deleteVariable(nombre)
            return
        }

        throw new ErrorSemantico(`Variable ${nombre} no declarada`, location)
    }

    actualizarInstancia(nombre, atributos, valor, location) {
        const actual = this.valores[nombre]
        if (actual !== undefined) {
            let struct = this.getStruct(actual.tipo)
            let ref = actual
            
            for (let i = 0; i < atributos.length - 1; i++) {
                const atributo = atributos[i]
                
                if (!ref.valor[atributo]) {
                    throw new ErrorSemantico(`El atributo ${atributo} no existe en la variable ${nombre}`, location)
                }

                if (typeof ref.valor[atributo].valor !== 'object') {
                    throw new ErrorSemantico(`El atributo ${atributo} no es una estructura en la variable ${nombre}`, location)
                }
                
                // Actualizar struct si el tipo no es básico
                struct = this.getStruct(ref.valor[atributo].tipo);
                ref = ref.valor[atributo]
            }
            
            const ultimoAtributo = atributos[atributos.length - 1]
            
            // Obtener el tipo del atributo desde el struct actualizado
            const tipoAtributo = struct.atributos.find(item => item.id === ultimoAtributo).tipo
            
            // Validar el tipo
            if (valor.tipo === "int" && tipoAtributo === "float") {
                ref.valor[ultimoAtributo] = valor
                return
            } else if (tipoAtributo !== valor.tipo) {
                throw new ErrorSemantico(`El tipo del atributo ${ultimoAtributo} no coincide con el tipo del valor proporcionado`, location)
            } else {
                ref.valor[ultimoAtributo] = valor
                return;
            }
        }
        
        if (!actual && this.entornoPadre) {
            this.entornoPadre.actualizarInstancia(nombre, atributos, valor)
            return
        }
        
        throw new ErrorSemantico(`Variable ${nombre} no declarada`, location)
    }
}