import { getIntento } from "../index.js";
import { FrameVisitor } from "./frame.js";
import nodos, { ReferenciaVar } from "./nodos.js";
import { Generador } from "./risc/generador.js";
import { registers as reg, floatRegisters as fr } from "./risc/registros.js";
import { stringToLower, valorPorDefecto } from "./risc/utilidades.js";
import { BaseVisitor } from "./visitor.js";

export class CompiladorVisitor extends BaseVisitor {
    constructor() {
        super()
        this.codigo = new Generador()
        this.sentEscapeCounter = []
        this.continueLabel = null
        this.breakLabel = null
        this.returnLabel = null
        this.funcData = []
        this.dentroFuncion = false
        this.frameDclIndex = 0
        this.errorEnEjecucion = false
    }

    /**
     * @type { BaseVisitor['visitExpresionStmt'] }
    */
    visitExpresionStmt(node) {
        node.exp.accept(this)

        const isFloat = this.codigo.getTopObject().tipo === "float"
        this.codigo.popObject(isFloat ? fr.FT0 : reg.T0)
    }

    /**
     * @type { BaseVisitor['visitDato'] }
    */
    visitDato(node) {
        this.codigo.comentario(`Dato: ${node.valor}`)
        this.codigo.pushConstante({ tipo: node.tipo, valor: node.valor })
        this.codigo.comentario(`Fin Dato: ${node.valor}`)
    }

    /**
     * @type { BaseVisitor['visitOperacionBinaria'] }
    */
    visitOperacionBinaria(node) {
        this.codigo.comentario(`Operacion: ${node.op}`)

        /*if(node.op === '&&') {
            node.izq.accept(this)
            this.codigo.popObject(reg.T0)

            const labelFalse = this.codigo.getLabel()
            const labelEnd = this.codigo.getLabel()

            this.codigo.beq(reg.T0, reg.ZERO, labelFalse)

            node.der.accept(this)
            this.codigo.popObject(reg.T0)
            this.codigo.beq(reg.T0, reg.ZERO, labelFalse)

            this.codigo.li(reg.T0, 1)
            this.codigo.push(reg.T0)
            this.codigo.j(labelEnd)
            this.codigo.addLabel(labelFalse)
            this.codigo.li(reg.T0, 0)
            this.codigo.push(reg.T0)
            this.codigo.addLabel(labelEnd)
            this.codigo.pushObject({ tipo: "boolean", length: 4 })

            return
        }

        if(node.op === '||') {
            node.izq.accept(this)
            this.codigo.popObject(reg.T0)

            const labelTrue = this.codigo.getLabel()
            const labelEnd = this.codigo.getLabel()

            this.codigo.bne(reg.T0, reg.ZERO, labelTrue)
            node.der.accept(this)

            this.codigo.popObject(reg.T0)
            this.codigo.bne(reg.T0, reg.ZERO, labelTrue)

            this.codigo.li(reg.T0, 0)
            this.codigo.push(reg.T0)
            this.codigo.j(labelEnd)
            this.codigo.addLabel(labelTrue)
            this.codigo.li(reg.T0, 1)
            this.codigo.push(reg.T0)
            this.codigo.addLabel(labelEnd)
            this.codigo.pushObject({ tipo: "boolean", length: 4 })
            return
        }*/

        /*if(node.op === '==') {
            node.izq.accept(this)
            node.der.accept(this)

            const der = this.codigo.popObject(reg.T0)
            const izq = this.codigo.popObject(reg.T1)

            const labelTrue = this.codigo.getLabel()
            const labelEnd = this.codigo.getLabel()

            this.codigo.beq(reg.T0, reg.T1, labelTrue)
            this.codigo.li(reg.T0, 0)
            this.codigo.push(reg.T0)
            this.codigo.j(labelEnd)

            this.codigo.addLabel(labelTrue)
            this.codigo.li(reg.T0, 1)
            this.codigo.push(reg.T0)
            this.codigo.addLabel(labelEnd)
            this.codigo.pushObject({ tipo: "boolean", length: 4 })
            return
        }*/

        node.izq.accept(this)
        node.der.accept(this)

        const derFloat = this.codigo.getTopObject().tipo === "float"
        const der = this.codigo.popObject(derFloat ? fr.FT0 : reg.T0)
        const izqFloat = this.codigo.getTopObject().tipo === "float"
        const izq = this.codigo.popObject(izqFloat ? fr.FT1 : reg.T1)

        let tipo = izq.tipo

        if(izq.tipo === "string" && der.tipo === "string") {

            switch (node.op) {
                case '+':
                case '+=':
                    this.codigo.add(reg.A0, reg.ZERO, reg.T1)
                    this.codigo.add(reg.A1, reg.ZERO, reg.T0)
                    this.codigo.callBuiltin("concatenacionString")
                    this.codigo.pushObject({ tipo: "string", length: 4})
        
                    this.codigo.comentario(`Fin Operacion: ${node.op}`)
                    break
                case '==':
                    this.codigo.add(reg.A0, reg.ZERO, reg.T1)
                    this.codigo.add(reg.A1, reg.ZERO, reg.T0)
                    this.codigo.callBuiltin("compararString")
                    this.codigo.push(reg.T0) // REVISAR
                    this.codigo.pushObject({ tipo: "boolean", length: 4})

                    this.codigo.comentario(`Fin Operacion: ${node.op}`)
                    break

                case '!=':
                    this.codigo.add(reg.A0, reg.ZERO, reg.T1)
                    this.codigo.add(reg.A1, reg.ZERO, reg.T0)
                    this.codigo.callBuiltin("compararString")
                    // this.codigo.popObject(reg.T0)
                    this.codigo.xori(reg.T0, reg.T0, 1)
                    this.codigo.push(reg.T0)
                    this.codigo.pushObject({ tipo: "boolean", length: 4})

                    this.codigo.comentario(`Fin Operacion: ${node.op}`)

                    break

                default:
                    break;
            }

            return
        }

        let hayFloat = false

        if(izqFloat || derFloat) {
            if(!izqFloat) this.codigo.fcvtsw(fr.FT1, reg.T1)
            if(!derFloat) this.codigo.fcvtsw(fr.FT0, reg.T0)

            hayFloat = true
        }

        switch (node.op) {
            case '+':

                if(hayFloat) {
                    this.codigo.fadd(fr.FT0, fr.FT0, fr.FT1)
                    this.codigo.pushFloat(fr.FT0)
                    
                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    break
                }

                this.codigo.add(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '-':

                if(hayFloat) {
                    this.codigo.fsub(fr.FT0, fr.FT1, fr.FT0)
                    this.codigo.pushFloat(fr.FT0)
                    
                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    break
                }

                this.codigo.sub(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '*':

                if(hayFloat) {
                    this.codigo.fmul(fr.FT0, fr.FT1, fr.FT0)
                    this.codigo.pushFloat(fr.FT0)
                    
                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    break
                }

                this.codigo.mul(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '/':

                if(hayFloat) {
                    this.codigo.fdiv(fr.FT0, fr.FT1, fr.FT0)
                    this.codigo.pushFloat(fr.FT0)
                    
                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    break
                }

                this.codigo.comentario("Validando division por cero")
                const lblError = this.codigo.getLabel()
                const lblEnd = this.codigo.getLabel()
                const lblEndD = this.codigo.getLabel()
        
                this.codigo.li(reg.T3, 0)
        
                this.codigo.beq(reg.T0, reg.T3, lblError)
        
                this.codigo.j(lblEnd)
        
                this.codigo.addLabel(lblError)
                this.codigo.la(reg.A0, "error_cero")
                this.codigo.li(reg.A7, 4)
                this.codigo.ecall()
                this.codigo.pop(reg.A0)
                this.codigo.saltoLinea()
        
                this.codigo.li(reg.T0, -99)
        
                this.codigo.push(reg.T0)

                this.codigo.j(lblEndD)

                this.codigo.comentario("Fin validacion division por cero")

                this.codigo.addLabel(lblEnd)

                this.codigo.div(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)

                this.codigo.addLabel(lblEndD)


                tipo = "int"
                break
            case '%':
                this.codigo.rem(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '==':

                if(hayFloat) {
                    this.codigo.feq(reg.T0, fr.FT0, fr.FT1)
                    this.codigo.push(reg.T0)
                    tipo = "boolean"

                    this.codigo.pushObject({ tipo, length: 4 })
                    break
                }

                this.codigo.xor(reg.T0, reg.T0, reg.T1)
                this.codigo.seqz(reg.T0, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break
            case '!=':

                if(hayFloat) {
                    this.codigo.feq(reg.T0, fr.FT0, fr.FT1)
                    this.codigo.xori(reg.T0, reg.T0, 1)
                    this.codigo.push(reg.T0)
                    tipo = "boolean"

                    this.codigo.pushObject({ tipo, length: 4 })
                    break
                }

                this.codigo.xor(reg.T0, reg.T0, reg.T1)
                this.codigo.snez(reg.T0, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            case '>':

                if(hayFloat) {
                    this.codigo.flt(reg.T0, fr.FT0, fr.FT1)
                    this.codigo.push(reg.T0)
                    tipo = "boolean"

                    this.codigo.pushObject({ tipo, length: 4 })
                    break
                }

                this.codigo.slt(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            case '>=':

                if(hayFloat) {
                    this.codigo.fle(reg.T0, fr.FT0, fr.FT1)
                    this.codigo.push(reg.T0)
                    tipo = "boolean"

                    this.codigo.pushObject({ tipo, length: 4 })
                    break
                }

                this.codigo.slt(reg.T0, reg.T1, reg.T0)
                this.codigo.xori(reg.T0, reg.T0, 1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            case '<':

                if(hayFloat) {
                    this.codigo.flt(reg.T0, fr.FT1, fr.FT0)
                    this.codigo.push(reg.T0)
                    tipo = "boolean"

                    this.codigo.pushObject({ tipo, length: 4 })
                    break
                }

                this.codigo.slt(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break
                
            case '<=':

                if(hayFloat) {
                    this.codigo.fle(reg.T0, fr.FT1, fr.FT0)
                    this.codigo.push(reg.T0)
                    tipo = "boolean"

                    this.codigo.pushObject({ tipo, length: 4 })
                    break
                }

                this.codigo.slt(reg.T0, reg.T0, reg.T1)
                this.codigo.xori(reg.T0, reg.T0, 1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break
            
            case '+=':

                if(hayFloat) {
                    this.codigo.fadd(fr.FT0, fr.FT0, fr.FT1)
                    this.codigo.pushFloat(fr.FT0)

                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    break
                }

                this.codigo.add(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "int"
                break

            case '-=':

                if(hayFloat) {
                    this.codigo.fsub(fr.FT0, fr.FT1, fr.FT0)
                    this.codigo.pushFloat(fr.FT0)

                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    break
                }

                this.codigo.sub(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "int"
                break

            case '&&':
                this.codigo.and(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            case '||':
                this.codigo.or(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break
        }

        if(!hayFloat) this.codigo.pushObject({ tipo, length: 4 })
        this.codigo.comentario(`Fin Operacion: ${node.op}`)
    }

    /**
     * @type { BaseVisitor['visitOperacionUnaria'] }
    */
    visitOperacionUnaria(node) {
        this.codigo.comentario(`Operacion: ${node.op}`)
        const exp = node.exp
        node.exp.accept(this)

        // if(node.op !== "toLowerCase" && node.op !== "toUpperCase") {
        //     const object = this.codigo.popObject(reg.T0)
        // }

        let object

        switch (node.op) {
            case '-':

                if(this.codigo.getTopObject().tipo === "float") {
                    object = this.codigo.popObject(fr.FT0)
                    this.codigo.li(reg.T1, 0)
                    this.codigo.fcvtsw(fr.FT1, reg.T1)
                    this.codigo.fsub(fr.FT0, fr.FT1, fr.FT0)
                    this.codigo.pushFloat(fr.FT0)
                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    return
                }

                object = this.codigo.popObject(reg.T0)
                this.codigo.li(reg.T1, 0)
                this.codigo.sub(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                this.codigo.pushObject({ tipo: "int", length: 4 })
                break

            case '!':
                object = this.codigo.popObject(reg.T0)
                this.codigo.li(reg.T1, 1)
                this.codigo.xor(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                this.codigo.pushObject({ tipo: "boolean", length: 4 })
                break

            case '++':

                if(this.codigo.getTopObject().tipo === "float") {
                    object = this.codigo.popObject(fr.FT0)
                    this.codigo.li(reg.T1, 1)
                    this.codigo.fcvtsw(fr.FT1, reg.T1)
                    this.codigo.fadd(fr.FT0, fr.FT0, fr.FT1)
                    this.codigo.pushFloat(fr.FT0)
                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    return
                }

                object = this.codigo.popObject(reg.T0)
                this.codigo.addi(reg.T0, reg.T0, 1)
                this.codigo.push(reg.T0)
                this.codigo.pushObject({ tipo: "int", length: 4 })
                break

            case '--':

                if(this.codigo.getTopObject().tipo === "float") {
                    object = this.codigo.popObject(fr.FT0)
                    this.codigo.li(reg.T1, 1)
                    this.codigo.fcvtsw(fr.FT1, reg.T1)
                    this.codigo.fsub(fr.FT0, fr.FT0, fr.FT1)
                    this.codigo.pushFloat(fr.FT0)
                    this.codigo.pushObject({ tipo: "float", length: 4 })
                    return
                }

                object = this.codigo.popObject(reg.T0)
                this.codigo.addi(reg.T0, reg.T0, -1)
                this.codigo.push(reg.T0)
                this.codigo.pushObject({ tipo: "int", length: 4 })
                break
            case 'typeof':
                const isFloat = this.codigo.getTopObject().tipo === "float"
                object = this.codigo.popObject(isFloat ? fr.FT0 : reg.T0)

                switch (object.tipo) {
                    case 'int':
                        this.codigo.pushConstante({ tipo: "string", valor: "int" })
                        break;
                    case 'boolean':
                        this.codigo.pushConstante({ tipo: "string", valor: "boolean" })
                        break
                    case 'string':
                        this.codigo.pushConstante({ tipo: "string", valor: "string" })
                        break
                    case 'char':
                        this.codigo.pushConstante({ tipo: "string", valor: "char" })
                        break
                    case 'float':
                        this.codigo.pushConstante({ tipo: "string", valor: "float" })
                        break
                    default:
                        break
                }
                break

            case 'toLowerCase':
                this.codigo.toLowerOrtoUpper(32)
                break
            case 'toUpperCase':
                this.codigo.toLowerOrtoUpper(-32)
                break

            case 'parseInt':
                this.codigo.popObject(reg.A0)


                /*if(object.tipo === "string") {
                    
                    this.codigo.comentario("Validando tipo de conversion")
                    this.codigo.la(reg.A0, "error_conversion")
                    this.codigo.li(reg.A7, 4)
                    this.codigo.ecall()
                    this.codigo.pop(reg.A0)
                    this.codigo.saltoLinea()
            
                    this.codigo.li(reg.T0, -99)
            
                    this.codigo.push(reg.T0)

                    this.codigo.j(lblEndD)

                    this.codigo.comentario("Fin validacion tipo de conversion")
                
                }else{
                    this.codigo.j(lblEnd)
                }*/

                this.codigo.callBuiltin("parseInt")
                this.codigo.push(reg.A0)

                this.codigo.pushObject({ tipo: "int", length: 4 })
                break

            case 'parsefloat':
                this.codigo.popObject(reg.A0)
                this.codigo.callBuiltin("parseFloat")
                this.codigo.pushFloat(reg.FA0)
                this.codigo.pushObject({ tipo: "float", length: 4 })
                break

            case 'toString':
                const isFloatS = this.codigo.getTopObject().tipo === "float"
                object = this.codigo.popObject(isFloatS ? fr.FA0 : reg.A0)

                if(object.tipo === "int") {
                    this.codigo.callBuiltin("intToString")
                    this.codigo.pushObject({ tipo: "string", length: 4 })

                }else if(object.tipo === "float") {
                    this.codigo.callBuiltin("floatToString")
                    this.codigo.pushObject({ tipo: "string", length: 4 })
                }else if(object.tipo === "boolean") {

                    this.codigo.callBuiltin("booleanToString")
                    this.codigo.pushObject({ tipo: "string", length: 4 })
                    
                }else if(object.tipo === "char") {
                    this.codigo.callBuiltin("charToString")
                    this.codigo.pushObject({ tipo: "string", length: 4 })
                }
                // this.codigo.pushObject({ tipo: "string", length: 4 })

                break
        }

        this.codigo.comentario(`Fin Operacion: ${node.op}`)
    }

    /**
     * @type { BaseVisitor['visitAgrupacion'] }
    */
    visitAgrupacion(node) {
        return node.exp.accept(this)
    }

    /**
     * @type { BaseVisitor['visitPrint'] }
    */
    visitPrint(node) {
        this.codigo.comentario(`Print`)
        node.exps.forEach(exp => {
            exp.accept(this)
            // this.codigo.pop(reg.A0)
            // this.codigo.printInt()

            const isFloat = this.codigo.getTopObject().tipo === "float"

            const object = this.codigo.popObject( isFloat ? fr.FA0 : reg.A0)

            if(object.tipo === "int") {
                this.codigo.printInt()
            } else if(object.tipo === "string") {
                this.codigo.printString()
            } else if(object.tipo === "boolean") {
                this.codigo.printBoolean()
            } else if(object.tipo === "char") {
                this.codigo.printChar()
            }else if(object.tipo === "float") {
                this.codigo.printFloat()
            }else if(object.tipo === "null") {
                this.codigo.printNull()
            }
            this.codigo.espacio()
        })

        this.codigo.saltoLinea()
        this.codigo.comentario(`Fin Print`)
        
    }

    /**
     * @type { BaseVisitor['visitDeclaracionVar'] }
    */
    visitDeclaracionVar(node) {
        this.codigo.comentario(`Declaracion variable: ${node.id}`)

        if(this.dentroFuncion) {
            const localObject = this.codigo.getFrameLocal(this.frameDclIndex)
            const valueObject = this.codigo.popObject(reg.T0)

            this.codigo.addi(reg.T1, reg.FP, -localObject.offset * 4)

            this.codigo.sw(reg.T0, reg.T1)

            localObject.tipo = valueObject.tipo
            this.frameDclIndex++

            return
        }

        node.exp.accept(this)
        this.codigo.tagObject(node.id)

        this.codigo.comentario(`Fin Declaracion variable: ${node.id}`)
    }

    /**
     * @type { BaseVisitor['visitDeclaracionVarTipo'] }
    */
    visitDeclaracionVarTipo(node) {
        this.codigo.comentario(`Declaracion variable: ${node.id}`)

        if(node.exp == undefined){
            this.codigo.pushObject({ tipo: "null", length: 4 })
            this.codigo.tagObject(node.id)
            return
        }

        if(this.dentroFuncion) {
            const localObject = this.codigo.getFrameLocal(this.frameDclIndex)
            const valueObject = this.codigo.popObject(reg.T0)

            this.codigo.addi(reg.T1, reg.FP, -localObject.offset * 4)

            this.codigo.sw(reg.T0, reg.T1)

            localObject.tipo = valueObject.tipo
            this.frameDclIndex++

            return
        }

        node.exp.accept(this)
        this.codigo.tagObject(node.id)

        this.codigo.comentario(`Fin Declaracion variable: ${node.id}`)
    }

    /**
     * @type { BaseVisitor['visitAsignacion'] }
    */
    visitAsignacion(node) {
        this.codigo.comentario(`Asignacion variable: ${node.id}`)
        const posiciones = node.posiciones

        if(posiciones.length > 0) {
            const posicion = posiciones[0]
            node.asign.accept(this)

            if(this.codigo.getTopObject().tipo === "float") {
                posicion.accept(this)
                const valueObject = this.codigo.popObject(reg.T0)
                const indexObject = this.codigo.popObject(fr.FT1)


                const [offset, variableO] = this.codigo.getObject(node.id)

                this.codigo.la(reg.T5, node.id)

                this.codigo.li(reg.T2, 4)

                this.codigo.mul(reg.T0, reg.T0, reg.T2)

                this.codigo.add(reg.T3, reg.T5, reg.T0)

                this.codigo.fsw(fr.FT1, reg.T3)

                this.codigo.pushFloat(fr.FT1)

                this.codigo.pushObject(valueObject)
            }else {
                posicion.accept(this)
                const valueObject = this.codigo.popObject(reg.T0)
                const indexObject = this.codigo.popObject(reg.T1)
    
    
                const [offset, variableO] = this.codigo.getObject(node.id)
    
                this.codigo.la(reg.T5, node.id)
    
                this.codigo.li(reg.T2, 4)
    
                this.codigo.mul(reg.T0, reg.T0, reg.T2)
    
                this.codigo.add(reg.T3, reg.T5, reg.T0)
    
                this.codigo.sw(reg.T1, reg.T3)
    
                this.codigo.push(reg.T1)
    
                this.codigo.pushObject(valueObject)
            }



        }else {
            node.asign.accept(this)

            if(this.codigo.getTopObject().tipo === "float") {  
                const valueObject = this.codigo.popObject(fr.FT0)
                const [offset, variableO] = this.codigo.getObject(node.id)

                this.codigo.li(reg.T1, offset)

                this.codigo.fcvtsw(fr.FT1, reg.T1)

                this.codigo.fcvtsw(fr.FT2, reg.SP)
                this.codigo.addi(reg.T1, reg.SP, offset)
    
                this.codigo.sw(reg.T0, reg.T1)
        
                this.codigo.fadd(fr.FT1, fr.FT2, fr.FT1)
        
                this.codigo.fsw(fr.FT0, reg.T1)
        
                this.codigo.pushFloat(fr.FT0)
        
                this.codigo.pushObject(valueObject)

                this.codigo.comentario(`Fin Asignacion variable: ${node.id}`)
                return
            }

            const valueObject = this.codigo.popObject(reg.T0)
            const [offset, variableO] = this.codigo.getObject(node.id)

            if(this.dentroFuncion) {
                this.codigo.addi(reg.T1, reg.FP, -variableO.offset * 4)
                this.codigo.sw(reg.T0, reg.T1)

                return
            }
    
            this.codigo.addi(reg.T1, reg.SP, offset)
    
            this.codigo.sw(reg.T0, reg.T1)

            variableO.tipo = valueObject.tipo
    
            this.codigo.push(reg.T0)
    
            this.codigo.pushObject(valueObject)
        }

        this.codigo.comentario(`Fin Asignacion variable: ${node.id}`)
    }

    /**
     * @type { BaseVisitor['visitReferenciaVar'] }
    */
    visitReferenciaVar(node){
        this.codigo.comentario(`Referencia variable: ${node.id}: ${JSON.stringify(this.codigo.stackObject)}`)
        const posiciones = node.posiciones

        if(posiciones.length > 0) {
            const posicion = posiciones[0]

            posicion.accept(this)
            this.codigo.popObject(reg.T0)



            const [offset, variableO] = this.codigo.getObject(node.id)

            this.codigo.la(reg.T5, node.id)

            this.codigo.li(reg.T1, 4)

            this.codigo.mul(reg.T0, reg.T0, reg.T1)

            this.codigo.add(reg.T2, reg.T5, reg.T0)
            // this.codigo.addi(reg.T3, reg.SP, offset)
            this.codigo.lw(reg.T1, reg.T2, 0)

            if(variableO.tipo === "float") {
                this.codigo.flw(fr.FT0, reg.T2)
                this.codigo.pushFloat(fr.FT0)
                this.codigo.pushObject({...variableO, id: undefined})
            }else {

                // this.codigo.add(reg.T0, reg.T0, reg.T1)
    
                // this.codigo.lw(reg.T0, reg.T0)
    
                this.codigo.push(reg.T1)
                this.codigo.pushObject({...variableO, id: undefined})
            }
        }else {
            const [offset, variableO] = this.codigo.getObject(node.id)

            if(this.dentroFuncion) {
                this.codigo.addi(reg.T1, reg.FP, -variableO.offset * 4)
                this.codigo.lw(reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                this.codigo.pushObject({...variableO, id: node.id})
                return
            }
    
            this.codigo.addi(reg.T1, reg.SP, offset)
            this.codigo.lw(reg.T0, reg.T1)
            this.codigo.push(reg.T0)
            this.codigo.pushObject({...variableO, id: node.id})
    
        }
        
        this.codigo.comentario(`Fin Referencia variable: ${node.id}: ${JSON.stringify(this.codigo.stackObject)}`)
    }

    /**
     * @type { BaseVisitor['visitBloque'] }
    */
    visitBloque(node) {
        this.codigo.comentario(`Bloque`)
    
        this.codigo.newScope()

        node.dcls.forEach(stmt => stmt.accept(this))

        this.codigo.comentario("Reduciendo pila")
        const bytesAEliminar = this.codigo.endScope()

        if(bytesAEliminar > 0) {
            this.codigo.addi(reg.SP, reg.SP, bytesAEliminar)
        }

        this.codigo.comentario(`Fin Bloque`)
    }

    /**
     * @type { BaseVisitor['visitIf'] }
    */
    visitIf(node) {
        this.codigo.comentario(`If`)
        const endIf = this.codigo.getLabel()
        // const prevReturn = this.returnLabel
        // this.returnLabel = endIf

        this.codigo.comentario(`Condicion`)
        node.cond.accept(this)
        this.codigo.popObject(reg.T0)
        this.codigo.comentario(`Fin Condicion`)


        const tieneElse = !!node.sentF

        if(tieneElse) {
            const elseLabel = this.codigo.getLabel()
            // const endIf = this.codigo.getLabel()

            this.codigo.beq(reg.T0, reg.ZERO, elseLabel)
            this.codigo.comentario("Sentencias verdadera")
            node.sent.accept(this)
            this.codigo.j(endIf)
            this.codigo.addLabel(elseLabel)
            this.codigo.comentario("Sentencias falsa")
            node.sentF.accept(this)
            this.codigo.addLabel(endIf)
        }else {
            // const endIf = this.codigo.getLabel()

            this.codigo.beq(reg.T0, reg.ZERO, endIf)
            this.codigo.comentario("Sentencias verdadera")
            node.sent.accept(this)
            this.codigo.addLabel(endIf)
        }

        // this.returnLabel = prevReturn

        
        this.codigo.comentario(`Fin If`)
    }

    /**
     * @type { BaseVisitor['visitWhile'] }
    */
    visitWhile(node) {
        this.codigo.comentario(`While`)
        const startWhile = this.codigo.getLabel()
        const prevContinue = this.continueLabel
        this.continueLabel = startWhile

        const endWhile = this.codigo.getLabel()
        const prevBreak = this.breakLabel
        this.breakLabel = endWhile

        this.codigo.addLabel(startWhile)

        this.codigo.comentario(`Condicion`)
        node.cond.accept(this)
        this.codigo.popObject(reg.T0)
        this.codigo.comentario(`Fin Condicion`)

        this.codigo.beq(reg.T0, reg.ZERO, endWhile)
        this.codigo.comentario("Sentencias")
        node.sent.accept(this)

        this.codigo.j(startWhile)
        this.codigo.addLabel(endWhile)

        this.continueLabel = prevContinue
        this.breakLabel = prevBreak

        this.codigo.comentario(`Fin While`)
    }

    /**
     * @type { BaseVisitor['visitFor'] }
    */
    visitFor(node) {
        this.codigo.comentario(`For`)
        const startFor = this.codigo.getLabel()
        
        const endFor = this.codigo.getLabel()
        const prevBreak = this.breakLabel
        this.breakLabel = endFor

        const incrementoLabel = this.codigo.getLabel()
        const prevContinue = this.continueLabel
        this.continueLabel = incrementoLabel


        this.codigo.newScope()

        node.decl.accept(this)

        this.codigo.addLabel(startFor)

        this.codigo.comentario(`Condicion`)
        node.cond.accept(this)
        this.codigo.popObject(reg.T0)
        this.codigo.comentario(`Fin Condicion`)

        this.codigo.beq(reg.T0, reg.ZERO, endFor)
        this.codigo.comentario("Sentencias")
        node.sent.accept(this)

        this.codigo.addLabel(incrementoLabel)

        node.incre.accept(this)
        this.codigo.popObject(reg.T0)
        this.codigo.j(startFor)

        this.codigo.addLabel(endFor)

        this.codigo.comentario('Reduciendo la pila');

        const bytesToRemove = this.codigo.endScope();

        if (bytesToRemove > 0) {
            this.codigo.addi(reg.SP, reg.SP, bytesToRemove);
        }

        this.continueLabel = prevContinue
        this.breakLabel = prevBreak

        this.codigo.comentario(`Fin For`)
        
    }

    /**
     * @type { BaseVisitor['visitSwitch'] }
    */
    visitSwitch(node) {
        this.codigo.comentario(`Switch`)

        const endSwitch = this.codigo.getLabel()
        const prevBreak = this.breakLabel
        this.breakLabel = endSwitch
        const defaultLabel = node.def ? this.codigo.getLabel() : endSwitch

        this.sentEscapeCounter.push({ break: endSwitch })

        this.codigo.newScope()

        node.cond.accept(this)
        this.codigo.popObject(reg.T0)

        const casos = node.cases.map(c => ({ label: this.codigo.getLabel(), exp: c.exp }))

        /*console.log(casos)

        casos.forEach(c => {
            // c.exp.accept(this)
            // this.codigo.popObject(reg.T1)


            this.codigo.li(reg.T1, c.exp.valor)


            this.codigo.beq(reg.T0, reg.T1, c.label)
        })*/

        node.cases.forEach((c, index) => {
            this.codigo.comentario(`Validando Case`)
            this.codigo.push(reg.T0)
            // const caseLabel = this.codigo.getLabel()

            c.exp.accept(this)
            this.codigo.popObject(reg.T1)

            this.codigo.pop(reg.T0)

            // // this.codigo.xor(reg.T0, reg.T0, reg.T1)
            // // this.codigo.seqz(reg.T0, reg.T0)

            // // this.codigo.li(reg.T2, 1)

            this.codigo.beq(reg.T0, reg.T1, casos[index].label)

            // if(index < node.cases.length - 1) {
            //     this.codigo.j(caseLabel)
            // } else {
            //     this.codigo.j(defaultLabel)
            // }
            // this.codigo.j(endSwitch)
        })

        this.codigo.j(defaultLabel)

        node.cases.forEach((c, index) => {
            this.codigo.comentario(`Case`)
            this.codigo.addLabel(casos[index].label)
            c.sent.forEach(s => s.accept(this))
        })

        

        if(node.def) {
            this.codigo.addLabel(defaultLabel)
            this.codigo.comentario(`Default`)
            node.def.forEach(s => s.accept(this))
        }
        
        
        this.codigo.addLabel(endSwitch)
        
        this.codigo.endScope()

        this.breakLabel = prevBreak
        this.codigo.comentario(`Fin Switch`)
    }

    /**
     * @type { BaseVisitor['visitBreak'] }
     */
    visitBreak(node) {
        this.codigo.comentario(`Break`)
        this.codigo.j(this.breakLabel)
        this.codigo.comentario(`Fin Break`)
    }

    /**
     * @type { BaseVisitor['visitContinue'] }
     */
    visitContinue(node) {
        this.codigo.comentario(`Continue`)
        this.codigo.j(this.continueLabel)
        this.codigo.comentario(`Fin Continue`)
    }

    /**
     * @type { BaseVisitor['visitReturn'] }
     */
    visitReturn(node) {
        this.codigo.comentario(`Inicio Return`)

        if(node.exp) {
            node.exp.accept(this)
            this.codigo.popObject(reg.A0)
        
            const frameSize = this.funcData[this.dentroFuncion].frameSize
            const returnOffset = frameSize - 1
            this.codigo.addi(reg.T0, reg.FP, -returnOffset * 4)
            this.codigo.sw(reg.A0, reg.T0)
        }

        this.codigo.j(this.returnLabel)

        this.codigo.comentario(`Fin Return`)
    }

    /**
     * @type { BaseVisitor['visitArray'] }
     */
    visitArray(node) {
        this.codigo.comentario(`Array`)
        const valores = node.valores

        valores.forEach((v, index) => {
            v.accept(this)

            const isFloat = this.codigo.getTopObject().tipo === "float"

            this.codigo.popObject(isFloat ? fr.FT0 : reg.T0)
            // this.codigo.add(reg.T2, reg.ZERO, reg.T1)
            if(isFloat) {
                this.codigo.fsw(fr.FT0, reg.T5, index * 4)
            }else {

                this.codigo.sw(reg.T0, reg.T5, index * 4)
            }
        })

        this.codigo.comentario(`Fin Array`)

        return valores
    }

    /**
     * @type { BaseVisitor['visitDclArray'] }
     */
    visitDclArray(node) {
        this.codigo.comentario(`Declaracion Array: ${node.id}`)

        const val = node.valores

        this.codigo.agregarArray(node.id, node.tipo, val.valores.length)

        this.codigo.la(reg.T5, node.id)

        node.valores.accept(this)

        this.codigo.pushObject({ tipo: node.tipo, length: val.valores.length * 4 }) 
        this.codigo.tagObject(node.id)
        this.codigo.comentario(`Fin Declaracion Array: ${node.id}`)
    }

    /**
     * @type { BaseVisitor['visitDclArrayReser'] }
     */
    visitDclArrayReser(node) {
        const tamano = node.tamanos[0]
        const id = node.id
        const tipo = node.tipo1
        
        this.codigo.comentario(`Declaracion Array: ${id}`)

        this.codigo.agregarArray(id, tipo, tamano.valor)

        this.codigo.la(reg.T5, id)

        // tamano.accept(this)
        // this.codigo.popObject(reg.T0)

        const valorDefecto = valorPorDefecto(tipo)

        this.codigo.li(reg.T0, valorDefecto)
        for(let i = 0; i < tamano.valor; i++) {
            this.codigo.sw(reg.T0, reg.T5, i * 4)
            this.codigo.push(reg.T0) // NO SÉ
        }

        this.codigo.pushObject({ tipo, length: tamano.valor * 4 }) 
        this.codigo.tagObject(id)


        this.codigo.comentario(`Fin Declaracion Array: ${id}`)
    }

    /**
     * @type { BaseVisitor['visitDclArrayCopia'] }
     */
    visitDclArrayCopia(node) {
        this.codigo.comentario(`Declaracion Array: ${node.id}`)
        const tipo = node.tipo
        const id = node.id
        const arrayCopia = node.exp
        const endCopia = this.codigo.getLabel()

        arrayCopia.accept(this)
        const object = this.codigo.popObject(reg.T0)

        this.codigo.agregarArray(id, tipo, object.length / 4)

        
        this.codigo.li(reg.T1, object.length / 4)
        this.codigo.la(reg.T5, object.id)
        this.codigo.la(reg.T3, id)

        this.codigo.comentario("Haciendo copia de array")
        const copyLoop = this.codigo.addLabel()

        this.codigo.lw(reg.T4, reg.T5, 0)
        this.codigo.sw(reg.T4, reg.T3, 0)
        this.codigo.addi(reg.T5, reg.T5, 4)
        this.codigo.addi(reg.T3, reg.T3, 4)
        this.codigo.addi(reg.T1, reg.T1, -1)
        this.codigo.bnez(reg.T1, copyLoop)

        this.codigo.comentario("Fin copia de array")
        // this.codigo.j(copyLoop)

        this.codigo.pushObject({ tipo, length: object.length })
        this.codigo.tagObject(id)

        // this.codigo.j(endCopia)
        // this.codigo.addLabel(endCopia)


        this.codigo.comentario(`Fin Declaracion Array: ${id}`)
    }

    /**
     * @type { BaseVisitor['visitFuncionesArray'] }
     */
    visitFuncionesArray(node) {
        const func = node.func
        const id = node.id
        this.codigo.comentario(`Funciones Array: ${func}`)

        id.accept(this)

        const isFloat = this.codigo.getTopObject().tipo === "float"

        const object = this.codigo.popObject(isFloat ? fr.FT0 : reg.T0)

        switch (func) {
            case "indexof":

                node.exp.accept(this)

                const isFloat = this.codigo.getTopObject().tipo === "float"

                const exp = this.codigo.popObject( isFloat ? fr.FT1 : reg.T1)

                const startLoop = this.codigo.getLabel()
                const endLoop = this.codigo.getLabel()
                const encontrado = this.codigo.getLabel()
                const noEncontrado = this.codigo.getLabel()

                this.codigo.la(reg.T5, object.id)
                this.codigo.li(reg.T2, object.length / 4)
                this.codigo.li(reg.T3, 0)
                
                this.codigo.comentario("Loop para recorrer el array")
                if(isFloat) {
                    this.codigo.addLabel(startLoop)

                    this.codigo.beq(reg.T2, reg.ZERO, noEncontrado)
                    this.codigo.flw(fr.FT2, reg.T5, 0)
                    this.codigo.feq(reg.T0, fr.FT1, fr.FT2)

                    this.codigo.bnez(reg.T0, encontrado)

                    this.codigo.addi(reg.T5, reg.T5, 4)
                    this.codigo.addi(reg.T3, reg.T3, 1)
                    this.codigo.addi(reg.T2, reg.T2, -1)

                    this.codigo.j(startLoop)
    
                    this.codigo.addLabel(encontrado)
                    this.codigo.push(reg.T3)
                    this.codigo.j(endLoop)
    
                    this.codigo.addLabel(noEncontrado)
                    this.codigo.li(reg.T0, -1)
                    this.codigo.push(reg.T0)
                
                }else if (object.tipo == "string"){

                    this.codigo.add(reg.A0, reg.ZERO, reg.T1)
                    
                    this.codigo.addLabel(startLoop)

                    this.codigo.beq(reg.T2, reg.ZERO, noEncontrado)
                    this.codigo.lw(reg.T4, reg.T5, 0)

                    this.codigo.add(reg.A1, reg.ZERO, reg.T4)

                    this.codigo.callBuiltin("compararString")
                    // this.codigo.push(reg.T0)
                    this.codigo.li(reg.T4, 1)
                    this.codigo.beq(reg.T0, reg.T4, encontrado)

                    this.codigo.addi(reg.T5, reg.T5, 4)
                    this.codigo.addi(reg.T3, reg.T3, 1)
                    this.codigo.addi(reg.T2, reg.T2, -1)
                    this.codigo.j(startLoop)

                    this.codigo.addLabel(encontrado)
                    this.codigo.push(reg.T3)
                    this.codigo.j(endLoop)

                    this.codigo.addLabel(noEncontrado)
                    this.codigo.li(reg.T0, -1)
                    this.codigo.push(reg.T0)
                
                }else {

                    
                    this.codigo.addLabel(startLoop)
                    
                    this.codigo.beq(reg.T2, reg.ZERO, noEncontrado)
                    this.codigo.lw(reg.T4, reg.T5, 0)
                    this.codigo.beq(reg.T4, reg.T1, encontrado)
    
                    this.codigo.addi(reg.T5, reg.T5, 4)
                    this.codigo.addi(reg.T3, reg.T3, 1)
                    this.codigo.addi(reg.T2, reg.T2, -1)
                    this.codigo.j(startLoop)
    
                    this.codigo.addLabel(encontrado)
                    this.codigo.push(reg.T3)
                    this.codigo.j(endLoop)
    
                    this.codigo.addLabel(noEncontrado)
                    this.codigo.li(reg.T0, -1)
                    this.codigo.push(reg.T0)
                    // this.codigo.j(endLoop)
    
                    
                }
                this.codigo.addLabel(endLoop)
                this.codigo.comentario("Fin loop para recorrer el array")


        


                this.codigo.pushObject({ tipo: "int", length: 4 })
                // this.codigo.lw(reg.T4, reg.T5, 0)
                // this.codigo.sw(reg.T4, reg.T3, 0)
                // this.codigo.addi(reg.T5, reg.T5, 4)
                // this.codigo.addi(reg.T3, reg.T3, 4)
                // this.codigo.addi(reg.T1, reg.T1, -1)
                // this.codigo.bnez(reg.T0, startLoop)
                // this.codigo.bnez(reg.T1, startLoop)


                break
            case "join":
                /*this.codigo.la(reg.A0, object.id)
                this.codigo.li(reg.A1, object.length / 4)

                this.codigo.callBuiltin("joinArray")
                this.codigo.push(reg.A0)
                this.codigo.pushObject({ tipo: "string", length: 4 })*/
                this.codigo.pushConstante({ tipo: "string", valor: getIntento() })

                this.codigo.pushObject({ tipo: "string", length: 4 })

                break;
            case "length":
                const length = object.length / 4

                this.codigo.li(reg.T0, length)
                this.codigo.push(reg.T0)

                this.codigo.pushObject({ tipo: "int", length: 4 })
                break;
        
            default:
                break;
        }
        this.codigo.comentario(`Fin Funciones Array: ${func}`)
    }

    /**
     * @type { BaseVisitor['visitForEach'] }
     */
    visitForEach(node) {
        this.codigo.comentario(`ForEach`)
        const idArreglo = node.id2
        const idVariable = node.id
        const tipo = node.tipo
    
        const startLoop = this.codigo.getLabel()
        const endLoop = this.codigo.getLabel()
        const prevBreak = this.breakLabel
        this.breakLabel = endLoop
    
        this.codigo.newScope()
    
        const [offset, arreglo] = this.codigo.getObject(idArreglo)
    
        const longitud = arreglo.length / 4
    
        this.codigo.li(reg.T4, 0)
        this.codigo.li(reg.T2, longitud)
    
        this.codigo.la(reg.T5, arreglo.id)

        this.codigo.addLabel(startLoop)
    
        this.codigo.beq(reg.T4, reg.T2, endLoop)
    
        this.codigo.slli(reg.T3, reg.T4, 2)
        
        this.codigo.add(reg.T3, reg.T5, reg.T3)
        this.codigo.lw(reg.T0, reg.T3)
    
        this.codigo.push(reg.T0)
        this.codigo.tagObject(idVariable)
    
        node.sent.accept(this)
    
        const bytesAEliminar = this.codigo.endScope()
        if (bytesAEliminar > 0) {
            this.codigo.addi(reg.SP, reg.SP, bytesAEliminar)
        }
    
        this.codigo.newScope()
    
        this.codigo.addi(reg.T4, reg.T4, 1)
    
        this.codigo.j(startLoop)
    
        this.codigo.addLabel(endLoop)
    
        this.breakLabel = prevBreak
    
        this.codigo.comentario(`Fin ForEach`)
    }

    /**
    * @type { BaseVisitor['visitTernario'] }
    */
    visitTernario(node) {
        this.codigo.comentario(`Ternario`)
        node.cond.accept(this)
        this.codigo.popObject(reg.T0)

        const verdadero = this.codigo.getLabel()
        const falso = this.codigo.getLabel()
        const fin = this.codigo.getLabel()

        this.codigo.beq(reg.T0, reg.ZERO, falso)
        node.exp1.accept(this)
        this.codigo.j(fin)

        this.codigo.addLabel(falso)
        node.exp2.accept(this)

        this.codigo.addLabel(fin)
        this.codigo.comentario(`Fin Ternario`)

    }

    /**
     * @type { BaseVisitor['visitDclFunc'] }
     */
    visitDclFunc(node) {
        this.codigo.comentario(`Declaracion Funcion: ${node.id}`)
        const tamanoBase = 2
        const paramsSize = node.params.length

        const frameVisitor = new FrameVisitor(tamanoBase + paramsSize)

        node.bloque.accept(frameVisitor)

        const localFrame = frameVisitor.frame
        const localSize = localFrame.length

        const returnSize = 1

        const totalSize = tamanoBase + paramsSize + localSize + returnSize

        this.funcData[node.id] = {
            frameSize: totalSize,
            returnTipo: node.tipo
        }

        const instruccionPrin = this.codigo.instrucciones
        const instruccionesDeDclFunc = []
        this.codigo.instrucciones = instruccionesDeDclFunc

        node.params.forEach((p, index) => {
            this.codigo.pushObject({
                id: p.id,
                tipo: p.tipo,
                length: 4,
                offset: tamanoBase + index
            })
        })

        localFrame.forEach( variable => {
            this.codigo.pushObject({
                ...variable,
                length: 4,
                tipo: 'local'
            })
        })

        this.dentroFuncion = node.id
        this.frameDclIndex = 0
        this.returnLabel = this.codigo.getLabel()

        this.codigo.addLabel(node.id)
        
        node.bloque.accept(this)

        this.codigo.addLabel(this.returnLabel)

        this.codigo.add(reg.T0, reg.ZERO, reg.FP)
        this.codigo.lw(reg.RA, reg.T0)

        this.codigo.jalr(reg.ZERO, reg.RA, 0)

        this.codigo.comentario(`Fin Declaracion Funcion: ${node.id}`)

        for(let i = 0; i < paramsSize+localSize; i++) {
            this.codigo.stackObject.pop()
        }

        this.codigo.instrucciones = instruccionPrin
        
        instruccionesDeDclFunc.forEach(i => {
            this.codigo.funcInstrucciones.push(i)
        })

        this.dentroFuncion = false
        
    }

    /**
     * @type { BaseVisitor['visitLlamada'] }
     */
    visitLlamada(node) {
        if(!(node.callee instanceof ReferenciaVar)) return

        const idFuncion = node.callee.id

        this.codigo.comentario(`Llamada Funcion: ${idFuncion}`)

        const returnLlamadaLbl = this.codigo.getLabel()

        this.codigo.addi(reg.SP, reg.SP, -4 * 2)
        node.args.forEach((arg, index) => {
            arg.accept(this)
            /*this.codigo.popObject(reg.T0)
            this.codigo.addi(reg.T1, reg.SP, -4 * (3+index)) // Revisar
            this.codigo.sw(reg.T0, reg.T1)*/
        })

        this.codigo.addi(reg.SP, reg.SP, 4*(node.args.length + 2))

        this.codigo.addi(reg.T1, reg.SP, -4)

        this.codigo.la(reg.T0, returnLlamadaLbl)
        this.codigo.push(reg.T0)

        this.codigo.push(reg.FP)
        this.codigo.addi(reg.FP, reg.T1, 0)

        const frameSize = this.funcData[idFuncion].frameSize

        this.codigo.addi(reg.SP, reg.SP, -(frameSize - 2) * 4)

        this.codigo.j(idFuncion)
        this.codigo.addLabel(returnLlamadaLbl)


        const returnSize = frameSize - 1

        this.codigo.addi(reg.T0, reg.FP, -returnSize * 4)
        this.codigo.lw(reg.A0, reg.T0)

        this.codigo.addi(reg.T0, reg.FP, -4)
        this.codigo.lw(reg.FP, reg.T0)

        this.codigo.addi(reg.SP, reg.SP, frameSize * 4)

        this.codigo.push(reg.A0)

        this.codigo.pushObject({
            tipo: this.funcData[idFuncion].returnTipo,
            length: 4
        })

        this.codigo.comentario(`Fin Llamada Funcion: ${idFuncion}`)

    }




}