import { Entorno } from "./entorno.js";
import { BaseVisitor } from "../visitor.js";
import { EncontrarTipo, validarDimensiones, validarYObtenerValores, ValorPorDefecto } from "./utilidades.js";
import { parse } from "../gramatica.js";
import { ExcepcionBreak, ExcepcionContinue, ExcepcionReturn, ErrorSemantico } from "./sentTransferencia.js";
import nodos, { Expresion } from "../nodos.js";
import { Invocable } from "./invocable.js";
import { FuncionForeanea } from "./funcForeana.js";
import { errores, setIntento } from "../../index.js" 

export class IntepreteVisitor extends BaseVisitor {

    /*"int" / "float" / "string" / "boolean" / "char" /
    "var" / "print" / "if" / "else" / "while" / 
    "for" / "switch" / "case" / "default" / "new" /
    "typeof" / "true" / "false" / "return" /
    "struct" / "break" / "continue" / "null" / "void" /
    "toString" / "toLowerCase" / "toUpperCase" /
    "parseInt" / "parseFloat" / "length" / "join" / "indexOf" /
    "System" / "out" / "println"*/

    static palabrasReservadas = [
        "int", "float", "string", "char", "boolean", 
        "void", "struct", "null", "true", "false", "if", 
        "else", "while", "for", "break", "continue", "return", 
        "print", "println", "System", "parsefloat", 
        "toString", "toLowerCase", "toUpperCase", "keys", "typeof",
        "length", "join", "indexOf", "new", "struct", "Object",
        "default", "case", "switch"
    ]

    constructor() {
        super()
        this.entornoActual = new Entorno(undefined, "Global")
        this.salida = ''

        /**
         * @type { Expresion | null }
         */
        this.continueAnterior = null
    }

    /**
     * @type { BaseVisitor['visitExpresion'] }
    */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }

    /**
     * @type { BaseVisitor['visitOperacionBinaria'] }
    */
    visitOperacionBinaria(node) {
        const izq = node.izq.accept(this)
        const der = node.der.accept(this)

        if(izq.valor == null || der.valor == null) {
                
            errores.push(new ErrorSemantico('No se puede realizar la operacion con valores nulos', node.location))
            // return {valor: null, tipo: 'nully'}
        }

        switch (node.op) {
            case "+":

                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'int'}
                    return { valor: izq.valor + der.valor, tipo : "int" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor + der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor + der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor + der.valor, tipo : "float" }
                } else if (izq.tipo == "string" && der.tipo == "string") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'string'}
                    return { valor: izq.valor + der.valor, tipo : "string" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "-":

                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'int'}
                    return { valor: izq.valor - der.valor, tipo : "int" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor - der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor - der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor - der.valor, tipo : "float" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "*":

                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'int'}
                    return { valor: izq.valor * der.valor, tipo : "int" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor * der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor * der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor * der.valor, tipo : "float" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "/":

                // if(der.valor == 0) {
                //     errores.push(new ErrorSemantico('No se puede dividir por 0', node.location))
                //     return {valor: null, tipo: 'nully'}
                // }

                if(izq.tipo == "int" && der.tipo == "int") {
                    if(der.valor == 0) {
                        errores.push(new ErrorSemantico('No se puede dividir por 0', node.location))
                        return {valor: null, tipo: 'int'}
                    }
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'int'}
                    return { valor: Math.floor(izq.valor / der.valor), tipo : "int" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(der.valor == 0) {
                        errores.push(new ErrorSemantico('No se puede dividir por 0', node.location))
                        return {valor: null, tipo: 'float'}
                    }
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor / der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(der.valor == 0) {
                        errores.push(new ErrorSemantico('No se puede dividir por 0', node.location))
                        return {valor: null, tipo: 'float'}
                    }
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor / der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(der.valor == 0) {
                        errores.push(new ErrorSemantico('No se puede dividir por 0', node.location))
                        return {valor: null, tipo: 'float'}
                    }
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor / der.valor, tipo : "float" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "%":
                // if(der.valor == 0) {
                //     errores.push(new ErrorSemantico('No se puede dividir por 0', node.location))
                //     return {valor: null, tipo: 'nully'}
                // }

                if(izq.tipo == "int" && der.tipo == "int") {
                    if(der.valor == 0) {
                        errores.push(new ErrorSemantico('No se puede dividir por 0', node.location))
                        return {valor: null, tipo: 'int'}
                    }
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'int'}
                    return { valor: izq.valor % der.valor, tipo : "int" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "<=":
                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor <= der.valor, tipo : "boolean" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor <= der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor <= der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor <= der.valor, tipo : "boolean" }
                } else if (izq.tipo == "char" && der.tipo == "char") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor <= der.valor, tipo : "boolean" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "<":
                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor < der.valor, tipo : "boolean" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor < der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor < der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor < der.valor, tipo : "boolean" }
                } else if (izq.tipo == "char" && der.tipo == "char") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor < der.valor, tipo : "boolean" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }
            case ">=":

                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor >= der.valor, tipo : "boolean" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor >= der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor >= der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor >= der.valor, tipo : "boolean" }
                } else if (izq.tipo == "char" && der.tipo == "char") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor >= der.valor, tipo : "boolean" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case ">":

                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor > der.valor, tipo : "boolean" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor > der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor > der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor > der.valor, tipo : "boolean" }
                } else if (izq.tipo == "char" && der.tipo == "char") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor > der.valor, tipo : "boolean" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "==":
                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor == der.valor, tipo : "boolean" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor == der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor == der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor == der.valor, tipo : "boolean" }
                } else if (izq.tipo == "boolean" && der.tipo == "boolean") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor == der.valor, tipo : "boolean" }
                } else if (izq.tipo == "string" && der.tipo == "string") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor == der.valor, tipo : "boolean" }
                } else if (izq.tipo == "char" && der.tipo == "char") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor == der.valor, tipo : "boolean" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "!=":
                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor != der.valor, tipo : "boolean" }
                } else if (izq.tipo == "int" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor != der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor != der.valor, tipo : "boolean" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor != der.valor, tipo : "boolean" }
                } else if (izq.tipo == "boolean" && der.tipo == "boolean") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor != der.valor, tipo : "boolean" }
                } else if (izq.tipo == "string" && der.tipo == "string") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor != der.valor, tipo : "boolean" }
                } else if (izq.tipo == "char" && der.tipo == "char") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                    return { valor: izq.valor != der.valor, tipo : "boolean" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }

            case "||":

                if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                if(izq.tipo != "boolean" || der.tipo != "boolean") throw new ErrorSemantico('No es valida esa operacion', node.location)

                return { valor: izq.valor || der.valor, tipo: "boolean"}

            case "&&":

                if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'boolean'}
                if(izq.tipo != "boolean" || der.tipo != "boolean") throw new ErrorSemantico('No es valida esa operacion', node.location)

                return { valor: izq.valor && der.valor, tipo: "boolean"}

            case "+=":
                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'int'}
                    return { valor: izq.valor + der.valor, tipo : "int" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor + der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor + der.valor, tipo : "float" }
                } else if (izq.tipo == "string" && der.tipo == "string") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'string'}
                    return { valor: izq.valor + der.valor, tipo : "string" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }
            case "-=":
                if(izq.tipo == "int" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'int'}
                    return { valor: izq.valor - der.valor, tipo : "int" }
                } else if (izq.tipo == "float" && der.tipo == "float") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor - der.valor, tipo : "float" }
                } else if (izq.tipo == "float" && der.tipo == "int") {
                    if(izq.valor == null || der.valor == null) return {valor: null, tipo: 'float'}
                    return { valor: izq.valor - der.valor, tipo : "float" }
                } else {
                    // throw new ErrorSemantico('No es valida esa operacion', node.location);
                    errores.push(new ErrorSemantico(`No es valida esa operacion con tipos ${izq.tipo} y ${der.tipo}`, node.location))
                    return {valor: null, tipo: "nully"}
                }
            default:
                throw new ErrorSemantico('Operador no soportado: '+node.op, node.location);
        }
    }

    /**
     * @type { BaseVisitor['visitOperacionUnaria'] }
    */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this)

        if(exp.valor == null) {
            errores.push(new ErrorSemantico('No se puede realizar la operacion con valores nulos', node.location))
            
            // return {valor: null, tipo: 'nully'}
        }

        switch (node.op) {
            case "-":
                switch (exp.tipo) {
                    case "int":
                        if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: -exp.valor, tipo: exp.tipo }
                    case "float":
                        if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: -exp.valor, tipo: exp.tipo }
                    default:
                        // throw new ErrorSemantico('No es valida esa operacion', node.location);
                        errores.push(new ErrorSemantico(`No es valida esa operacion con tipo ${exp.tipo}`, node.location))
                        return {valor: null, tipo: exp.tipo}
                }
            case "!":
                switch (exp.tipo) {
                    case "boolean":
                        if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: !exp.valor, tipo: exp.tipo }
                    default:
                        // throw new ErrorSemantico('No es valida esa operacion', node.location);
                        errores.push(new ErrorSemantico(`No es valida esa operacion con tipo ${exp.tipo}`, node.location))
                        return {valor: null, tipo: exp.tipo}
                }
                
            case "++":
                switch (exp.tipo) {
                    case "int":
                        if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.valor + 1, tipo: exp.tipo }
                    case "float":
                        if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.valor + 1, tipo: exp.tipo }
                    default:
                        // throw new ErrorSemantico('No es valida esa operacion', node.location);
                        errores.push(new ErrorSemantico(`No es valida esa operacion con tipo ${exp.tipo}`, node.location))
                        return {valor: null, tipo: exp.tipo}
                }
            case "--":
                switch (exp.tipo) {
                    case "int":
                        if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.valor - 1, tipo: exp.tipo }
                    case "float":
                        if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.valor - 1, tipo: exp.tipo }
                    default:
                        // throw new ErrorSemantico('No es valida esa operacion', node.location);
                        errores.push(new ErrorSemantico(`No es valida esa operacion con tipo ${exp.tipo}`, node.location))
                        return {valor: null, tipo: exp.tipo}
                }
            case "typeof":
                switch (exp.tipo) {
                    case "int":
                        // if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.tipo, tipo: "string" }
                    case "float":
                        // if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.tipo, tipo: "string" }
                    case "string":
                        // if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.tipo, tipo: "string" }
                    case "boolean":
                        // if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.tipo, tipo: "string" }
                    case "char":
                        // if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                        return { valor: exp.tipo, tipo: "string" }
                    default:
                        if(this.entornoActual.getStruct(exp.tipo, node.location) != undefined) {
                            return { valor: exp.tipo, tipo: "string" }
                        }

                        throw new ErrorSemantico('No es valida el typeof con ese tipo de dato', node.location);
                }
            case "parseInt" :
                let valor = exp.valor
                if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                if(exp.tipo != "string") throw new ErrorSemantico('No es valido el parseInt con ese tipo de dato', node.location);

                if(valor.includes('.') ){
                    valor = valor.split('.')[0]
                }

                valor = parseInt(valor, 10)

                if(isNaN(valor)) throw new ErrorSemantico('No es posible parsear a int el valor', node.location);

                return { valor: valor, tipo: "int" }

            case "parsefloat" :
                let valorF = exp.valor
                if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                if(exp.tipo != "string") throw new ErrorSemantico('No es valido el parseFloat con ese tipo de dato', node.location);

                valorF = parseFloat(valorF)

                if(isNaN(valorF)) throw new ErrorSemantico('No es posible parsear a float el valor', node.location);

                return { valor: valorF, tipo: "float" }

            case "toString" :
                let valorS = exp.valor
                if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                return { valor: valorS.toString(), tipo: "string" }

            case "toLowerCase" :
                let valorT = exp.valor
                if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                if(exp.tipo != "string") throw new ErrorSemantico('No es valido el toLowerCase con ese tipo de dato', node.location);

                return { valor: valorT.toLowerCase(), tipo: "string" }

            case "toUpperCase" :
                let valorU = exp.valor
                if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                if(exp.tipo != "string") throw new ErrorSemantico('No es valido el toUpperCase con ese tipo de dato', node.location);

                return { valor: valorU.toUpperCase(), tipo: "string" }

            case "keys" :
                if(exp.valor == null) return {valor: null, tipo: exp.tipo}
                const struct = this.entornoActual.getStruct(exp.tipo, node.location)
                if( struct == undefined) throw new ErrorSemantico('No es valido el keys con ese tipo de dato', node.location);



                const arrayTemp = struct.atributos.map(atributo => (
                    {valor: atributo.id, tipo: "string"} 
                ))

                const arrayTemp2 = validarYObtenerValores("string", arrayTemp)

                return { valor: arrayTemp2, tipo: "string", key: true }

            default:
                throw new ErrorSemantico('Operador no soportado: '+node.op, node.location)
        }
    }
    
    /**
     * @type { BaseVisitor['visitAgrupacion'] }
    */
    visitAgrupacion(node) {
        return node.exp.accept(this)
    }
    
    /**
     * @type { BaseVisitor['visitDato'] }
    */
    visitDato(node) {
        return {valor:node.valor, tipo:node.tipo}
    }

    /**
     * @type { BaseVisitor['visitDeclaracionVarTipo'] }
    */
    visitDeclaracionVarTipo(node) {
        var tipo = node.tipo
        const nombre = node.id
        // tipo = tipo == "bool" ? "boolean" : tipo

        if(IntepreteVisitor.palabrasReservadas.includes(nombre)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${nombre})`, node.location)

        if(node.exp) {

            const valor = node.exp.accept(this)
    
            // if(tipo != EncontrarTipo(valor)) throw new ErrorSemantico(`El tipo del valor no coincide con el tipo ${tipo}`)
    
            switch (tipo) {
                case "int":
                    if(tipo != valor.tipo){
                        this.entornoActual.setVariable(tipo, nombre, null, node.location)
                        throw new ErrorSemantico(`El tipo del valor(${valor.tipo}) no coincide con el tipo de la variable ${nombre}(${tipo})`, node.location)
                    }

                    this.entornoActual.setVariable(tipo, nombre, valor.valor, node.location)
                    
                    break;
                case "float":
                    if(tipo != valor.tipo && valor.tipo != "int"){
                        this.entornoActual.setVariable(tipo, nombre, null, node.location)
                        throw new ErrorSemantico(`El tipo del valor(${valor.tipo}) no coincide con el tipo de la variable ${nombre}(${tipo})`, node.location)
                    }

                    this.entornoActual.setVariable(tipo, nombre, valor.valor, node.location)
                    
                    break;
                case "string":
                    if(tipo != valor.tipo){
                        this.entornoActual.setVariable(tipo, nombre, null, node.location)
                        throw new ErrorSemantico(`El tipo del valor(${valor.tipo}) no coincide con el tipo de la variable ${nombre}(${tipo})`, node.location)
                    }

                    this.entornoActual.setVariable(tipo, nombre, valor.valor, node.location)
                    
                    break;
                case "boolean":
                    if(tipo != valor.tipo){
                        this.entornoActual.setVariable(tipo, nombre, null, node.location)
                        throw new ErrorSemantico(`El tipo del valor(${valor.tipo}) no coincide con el tipo de la variable ${nombre}(${tipo})`, node.location)
                    }

                    this.entornoActual.setVariable(tipo, nombre, valor.valor, node.location)

                    break;
                case "char":
                    if(tipo != valor.tipo){
                        this.entornoActual.setVariable(tipo, nombre, null, node.location)
                        throw new ErrorSemantico(`El tipo del valor(${valor.tipo}) no coincide con el tipo de la variable ${nombre}(${tipo})`, node.location)
                    }

                    this.entornoActual.setVariable(tipo, nombre, valor.valor, node.location)

                    break;
                default:

                    if(this.entornoActual.getStruct(tipo, node.location) != undefined) {
                        if(tipo != valor.tipo){
                            this.entornoActual.setVariable(tipo, nombre, null, node.location)
                            throw new ErrorSemantico(`El tipo del valor(${valor.tipo}) no coincide con el tipo de la variable ${nombre}(${tipo})`, node.location)
                        }
                        this.entornoActual.setVariable(tipo, nombre, valor.valor, node.location)
                        return
                    }

                    throw new ErrorSemantico(`Tipo ${tipo} no es valido`, node.location)
            }
            return
        }

        // const valor = ValorPorDefecto(node.tipo)

        this.entornoActual.setVariable(tipo, nombre, null, node.location)

    }
    
    /**
     * @type { BaseVisitor['visitDeclaracionVar'] }
    */
    visitDeclaracionVar(node) {
        const nombre = node.id
        const valor = node.exp.accept(this)

        // const tipo = EncontrarTipo(valor)
        if(IntepreteVisitor.palabrasReservadas.includes(nombre)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${nombre})`, node.location)

        if(valor.valor == null) throw new ErrorSemantico(`Error, no se puede asignar un valor nulo a la variable ${nombre}`, node.location)
        this.entornoActual.setVariable(valor.tipo, nombre, valor.valor, node.location)
    }
    
    /**
     * @type { BaseVisitor['visitReferenciaVar'] }
    */
    visitReferenciaVar(node) {
        const nombreVar = node.id
        const posiciones = node.posiciones.map(pos => pos.accept(this))

        const vari = this.entornoActual.getVariable(nombreVar, node.location)

        if(vari == undefined) throw new ErrorSemantico(`Error la variable ${nombreVar} no existe`, node.location)

        if(posiciones.length == 1) {

            const exp = posiciones[0]
            
            // const arreglo = this.entornoActual.getVariable(id.valor, node.location)
            
            if(!Array.isArray(vari.valor)) throw new ErrorSemantico(`Error al acceder al arreglo, la variable no es un arreglo`, node.location)

            // if(Array.isArray(vari.valor[exp.valor])) throw new ErrorSemantico(`Error, la variable ${nombreVar} es una matriz`)

            if(exp.tipo != "int") throw new ErrorSemantico(`Error la expresion para acceder al arreglo no es de tipo int`, node.location)

            if(exp.valor > vari.valor.length - 1) throw new ErrorSemantico(`Error al acceder al arreglo, el indice excede el tamaño del arreglo`, node.location)

            return { valor: vari.valor[exp.valor], tipo: vari.tipo }
        }

        if(posiciones.length > 1) {
            let arreglo = vari.valor

            for (let i = 0; i < posiciones.length; i++) {
                const exp = posiciones[i]
                
                if(!Array.isArray(arreglo)) throw new ErrorSemantico(`Error al acceder al arreglo, la variable no es un arreglo`, node.location)

                // if(!Array.isArray(arreglo[exp.valor])) throw new ErrorSemantico(`Error, la variable ${nombreVar} no es una matriz`)

                if(exp.tipo != "int") throw new ErrorSemantico(`Error la expresion para acceder al arreglo no es de tipo int`, node.location)

                if(exp.valor > arreglo.length - 1) throw new ErrorSemantico(`Error al acceder al arreglo, el indice excede el tamaño del arreglo`, node.location)

                arreglo = arreglo[exp.valor]
            }

            return { valor: arreglo, tipo: vari.tipo }
        }


        return {valor: vari.valor, tipo: vari.tipo}
    }
    
    /**
     * @type { BaseVisitor['visitPrint'] }
    */
    visitPrint(node) {
        // const valor = node.exp.accept(this)

        // this.salida += valor.valor + ' '
        // node.exps.forEach(exp => this.salida += " " + exp.accept(this).valor)
        const expresionesSalida = node.exps.map(exp => {
            const valor = exp.accept(this).valor
            if(valor == null) return "null"
            return valor
        })

        this.salida += expresionesSalida.join(" ") + "\n"
        
    }
    
    /**
     * @type { BaseVisitor['visitExpresionStmt'] }
    */
    visitExpresionStmt(node) {
        node.exp.accept(this)
    }

    /**
     * @type { BaseVisitor['visitAsignacion'] }
    */
    visitAsignacion(node) {
        const valor = node.asign.accept(this)
        const posiciones = node.posiciones.map(pos => pos.accept(this))

        if(posiciones.length == 1) {

            const exp = posiciones[0]

            if(exp.tipo != "int" || exp.valor < 0) throw new ErrorSemantico(`El indice del arreglo debe ser de tipo int o mayor a 0`, node.location)

            this.entornoActual.actualizarVariableArray(node.id, valor, exp, node.location)
            return valor
        }

        if(posiciones.length > 1) {
            posiciones.forEach(pos => {
                if(pos.tipo != "int" || pos.valor < 0) throw new ErrorSemantico(`El indice del arreglo debe ser de tipo int o mayor a 0`, node.location)
            })

            this.entornoActual.actualizarVariableMatriz(node.id, valor, posiciones, node.location)

            return valor
        }


        this.entornoActual.actualizarVariable(node.id, valor, node.location)

        return valor
    }

    /**
     * @type { BaseVisitor['visitBloque'] }
    */
    visitBloque(node) {
        const entornoAnterior = this.entornoActual
        this.entornoActual = new Entorno(entornoAnterior, "Bloque-"+entornoAnterior.nombre)

        node.dcls.forEach(declaracion => declaracion.accept(this))

        this.entornoActual = entornoAnterior
    }

    /**
     * @type { BaseVisitor['visitIf'] }
    */
    visitIf(node) {
        const condicion = node.cond.accept(this)

        if(condicion.valor){
            node.sent.accept(this)
            return
        }

        if(node.sentF){
            node.sentF.accept(this)
        }
    }

    /**
     * @type { BaseVisitor['visitWhile'] }
    */
    visitWhile(node) {

        const entornoAnterior = this.entornoActual

        try {
            while(node.cond.accept(this).valor) {
                node.sent.accept(this)
            }
            
        } catch (error) {
            this.entornoActual = entornoAnterior
            if (error instanceof ExcepcionBreak) {
                console.log("Break en ciclo while")
                return
            }

            if (error instanceof ExcepcionContinue) {
                console.log("Continue en ciclo while")
                return this.visitWhile(node)
            }

            throw error
        }

    }

    /**
     * @type { BaseVisitor['visitFor'] }
    */
    visitFor(node) {
        // const increAnterior = this.continueAnterior
        // this.continueAnterior = node.incre

        // try {
            
        //     const entornoAnterior = this.entornoActual
        //     this.entornoActual = new Entorno(entornoAnterior)
    
        //     node.decl.accept(this)
    
        //     while(node.cond.accept(this).valor) {
    
        //         node.sent.accept(this)
    
        //         node.incre.accept(this)
        //     }
    
        //     this.entornoActual = entornoAnterior
        // } catch (error) {
        //     if (error instanceof ExcepcionBreak) {
        //         console.log("Break en ciclo while")
        //         return
        //     }

        //     if (error instanceof ExcepcionContinue) {
        //         console.log("Continue en ciclo while")
        //         return this.visitWhile(node)
        //     }

        //     throw error
        // }

        const increAnterior = this.continueAnterior
        this.continueAnterior = node.incre

        const forT = new nodos.Bloque({
            dcls: [
                node.decl,
                new nodos.While({
                    cond: node.cond,
                    sent: new nodos.Bloque({
                        dcls: [
                            node.sent,
                            node.incre
                        ]
                    })
                })
            ]
        })

        forT.accept(this)

        this.continueAnterior = increAnterior
    }

    /**
     * @type { BaseVisitor['visitForEach'] }
    */
    visitForEach(node) {
        const entornoAnterior = this.entornoActual
        this.entornoActual = new Entorno(entornoAnterior, "ForEach")

        const idArreglo = node.id2

        const arreglo = this.entornoActual.getVariable(idArreglo, node.location)

        if(!Array.isArray(arreglo.valor)) throw new ErrorSemantico(`Error al recorrer el arreglo, el id ${idArreglo} no es un arreglo`, node.location)

        if(node.tipo != arreglo.tipo) throw new ErrorSemantico(`Error al recorrer el arreglo, el tipo no coincide con el tipo del id`, node.location)
        
        arreglo.valor.forEach(element => {
            if(IntepreteVisitor.palabrasReservadas.includes(node.id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${node.id})`, node.location)
            this.entornoActual.setVariableTemp(arreglo.tipo, node.id, element, node.location)
            node.sent.accept(this)

            this.entornoActual.deleteVariable(node.id, node.location)
        })
        

        this.entornoActual = entornoAnterior
    }

    /**
     * @type { BaseVisitor['visitTernario'] }
    */
    visitTernario(node) {
        if(node.cond.accept(this).valor) {
            return node.exp1.accept(this)
        }else{
            return node.exp2.accept(this)
        }
    }

    /**
     * @type { BaseVisitor['visitSwitch'] }
    */
    visitSwitch(node) {
        
        const cond = node.cond.accept(this)
        let flag = false

        const entornoAnterior = this.entornoActual

        try {
            
            node.cases.forEach( caso => {
                const entornoAnterior = this.entornoActual
                this.entornoActual = new Entorno(entornoAnterior, "Switch-case")
                if(cond.valor == caso.exp.accept(this).valor || flag){
                    flag = true
                    caso.sent.forEach(sentencia => {
                        try {
                            
                            sentencia.accept(this)
                        } catch (error) {
                            if (error instanceof ExcepcionBreak) {
                                console.log("Break en switch")
                                throw error
                            }else {
                                throw error
                            }
                        }
                    })
                }
                this.entornoActual = entornoAnterior
            })
    
            if(node.def){
                if(!flag){

                    node.def.forEach(sent => sent.accept(this))
                }else {
                    try {
                        node.def.forEach(sent => sent.accept(this))
                    } catch (error) {
                        if (error instanceof ExcepcionBreak) {
                            console.log("Break en switch")
                            return
                        }
    
                        throw error
                        
                    }
                }
            }
        } catch (error) {
            this.entornoActual = entornoAnterior
            if (error instanceof ExcepcionBreak) {
                console.log("Break en switch")
                return
            }

            throw error   
        }

    }

    /**
     * @type { BaseVisitor['visitArray'] }
    */
    visitArray(node) {
        const valores = node.valores.map(valor => valor.accept(this))
        const primerTipo = valores[0].tipo; // Suponiendo que siempre hay al menos un valor
        // const tiposIguales = valores.every(valor => valor.tipo === primerTipo);

        
        // if (!tiposIguales) {
        //     throw new ErrorSemantico('No coinciden los tipos en el array');
        // }
        
        // const arrayaRetornar = valores.map(valor => valor.valor)
        return {tipo: primerTipo, valor: valores}
    }

    /**
     * @type { BaseVisitor['visitDclArray'] }
    */
    visitDclArray(node){

        const tipo = node.tipo
        const id = node.id
        const valores = node.valores.accept(this)

        if(IntepreteVisitor.palabrasReservadas.includes(id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${id})`, node.location)

        if(node.nD.length <= 1){
            let arrayTemp
            // const valorP = node.exp1.accept(this)
            if("key" in valores) {
                arrayTemp = valores.valor
            }else {
                arrayTemp = validarYObtenerValores(tipo, valores.valor)
            }
            // if(tipo == "float" && valorP.tipo == "int") {
            //     arrayTemp.push(valorP.valor)
            // }else if(tipo != valorP.tipo) {
            //     throw new ErrorSemantico(`El tipo del array no coincide con el tipo del valor`)
            // }else{
            //     arrayTemp.push(valorP.valor)
            // }

            // arrayTemp.push(valorP.valor)

            // valores.valor.forEach(valor => {
                
            //         // const value = valor.accept(this)
        
            //         if(Array.isArray(valor.valor)) throw new ErrorSemantico(`Error al declarar arreglo ${id}, el valor a asignar no es un valor`)
        
            //         if(tipo == "float" && valor.tipo == "int") {
            //             arrayTemp.push(valor.valor)
            //         }else if(tipo != valor.tipo) {
            //             throw new ErrorSemantico(`El tipo del array no coincide con el tipo del valor`)
            //         }else{
            //             arrayTemp.push(valor.valor)
            //         }
                
            // })
            this.entornoActual.setVariable(tipo, id, arrayTemp, node.location)
        }else{
            const nDimensiones = node.nD.length
            const arrayTemp = validarYObtenerValores(tipo, valores.valor)

            // valores.valor.forEach(valor => {
            //     if(!Array.isArray(valor.valor)) throw new ErrorSemantico(`Error al declarar la matriz ${id}, el valor a asignar no es un arreglo`)
                
            //     const arrayTemp2 = []
            //     valor.valor.forEach(val => {
            //         // valor.forEach(value => {
            //         if(tipo == "float" && val.tipo == "int") {
            //             arrayTemp2.push(val.valor)
            //         }else if(tipo != val.tipo) {
            //             throw new ErrorSemantico(`El tipo del array no coincide con el tipo del valor`)
            //         }else{
            //             arrayTemp2.push(val.valor)
            //         }
            //     })

            //     arrayTemp.push(arrayTemp2)

            // })

            if(!validarDimensiones(arrayTemp, nDimensiones)) throw new ErrorSemantico(`Error al declarar la matriz ${id}, las dimensiones no coinciden`, node.location)
                
            this.entornoActual.setVariable(tipo, id, arrayTemp, node.location)
        }
    }

    /**
     * @type { BaseVisitor['visitDclArrayReser'] }
    */
    visitDclArrayReser(node) {

        const tipo1 = node.tipo1
        const tipo2 = node.tipo2
        const dimensiones = node.nD.length
        const id = node.id
        const tamanos = node.tamanos.map(tamano => tamano.accept(this))

        if(IntepreteVisitor.palabrasReservadas.includes(id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${id})`, node.location)

        if(tipo1 != tipo2) throw new ErrorSemantico(`No coinciden los tipos al querer declarar el arrglo`, node.location)

        if(dimensiones != tamanos.length) throw new ErrorSemantico(`No coinciden las dimensiones al querer declarar el arreglo`, node.location)

        if(dimensiones <= 1 && tamanos.length <= 1) {
            if(tamanos[0].tipo != "int" || tamanos[0].valor < 0) throw new ErrorSemantico(`El tamaño del arreglo debe ser de tipo int o mayor a 0`, node.location)
    
            let valorDefecto = ValorPorDefecto(tipo1)
    
            if(tipo1 == "boolean") valorDefecto = false
    
            let arrayTemp = []
    
            for (let i = 0; i < tamanos[0].valor; i++) {
                arrayTemp[i] = valorDefecto
                
            }
    
            this.entornoActual.setVariable(tipo1, id, arrayTemp, node.location)
        }else {

            tamanos.forEach(tamano => {
                if(tamano.tipo != "int" || tamano.valor < 0) throw new ErrorSemantico(`El tamaño del arreglo debe ser de tipo int o mayor a 0`, node.location)
            })

            let crearMatriz = (tamanos, index = 0) => {
                if (index === tamanos.length) {
                    let valorDefecto = ValorPorDefecto(tipo1)
                    if(tipo1 == "boolean") valorDefecto = false

                    return valorDefecto
                }
                return new Array(tamanos[index].valor).fill().map(() => 
                    crearMatriz(tamanos, index + 1)
                );
            };

            this.entornoActual.setVariable(tipo1, id, crearMatriz(tamanos), node.location)
        }
    }

    /**
     * @type { BaseVisitor['visitDclArrayCopia'] }
    */
    visitDclArrayCopia(node) {
        const tipo = node.tipo
        const id = node.id

        if(IntepreteVisitor.palabrasReservadas.includes(id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${id})`, node.location)

        const arregloACopiar = node.exp.accept(this)

        if(!Array.isArray(arregloACopiar.valor)) throw new ErrorSemantico(`Error al declarar arreglo ${id}, el valor a asignar no es un arreglo`, node.location)
            
        if(Array.isArray(arregloACopiar.valor[0])) throw new ErrorSemantico(`Error al declarar arreglo ${id}, el valor a asignar es una matriz`, node.location)
            
        
        if(tipo == "float" && arregloACopiar.tipo == "int") {
            const nuevoArreglo = [...arregloACopiar.valor]
            this.entornoActual.setVariable(tipo, id, nuevoArreglo, node.location)
        }else if(tipo != arregloACopiar.tipo) {
            throw new ErrorSemantico(`Error al declarar arreglo ${id}, el tipo del arreglo a copiar no es ${tipo}`, node.location)
        }else {
            const nuevoArreglo = [...arregloACopiar.valor]
            this.entornoActual.setVariable(tipo, id, nuevoArreglo, node.location)
        }
    }

    /**
     * @type { BaseVisitor['visitFuncionesArray'] }
    */
    visitFuncionesArray(node) {
        const funcion = node.func
        const id = node.id.accept(this)
        // const posiciones = node.posiciones.map(pos => pos.accept(this))
        
        // const arreglo = this.entornoActual.getVariable(id.valor, node.location)

        
        if(!Array.isArray(id.valor)) throw new ErrorSemantico(`Error al declarar arreglo, el valor a asignar no es un arreglo`, node.location)
            
            
        switch (funcion) {
            case "indexof":
                const valorBuscar = node.exp.accept(this)

                if(id.tipo != valorBuscar.tipo) throw new ErrorSemantico(`El valor a buscar es de diferente tipo al del arreglo`, node.location)

                for (let i = 0; i < id.valor.length; i++) {
                    
                    if(valorBuscar.valor == id.valor[i]) {
                        return { valor: i, tipo: "int" }
                    }
                    
                }
                
                return { valor: -1, tipo: "int" }
        
            case "join":

                var cadena = ""

                for (let i = 0; i < id.valor.length; i++) {
                    
                    cadena += id.valor[i] + ","
                    
                }

                let nuevoTexto = cadena.slice(0, -1);
                
                setIntento(nuevoTexto)

                return { valor: nuevoTexto, tipo: "string" }
            case "length":
                
                return { valor: id.valor.length, tipo: "int" }
            default:
                break;
        }

    }

    /**
     * @type { BaseVisitor['visitDclMatriz'] }
    */
    visitDclMatriz(node) {
        const tipo = node.tipo
        const id = node.id

        let matrizTemp = []

        let arrayTemp = []
        const valorP = node.valorM.exp1.accept(this)

        if(tipo == "float" && valorP.tipo == "int") {
            arrayTemp.push(valorP.valor)
        }else if(tipo != valorP.tipo) {
            throw new ErrorSemantico(`El tipo del array no coincide con el tipo del valor`, node.location)
        }else{
            arrayTemp.push(valorP.valor)
        }

        node.valorM.valores.forEach(valor => {
            const valorN = valor.accept(this)
            if(tipo == "float" && valorN.tipo == "int") {
                arrayTemp.push(valorN.valor)
            }else if(tipo != valorN.tipo) {
                throw new ErrorSemantico(`El tipo del array no coincide con el tipo del valor`, node.location)
            }else{
                arrayTemp.push(valorN.valor)
            }
        })

        matrizTemp.push(arrayTemp)

        node.masVal.forEach(valor => {
            let arrayTemp2 = []

            const primerV = valor.exp1.accept(this)

            if(tipo == "float" && primerV.tipo == "int") {
                arrayTemp.push(primerV.valor)
            }else if(tipo != primerV.tipo) {
                throw new ErrorSemantico(`El tipo del array no coincide con el tipo del valor`, node.location)
            }else{
                arrayTemp2.push(primerV.valor)
            }

            valor.valores.forEach(valor => {
                const valorN = valor.accept(this)
                if(tipo == "float" && valorN.tipo == "int") {
                    arrayTemp2.push(valorN.valor)
                }else if(tipo != valorN.tipo) {
                    throw new ErrorSemantico(`El tipo del array no coincide con el tipo del valor`, node.location)
                }else{
                    arrayTemp2.push(valorN.valor)
                }
            })
            matrizTemp.push(arrayTemp2)
        })

        this.entornoActual.setVariable(tipo, id, matrizTemp, node.location)
    }

    /**
     * @type { BaseVisitor['visitDclMatrizReser'] }
    */
    visitDclMatrizReser(node) {
        const tipo1 = node.tipo1
        const tipo2 = node.tipo2
        const id = node.id
        const tamano1 = node.tamano1.accept(this)
        const tamano2 = node.tamano2.accept(this)

        if(tipo1 != tipo2) throw new ErrorSemantico(`No coinciden los tipos al querer declarar la matriz`, node.location)

        if(tamano1.tipo != "int" || tamano1.valor < 0) throw new ErrorSemantico(`El tamaño del arreglo debe ser de tipo int o mayor a 0`, node.location)
        if(tamano2.tipo != "int" || tamano2.valor < 0) throw new ErrorSemantico(`El tamaño del arreglo debe ser de tipo int o mayor a 0`, node.location)
        
        let matrizTemp = []

        let valorDefecto = ValorPorDefecto(tipo1)

        if(tipo1 == "boolean") valorDefecto = false

        for (let i = 0; i < tamano1.valor; i++) {
            let arrayTemp = []
            for (let j = 0; j < tamano2.valor; j++) {
                arrayTemp[j] = valorDefecto
            }
            matrizTemp[i] = arrayTemp
        }

        this.entornoActual.setVariable(tipo1, id, matrizTemp, node.location)
    }

    /**
     * @type { BaseVisitor['visitStruct'] }
    */
    visitStruct(node) {
        const id = node.id
        
        if(IntepreteVisitor.palabrasReservadas.includes(id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${id})`, node.location)
        
        let arrayAtributos = []

        const primerAtri = node.atrib

        if(IntepreteVisitor.palabrasReservadas.includes(primerAtri.id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${primerAtri.id})`, node.location)

        if(this.entornoActual.getVariable(primerAtri.id, node.location)) throw new ErrorSemantico(`Variable ${primerAtri.id} no puede ser un atributo para un struct`, node.location)

        if(primerAtri.tipo != "int" && primerAtri.tipo != "string" && primerAtri.tipo != "float" && primerAtri.tipo != "boolean" && primerAtri.tipo != "char" ) {
            if(!this.entornoActual.getStruct(primerAtri.tipo, node.location)) throw new ErrorSemantico(`El struct ${primerAtri.id} no esta definido`, node.location) 
        }

        arrayAtributos.push({tipo:primerAtri.tipo, id: primerAtri.id})

        node.atributos.forEach(atributo => {
            const tipo = atributo.tipo
            const id = atributo.id

            if(IntepreteVisitor.palabrasReservadas.includes(atributo.id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${id})`, node.location)

            if(this.entornoActual.getVariable(id, node.location)) throw new ErrorSemantico(`Variable ${id} no puede ser un atributo para un struct`, node.location)

            if(tipo != "int" && tipo != "string" && tipo != "float" && tipo != "boolean" && tipo != "char" ) {
                if(!this.entornoActual.getStruct(tipo, node.location)) throw new ErrorSemantico(`El struct ${id} no esta definido`) 
            }

            if(arrayAtributos.some(item => item.id == id)) throw new ErrorSemantico(`Atributo ${id} ya esta declarado en el struct`, node.location)
            arrayAtributos.push({tipo, id})
        })

        this.entornoActual.setStruct(id, arrayAtributos, node.location)
    }

    /**
     * @type { BaseVisitor['visitBreak'] }
    */
    visitBreak(node) {
        throw new ExcepcionBreak()
    }

    /**
     * @type { BaseVisitor['visitContinue'] }
    */
    visitContinue(node) {
        if(this.continueAnterior){
            return this.continueAnterior.accept(this)
        }

        throw new ExcepcionContinue()
    }

    /**
     * @type { BaseVisitor['visitReturn'] }
    */
    visitReturn(node) {

        let valor = null
        if(node.exp) {
            valor = node.exp.accept(this)
        }
        
        throw new ExcepcionReturn(valor)
    }

    /**
     * @type { BaseVisitor['visitInstanciaExp'] }
    */
    visitInstanciaExp(node) {
        // const id = node.id
        const tipo = node.tipo
        const atributos = node.atributos//.map(atributo => atributo.accept(this))
        let structTemp = {}

        const estructura = this.entornoActual.getStruct(tipo, node.location)

        atributos.forEach(atributo => {
            const id = atributo.id

            if(IntepreteVisitor.palabrasReservadas.includes(id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${id})`, node.location)

            if(!estructura.atributos.some(item => item.id == id)) throw new ErrorSemantico(`El atributo ${id} no esta definido en el struct`, node.location)

            const valor = atributo.exp.accept(this)

            // if(estructura.atributos.find(item => item.id == id).tipo != valor.tipo) throw new ErrorSemantico(`El tipo del valor no coincide con el tipo del atributo ${id}`)

            if (estructura.atributos.find(item => item.id == id).tipo !== valor.tipo) {
                if (!(estructura.atributos.find(item => item.id == id).tipo === "float" && valor.tipo === "int")) {
                    throw new ErrorSemantico(`El tipo del valor no coincide con el tipo del atributo ${id}`, node.location);
                }
            }
            structTemp[id] = valor
        })

        return {valor: structTemp, tipo: tipo}

    }

    /**
     * @type { BaseVisitor['visitInstanciaStruct'] }
    */
    visitInstanciaStruct(node) {
        const tipo = node.tipo
        // const tipo2 = node.tipo2
        const id = node.id
        const exp = node.exp.accept(this)

        if(IntepreteVisitor.palabrasReservadas.includes(id)) throw new ErrorSemantico(`Error, no se puede declarar una variable con el nombre de una palabra reservada(${id})`, node.location)

        if(tipo != exp.tipo) throw new ErrorSemantico(`El tipo de la instancia no coincide con el tipo del struct`, node.location)

        if(this.entornoActual.getVariable(id, node.location)) throw new ErrorSemantico(`El id ${id} no es un struct`, node.location)

        if(!this.entornoActual.getStruct(tipo, node.location)) throw new ErrorSemantico(`El struct ${tipo} no esta definido`, node.location)

        // const estructura = this.entornoActual.getStruct(tipo)

        // let structTemp = {}

        // node.atributos.forEach(atributo => {
        //     const id = atributo.id

        //     if(!estructura.atributos.some(item => item.id == id)) throw new ErrorSemantico(`El atributo ${id} no esta definido en el struct`)

        //     const valor = atributo.exp.accept(this)

        //     if(estructura.atributos.find(item => item.id == id).tipo != valor.tipo) throw new ErrorSemantico(`El tipo del valor no coincide con el tipo del atributo`)

        //     structTemp[id] = valor.valor
        // })

        this.entornoActual.setVariable(tipo, id, exp.valor, node.location)

    }

    /**
     * @type { BaseVisitor['visitAccesoAtributo'] }
    */
    visitAccesoAtributo(node) {
        const id = node.instancia
        // const atributo = node.atributo
        const atributos = [node.atributo, ...node.masA]

        const struct = this.entornoActual.getVariable(id, node.location)
        if(struct == undefined) throw new ErrorSemantico(`El id ${id} no es un struct o no existe`, node.location)

        // ASIGNACION
        if(node.asig){
            const valor = node.asig.accept(this)

            this.entornoActual.actualizarInstancia(id, atributos, valor, node.location)
            return valor
        }

        // ACCESO
        let valorActual = struct
        // let tipoActual = struct.tipo

        for( const atributo of atributos) {
            if (!(atributo in valorActual.valor)) {
                throw new ErrorSemantico(`El atributo ${atributo} no está definido en el struct`, node.location)
            }

            valorActual = valorActual.valor[atributo]
            // tipoActual = valorActual.tipo
        
        }


        // Obtener el valor y el tipo del atributo
        // const valor = struct.valor[atributo];
        // const tipo = valor.tipp;

        return { valor: valorActual.valor, tipo: valorActual.tipo }
    }

    /**
     * @type { BaseVisitor['visitLlamada'] }
    */
    visitLlamada(node) {
        const funcion = node.callee.accept(this).valor

        const args = node.args.map(arg => arg.accept(this))

        if(!(funcion instanceof Invocable)) throw new ErrorSemantico(`No es invocable`, node.location)

        if(funcion.aridad().length != args.length) throw new ErrorSemantico(`La cantidad de argumentos no coincide con la cantidad de parametros`, node.location)

        args.forEach((arg, index) => {
            const tipo = funcion.aridad()[index]
            if(tipo.tipo != arg.tipo) throw new ErrorSemantico(`El tipo del argumento no coincide con el tipo del parametro`, node.location)
            if("dm" in tipo){
                if(tipo.dm.length > 0){
                    if(!Array.isArray(arg.valor)) throw new ErrorSemantico(`El argumento ${index} no es un arreglo`, node.location)
                }
            }
        })

        return funcion.invocar(this, args)
    }

    /**
     * @type { BaseVisitor['visitDclFunc'] }
    */
    visitDclFunc(node) {

        if(IntepreteVisitor.palabrasReservadas.includes(node.id)) throw new ErrorSemantico(`Error, no se puede declarar una funcion con el nombre de una palabra reservada(${node.id})`, node.location)

        const paramsUnicos = new Set(node.params.map(param => param.id))

        if(paramsUnicos.size != node.params.length) throw new ErrorSemantico(`Error, hay parametros repetidos`, node.location)
            
            
        const funcion = new FuncionForeanea(node, this.entornoActual)


        if(node.tipo != "int" && node.tipo != "float" && node.tipo != "string" && node.tipo != "boolean" && node.tipo != "char" && node.tipo != "void") {
            if(!this.entornoActual.getStruct(node.tipo, node.location)) throw new ErrorSemantico(`El tipo no es valido o el struct ${node.tipo} no esta definido`, node.location) 
        }

        this.entornoActual.setVariable(node.tipo, node.id, funcion, node.location)
    }
}