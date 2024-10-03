import { Generador } from "./risc/generador.js";
import { registers as reg } from "./risc/registros.js";
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
        node.izq.accept(this)
        node.der.accept(this)

        this.codigo.popObject(reg.T0)
        this.codigo.popObject(reg.T1)

        switch (node.op) {
            case '+':
                this.codigo.add(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                break
            case '-':
                this.codigo.sub(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                break
            case '*':
                this.codigo.mul(reg.T0, reg.T0, reg.T1)
                this.codigo.push(reg.T0)
                break
            case '/':
                this.codigo.div(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                break
            case '%':
                this.codigo.rem(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                break
        }
        this.codigo.pushObject({ tipo: "int", length: 4 })
        this.codigo.comentario(`Fin Operacion: ${node.op}`)
    }

    /**
     * @type { BaseVisitor['visitOperacionUnaria'] }
    */
    visitOperacionUnaria(node) {
        this.codigo.comentario(`Operacion: ${node.op}`)
        node.exp.accept(this)

        this.codigo.popObject(reg.T0)

        switch (node.op) {
            case '-':
                this.codigo.li(reg.T1, 0)
                this.codigo.sub(reg.T0, reg.T1, reg.T0)
                this.codigo.push(reg.T0)
                this.codigo.pushObject({ tipo: "int", length: 4 })
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
            }
        })

        this.codigo.comentario(`Fin Print`)
        
    }
}