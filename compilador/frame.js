import { BaseVisitor } from "./visitor.js";

export class FrameVisitor extends BaseVisitor {

    constructor(baseOffset) {
        super()
        this.frame = []
        this.baseOffset = baseOffset
        this.localSize = 0
    }


    visitExpresion(node){}

    visitOperacionBinaria(node){}

    visitOperacionUnaria(node){}

    visitAgrupacion(node){}

    visitDato(node){}

    /**
     * 
     * @type {BaseVisitor['visitDeclaracionVar']}
     */
    visitDeclaracionVar(node){
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize
        })
        this.localSize++
    }

    /**
     * 
     * @type {BaseVisitor['visitDeclaracionVarTipo']}
     */
    visitDeclaracionVarTipo(node){
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize
        })
        this.localSize++
    }

    visitReferenciaVar(node){}

    visitPrint(node){}

    visitExpresionStmt(node){}

    visitAsignacion(node){}

    /**
     * 
     * @type {BaseVisitor['visitBloque']}
     */
    visitBloque(node){
        node.dcls.forEach(stmt => {
            stmt.accept(this)
        })

    }

    /**
     * 
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node){
        node.sent.accept(this)
        if(node.sentF){
            node.sentF.accept(this)
        }
    }

    /**
     * 
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node){
        node.sent.accept(this)
    }

    /**
     * 
     * @type {BaseVisitor['visitFor']}
     */
    visitFor(node){
        node.sent.accept(this)
    }

    /**
     * 
     * @type {BaseVisitor['visitForEach']}
     */
    visitForEach(node){
        node.sent.accept(this)
    }

    visitTernario(node){}

    visitSwitch(node){}

    visitArray(node){}

    visitDclArray(node){}

    visitDclArrayReser(node){}

    visitDclArrayCopia(node){}

    visitFuncionesArray(node){}

    visitDclMatriz(node){}

    visitDclMatrizReser(node){}

    visitStruct(node){}

    visitBreak(node){}

    visitContinue(node){}

    visitReturn(node){}

    visitInstanciaStruct(node){}

    visitInstanciaExp(node){}

    visitAccesoAtributo(node){}

    visitLlamada(node){}

    visitDclFunc(node){}

}