
/**

 * @typedef {import('./nodos').Expresion} Expresion


 * @typedef {import('./nodos').OperacionBinaria} OperacionBinaria


 * @typedef {import('./nodos').OperacionUnaria} OperacionUnaria


 * @typedef {import('./nodos').Agrupacion} Agrupacion


 * @typedef {import('./nodos').Dato} Dato


 * @typedef {import('./nodos').DeclaracionVar} DeclaracionVar


 * @typedef {import('./nodos').DeclaracionVarTipo} DeclaracionVarTipo


 * @typedef {import('./nodos').ReferenciaVar} ReferenciaVar


 * @typedef {import('./nodos').Print} Print


 * @typedef {import('./nodos').ExpresionStmt} ExpresionStmt


 * @typedef {import('./nodos').Asignacion} Asignacion


 * @typedef {import('./nodos').Bloque} Bloque


 * @typedef {import('./nodos').If} If


 * @typedef {import('./nodos').While} While


 * @typedef {import('./nodos').For} For


 * @typedef {import('./nodos').ForEach} ForEach


 * @typedef {import('./nodos').Ternario} Ternario


 * @typedef {import('./nodos').Switch} Switch


 * @typedef {import('./nodos').Array} Array


 * @typedef {import('./nodos').DclArray} DclArray


 * @typedef {import('./nodos').DclArrayReser} DclArrayReser


 * @typedef {import('./nodos').DclArrayCopia} DclArrayCopia


 * @typedef {import('./nodos').FuncionesArray} FuncionesArray


 * @typedef {import('./nodos').DclMatriz} DclMatriz


 * @typedef {import('./nodos').DclMatrizReser} DclMatrizReser


 * @typedef {import('./nodos').Struct} Struct


 * @typedef {import('./nodos').Break} Break


 * @typedef {import('./nodos').Continue} Continue


 * @typedef {import('./nodos').Return} Return


 * @typedef {import('./nodos').InstanciaStruct} InstanciaStruct


 * @typedef {import('./nodos').InstanciaExp} InstanciaExp


 * @typedef {import('./nodos').AccesoAtributo} AccesoAtributo


 * @typedef {import('./nodos').Llamada} Llamada


 * @typedef {import('./nodos').DclFunc} DclFunc

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }
    

    /**
     * @param {OperacionBinaria} node
     * @returns {any}
     */
    visitOperacionBinaria(node) {
        throw new Error('Metodo visitOperacionBinaria no implementado');
    }
    

    /**
     * @param {OperacionUnaria} node
     * @returns {any}
     */
    visitOperacionUnaria(node) {
        throw new Error('Metodo visitOperacionUnaria no implementado');
    }
    

    /**
     * @param {Agrupacion} node
     * @returns {any}
     */
    visitAgrupacion(node) {
        throw new Error('Metodo visitAgrupacion no implementado');
    }
    

    /**
     * @param {Dato} node
     * @returns {any}
     */
    visitDato(node) {
        throw new Error('Metodo visitDato no implementado');
    }
    

    /**
     * @param {DeclaracionVar} node
     * @returns {any}
     */
    visitDeclaracionVar(node) {
        throw new Error('Metodo visitDeclaracionVar no implementado');
    }
    

    /**
     * @param {DeclaracionVarTipo} node
     * @returns {any}
     */
    visitDeclaracionVarTipo(node) {
        throw new Error('Metodo visitDeclaracionVarTipo no implementado');
    }
    

    /**
     * @param {ReferenciaVar} node
     * @returns {any}
     */
    visitReferenciaVar(node) {
        throw new Error('Metodo visitReferenciaVar no implementado');
    }
    

    /**
     * @param {Print} node
     * @returns {any}
     */
    visitPrint(node) {
        throw new Error('Metodo visitPrint no implementado');
    }
    

    /**
     * @param {ExpresionStmt} node
     * @returns {any}
     */
    visitExpresionStmt(node) {
        throw new Error('Metodo visitExpresionStmt no implementado');
    }
    

    /**
     * @param {Asignacion} node
     * @returns {any}
     */
    visitAsignacion(node) {
        throw new Error('Metodo visitAsignacion no implementado');
    }
    

    /**
     * @param {Bloque} node
     * @returns {any}
     */
    visitBloque(node) {
        throw new Error('Metodo visitBloque no implementado');
    }
    

    /**
     * @param {If} node
     * @returns {any}
     */
    visitIf(node) {
        throw new Error('Metodo visitIf no implementado');
    }
    

    /**
     * @param {While} node
     * @returns {any}
     */
    visitWhile(node) {
        throw new Error('Metodo visitWhile no implementado');
    }
    

    /**
     * @param {For} node
     * @returns {any}
     */
    visitFor(node) {
        throw new Error('Metodo visitFor no implementado');
    }
    

    /**
     * @param {ForEach} node
     * @returns {any}
     */
    visitForEach(node) {
        throw new Error('Metodo visitForEach no implementado');
    }
    

    /**
     * @param {Ternario} node
     * @returns {any}
     */
    visitTernario(node) {
        throw new Error('Metodo visitTernario no implementado');
    }
    

    /**
     * @param {Switch} node
     * @returns {any}
     */
    visitSwitch(node) {
        throw new Error('Metodo visitSwitch no implementado');
    }
    

    /**
     * @param {Array} node
     * @returns {any}
     */
    visitArray(node) {
        throw new Error('Metodo visitArray no implementado');
    }
    

    /**
     * @param {DclArray} node
     * @returns {any}
     */
    visitDclArray(node) {
        throw new Error('Metodo visitDclArray no implementado');
    }
    

    /**
     * @param {DclArrayReser} node
     * @returns {any}
     */
    visitDclArrayReser(node) {
        throw new Error('Metodo visitDclArrayReser no implementado');
    }
    

    /**
     * @param {DclArrayCopia} node
     * @returns {any}
     */
    visitDclArrayCopia(node) {
        throw new Error('Metodo visitDclArrayCopia no implementado');
    }
    

    /**
     * @param {FuncionesArray} node
     * @returns {any}
     */
    visitFuncionesArray(node) {
        throw new Error('Metodo visitFuncionesArray no implementado');
    }
    

    /**
     * @param {DclMatriz} node
     * @returns {any}
     */
    visitDclMatriz(node) {
        throw new Error('Metodo visitDclMatriz no implementado');
    }
    

    /**
     * @param {DclMatrizReser} node
     * @returns {any}
     */
    visitDclMatrizReser(node) {
        throw new Error('Metodo visitDclMatrizReser no implementado');
    }
    

    /**
     * @param {Struct} node
     * @returns {any}
     */
    visitStruct(node) {
        throw new Error('Metodo visitStruct no implementado');
    }
    

    /**
     * @param {Break} node
     * @returns {any}
     */
    visitBreak(node) {
        throw new Error('Metodo visitBreak no implementado');
    }
    

    /**
     * @param {Continue} node
     * @returns {any}
     */
    visitContinue(node) {
        throw new Error('Metodo visitContinue no implementado');
    }
    

    /**
     * @param {Return} node
     * @returns {any}
     */
    visitReturn(node) {
        throw new Error('Metodo visitReturn no implementado');
    }
    

    /**
     * @param {InstanciaStruct} node
     * @returns {any}
     */
    visitInstanciaStruct(node) {
        throw new Error('Metodo visitInstanciaStruct no implementado');
    }
    

    /**
     * @param {InstanciaExp} node
     * @returns {any}
     */
    visitInstanciaExp(node) {
        throw new Error('Metodo visitInstanciaExp no implementado');
    }
    

    /**
     * @param {AccesoAtributo} node
     * @returns {any}
     */
    visitAccesoAtributo(node) {
        throw new Error('Metodo visitAccesoAtributo no implementado');
    }
    

    /**
     * @param {Llamada} node
     * @returns {any}
     */
    visitLlamada(node) {
        throw new Error('Metodo visitLlamada no implementado');
    }
    

    /**
     * @param {DclFunc} node
     * @returns {any}
     */
    visitDclFunc(node) {
        throw new Error('Metodo visitDclFunc no implementado');
    }
    
}
