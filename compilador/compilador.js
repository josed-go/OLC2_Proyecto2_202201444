import { Generador } from "./risc/generador.js";
import { registers as reg } from "./risc/registros.js";
import { stringToLower } from "./risc/utilidades.js";
import { BaseVisitor } from "./visitor.js";

export class CompiladorVisitor extends BaseVisitor {
    constructor() {
        super()
        this.codigo = new Generador()
    }

    /**
     * @type { BaseVisitor['visitExpresionStmt'] }
    */
    visitExpresionStmt(node) {
        node.exp.accept(this)
        this.codigo.popObject(reg.T0)
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

        if(node.op === '&&') {
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
        }

        node.izq.accept(this)
        node.der.accept(this)

        const der = this.codigo.popObject(reg.T0)
        const izq = this.codigo.popObject(reg.T1)

        let tipo = ""

        if(izq.tipo === "string" && der.tipo === "string") {
            this.codigo.add(reg.A0, reg.ZERO, reg.T1)
            this.codigo.add(reg.A1, reg.ZERO, reg.T0)
            this.codigo.callBuiltin("concatenacionString")
            this.codigo.pushObject({ tipo: "string", length: 4})
            return
        }

        switch (node.op) {
            case '+':
                this.codigo.add(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '-':
                this.codigo.sub(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '*':
                this.codigo.mul(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '/':
                this.codigo.div(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '%':
                this.codigo.rem(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "int"
                break
            case '==':
                this.codigo.xor(reg.T0, reg.T0, reg.T1)
                this.codigo.seqz(reg.T0, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break
            case '!=':
                this.codigo.xor(reg.T0, reg.T0, reg.T1)
                this.codigo.snez(reg.T0, reg.T0)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            case '>':
                this.codigo.slt(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            case '>=':
                this.codigo.slt(reg.T0, reg.T1, reg.T0)
                this.codigo.xori(reg.T0, reg.T0, 1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            case '<':
                console.log("111",this.codigo.stackObject)
                this.codigo.slt(reg.T0, reg.T1, reg.T0)
                console.log("222", this.codigo.stackObject)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break
                
            case '<=':
                this.codigo.slt(reg.T0, reg.T0, reg.T1)
                this.codigo.xori(reg.T0, reg.T0, 1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            /*case '&&':
                this.codigo.and(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break

            case '||':
                this.codigo.or(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                tipo = "boolean"
                break*/
        }
        this.codigo.pushObject({ tipo, length: 4 })
        this.codigo.comentario(`Fin Operacion: ${node.op}`)
    }

    /**
     * @type { BaseVisitor['visitOperacionUnaria'] }
    */
    visitOperacionUnaria(node) {
        this.codigo.comentario(`Operacion: ${node.op}`)
        const exp = node.exp
        node.exp.accept(this)

        if(node.op !== "toLowerCase" && node.op !== "toUpperCase") {
            const object = this.codigo.popObject(reg.T0)
        }

        switch (node.op) {
            case '-':
                this.codigo.li(reg.T1, 0)
                this.codigo.sub(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                this.codigo.pushObject({ tipo: "int", length: 4 })
                break

            case '!':
                this.codigo.li(reg.T1, 1)
                this.codigo.xor(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                this.codigo.pushObject({ tipo: "boolean", length: 4 })
                break
            case 'typeof':

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
            const object = this.codigo.popObject(reg.A0)

            if(object.tipo === "int") {
                this.codigo.printInt()
            } else if(object.tipo === "string") {
                this.codigo.printString()
            } else if(object.tipo === "boolean") {
                this.codigo.printBoolean()
            } else if(object.tipo === "char") {
                this.codigo.printChar()
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

        node.exp.accept(this)
        this.codigo.tagObject(node.id)

        this.codigo.comentario(`Fin Declaracion variable: ${node.id}`)
    }

    /**
     * @type { BaseVisitor['visitDeclaracionVarTipo'] }
    */
    visitDeclaracionVarTipo(node) {
        this.codigo.comentario(`Declaracion variable: ${node.id}`)

        node.exp.accept(this)
        this.codigo.tagObject(node.id)

        this.codigo.comentario(`Fin Declaracion variable: ${node.id}`)
    }

    /**
     * @type { BaseVisitor['visitAsignacion'] }
    */
    visitAsignacion(node) {
        this.codigo.comentario(`Asignacion variable: ${node.id}`)
        node.asign.accept(this)
        const valueObject = this.codigo.popObject(reg.T0)
        const [offset, variableO] = this.codigo.getObject(node.id)

        this.codigo.addi(reg.T1, reg.SP, offset)

        this.codigo.sw(reg.T0, reg.T1)

        this.codigo.push(reg.T0)

        this.codigo.pushObject(valueObject)

        this.codigo.comentario(`Fin Asignacion variable: ${node.id}`)
    }

    /**
     * @type { BaseVisitor['visitReferenciaVar'] }
    */
    visitReferenciaVar(node){
        this.codigo.comentario(`Referencia variable: ${node.id}: ${JSON.stringify(this.codigo.stackObject)}`)

        const [offset, variableO] = this.codigo.getObject(node.id)

        this.codigo.addi(reg.T0, reg.SP, offset)
        this.codigo.lw(reg.T1, reg.T0)
        this.codigo.push(reg.T1)
        this.codigo.pushObject({...variableO, id: undefined})

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

        this.codigo.comentario(`Condicion`)
        node.cond.accept(this)
        this.codigo.popObject(reg.T0)
        this.codigo.comentario(`Fin Condicion`)


        const tieneElse = !!node.sentF

        if(tieneElse) {
            const elseLabel = this.codigo.getLabel()
            const endIf = this.codigo.getLabel()

            this.codigo.beq(reg.T0, reg.ZERO, elseLabel)
            this.codigo.comentario("Sentencias verdadera")
            node.sent.accept(this)
            this.codigo.j(endIf)
            this.codigo.addLabel(elseLabel)
            this.codigo.comentario("Sentencias falsa")
            node.sentF.accept(this)
            this.codigo.addLabel(endIf)
        }else {
            const endIf = this.codigo.getLabel()

            this.codigo.beq(reg.T0, reg.ZERO, endIf)
            this.codigo.comentario("Sentencias verdadera")
            node.sent.accept(this)
            this.codigo.addLabel(endIf)
        }

        
        this.codigo.comentario(`Fin If`)
    }
}