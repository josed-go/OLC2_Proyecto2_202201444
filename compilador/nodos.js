
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion  {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class OperacionBinaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionBinaria(this);
    }
}
    
export class OperacionUnaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ exp, op }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionUnaria(this);
    }
}
    
export class Agrupacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAgrupacion(this);
    }
}
    
export class Dato extends Expresion {

    /**
    * @param {Object} options
    * @param {any} options.valor Valor del dato
 * @param {string} options.tipo Tipo del dato
    */
    constructor({ valor, tipo }) {
        super();
        
        /**
         * Valor del dato
         * @type {any}
        */
        this.valor = valor;


        /**
         * Tipo del dato
         * @type {string}
        */
        this.tipo = tipo;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDato(this);
    }
}
    
export class DeclaracionVar extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion de la variable
    */
    constructor({ id, exp }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVar(this);
    }
}
    
export class DeclaracionVarTipo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
 * @param {Expresion|undefined} options.exp Expresion de la variable
    */
    constructor({ tipo, id, exp }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion|undefined}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVarTipo(this);
    }
}
    
export class ReferenciaVar extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion[]} options.posiciones Posiciones si es Arreglo|Matriz
    */
    constructor({ id, posiciones }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Posiciones si es Arreglo|Matriz
         * @type {Expresion[]}
        */
        this.posiciones = posiciones;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVar(this);
    }
}
    
export class Print extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.exps Expresion a imprimir
    */
    constructor({ exps }) {
        super();
        
        /**
         * Expresion a imprimir
         * @type {Expresion[]}
        */
        this.exps = exps;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}
    
export class ExpresionStmt extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresionStmt(this);
    }
}
    
export class Asignacion extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Id de la variable
 * @param {Expresion[]} options.posiciones Posiciones si es Arreglo|Matriz
 * @param {Expresion} options.asign Expresion a asignar
    */
    constructor({ id, posiciones, asign }) {
        super();
        
        /**
         * Id de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Posiciones si es Arreglo|Matriz
         * @type {Expresion[]}
        */
        this.posiciones = posiciones;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.asign = asign;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacion(this);
    }
}
    
export class Bloque extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.dcls Sentencias del bloque
    */
    constructor({ dcls }) {
        super();
        
        /**
         * Sentencias del bloque
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBloque(this);
    }
}
    
export class If extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del If
 * @param {Expresion} options.sent Sentencias del If
 * @param {Expresion|undefined} options.sentF Sentencias del else
    */
    constructor({ cond, sent, sentF }) {
        super();
        
        /**
         * Condicion del If
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Sentencias del If
         * @type {Expresion}
        */
        this.sent = sent;


        /**
         * Sentencias del else
         * @type {Expresion|undefined}
        */
        this.sentF = sentF;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIf(this);
    }
}
    
export class While extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del While
 * @param {Expresion} options.sent Sentencias del While
    */
    constructor({ cond, sent }) {
        super();
        
        /**
         * Condicion del While
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Sentencias del While
         * @type {Expresion}
        */
        this.sent = sent;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}
    
export class For extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.decl Declaracion del For
 * @param {Expresion} options.cond Condicion del For
 * @param {Expresion} options.incre Incremento del For
 * @param {Expresion} options.sent Sentencias del For
    */
    constructor({ decl, cond, incre, sent }) {
        super();
        
        /**
         * Declaracion del For
         * @type {Expresion}
        */
        this.decl = decl;


        /**
         * Condicion del For
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Incremento del For
         * @type {Expresion}
        */
        this.incre = incre;


        /**
         * Sentencias del For
         * @type {Expresion}
        */
        this.sent = sent;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFor(this);
    }
}
    
export class ForEach extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo del arreglo
 * @param {string} options.id ID para los elementos
 * @param {string} options.id2 ID del arreglo
 * @param {Expresion} options.sent Sentencias del ForEach
    */
    constructor({ tipo, id, id2, sent }) {
        super();
        
        /**
         * Tipo del arreglo
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * ID para los elementos
         * @type {string}
        */
        this.id = id;


        /**
         * ID del arreglo
         * @type {string}
        */
        this.id2 = id2;


        /**
         * Sentencias del ForEach
         * @type {Expresion}
        */
        this.sent = sent;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitForEach(this);
    }
}
    
export class Ternario extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del ternario
 * @param {Expresion} options.exp1 Expresion true del ternario
 * @param {Expresion} options.exp2 Expresion false del ternario
    */
    constructor({ cond, exp1, exp2 }) {
        super();
        
        /**
         * Condicion del ternario
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Expresion true del ternario
         * @type {Expresion}
        */
        this.exp1 = exp1;


        /**
         * Expresion false del ternario
         * @type {Expresion}
        */
        this.exp2 = exp2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTernario(this);
    }
}
    
export class Switch extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del Switch
 * @param {Expresion[]} options.cases Casos del switch
 * @param {Expresion[]|undefined} options.def Caso por defecto
    */
    constructor({ cond, cases, def }) {
        super();
        
        /**
         * Condicion del Switch
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Casos del switch
         * @type {Expresion[]}
        */
        this.cases = cases;


        /**
         * Caso por defecto
         * @type {Expresion[]|undefined}
        */
        this.def = def;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSwitch(this);
    }
}
    
export class Array extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.valores Expresion a evaluar
    */
    constructor({ valores }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion[]}
        */
        this.valores = valores;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitArray(this);
    }
}
    
export class DclArray extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo del array
 * @param {string} options.id Id del array
 * @param {Expresion} options.valores Valores del array
 * @param {string[]} options.nD Dimensiones del array
    */
    constructor({ tipo, id, valores, nD }) {
        super();
        
        /**
         * Tipo del array
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Id del array
         * @type {string}
        */
        this.id = id;


        /**
         * Valores del array
         * @type {Expresion}
        */
        this.valores = valores;


        /**
         * Dimensiones del array
         * @type {string[]}
        */
        this.nD = nD;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDclArray(this);
    }
}
    
export class DclArrayReser extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo1 Tipo del array
 * @param {string[]} options.nD Dimensiones del array
 * @param {string} options.id Id del array
 * @param {string} options.tipo2 Tipo 2 del array
 * @param {Expresion[]} options.tamanos Tamaño del array
    */
    constructor({ tipo1, nD, id, tipo2, tamanos }) {
        super();
        
        /**
         * Tipo del array
         * @type {string}
        */
        this.tipo1 = tipo1;


        /**
         * Dimensiones del array
         * @type {string[]}
        */
        this.nD = nD;


        /**
         * Id del array
         * @type {string}
        */
        this.id = id;


        /**
         * Tipo 2 del array
         * @type {string}
        */
        this.tipo2 = tipo2;


        /**
         * Tamaño del array
         * @type {Expresion[]}
        */
        this.tamanos = tamanos;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDclArrayReser(this);
    }
}
    
export class DclArrayCopia extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo del array
 * @param {string} options.id Id del array
 * @param {Expresion} options.exp Arreglo a copiar
    */
    constructor({ tipo, id, exp }) {
        super();
        
        /**
         * Tipo del array
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Id del array
         * @type {string}
        */
        this.id = id;


        /**
         * Arreglo a copiar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDclArrayCopia(this);
    }
}
    
export class FuncionesArray extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.func Tipo del array
 * @param {Expresion} options.id Id del array
 * @param {Expresion|undefined} options.exp Expresion a buscar
    */
    constructor({ func, id, exp }) {
        super();
        
        /**
         * Tipo del array
         * @type {string}
        */
        this.func = func;


        /**
         * Id del array
         * @type {Expresion}
        */
        this.id = id;


        /**
         * Expresion a buscar
         * @type {Expresion|undefined}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncionesArray(this);
    }
}
    
export class DclMatriz extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la Matriz
 * @param {string} options.id Id de la Matriz
 * @param {Expresion[]} options.valorM Valor minimo de la Matriz
 * @param {Expresion[]} options.masVal Valores de la Matriz
    */
    constructor({ tipo, id, valorM, masVal }) {
        super();
        
        /**
         * Tipo de la Matriz
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Id de la Matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Valor minimo de la Matriz
         * @type {Expresion[]}
        */
        this.valorM = valorM;


        /**
         * Valores de la Matriz
         * @type {Expresion[]}
        */
        this.masVal = masVal;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDclMatriz(this);
    }
}
    
export class DclMatrizReser extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo1 Tipo de la Matriz
 * @param {string} options.id Id de la Matriz
 * @param {string} options.tipo2 Tipo de la Matriz
 * @param {Expresion} options.tamano1 Tamaño de la Matriz
 * @param {Expresion} options.tamano2 Tamaño de la Matriz
    */
    constructor({ tipo1, id, tipo2, tamano1, tamano2 }) {
        super();
        
        /**
         * Tipo de la Matriz
         * @type {string}
        */
        this.tipo1 = tipo1;


        /**
         * Id de la Matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Tipo de la Matriz
         * @type {string}
        */
        this.tipo2 = tipo2;


        /**
         * Tamaño de la Matriz
         * @type {Expresion}
        */
        this.tamano1 = tamano1;


        /**
         * Tamaño de la Matriz
         * @type {Expresion}
        */
        this.tamano2 = tamano2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDclMatrizReser(this);
    }
}
    
export class Struct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Id del Struct
 * @param {Expresion} options.atrib Primer Atributo del Struct
 * @param {Expresion[]} options.atributos Mas Atributos del Struct
    */
    constructor({ id, atrib, atributos }) {
        super();
        
        /**
         * Id del Struct
         * @type {string}
        */
        this.id = id;


        /**
         * Primer Atributo del Struct
         * @type {Expresion}
        */
        this.atrib = atrib;


        /**
         * Mas Atributos del Struct
         * @type {Expresion[]}
        */
        this.atributos = atributos;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStruct(this);
    }
}
    
export class Break extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBreak(this);
    }
}
    
export class Continue extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContinue(this);
    }
}
    
export class Return extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion|undefined} options.exp Expresion a retornar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a retornar
         * @type {Expresion|undefined}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}
    
export class InstanciaStruct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo del Struct
 * @param {string} options.id Id del Struct
 * @param {Expresion} options.exp Expresion del Struct
    */
    constructor({ tipo, id, exp }) {
        super();
        
        /**
         * Tipo del Struct
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Id del Struct
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion del Struct
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitInstanciaStruct(this);
    }
}
    
export class InstanciaExp extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la instancia
 * @param {Expresion[]} options.atributos Atributos de la instancia
    */
    constructor({ tipo, atributos }) {
        super();
        
        /**
         * Tipo de la instancia
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Atributos de la instancia
         * @type {Expresion[]}
        */
        this.atributos = atributos;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitInstanciaExp(this);
    }
}
    
export class AccesoAtributo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.instancia Id del Struct
 * @param {string} options.atributo Atributo del Struct
 * @param {string[]} options.masA Mas atributos del Struct
 * @param {Expresion|undefined} options.asig Expresion a asignar
    */
    constructor({ instancia, atributo, masA, asig }) {
        super();
        
        /**
         * Id del Struct
         * @type {string}
        */
        this.instancia = instancia;


        /**
         * Atributo del Struct
         * @type {string}
        */
        this.atributo = atributo;


        /**
         * Mas atributos del Struct
         * @type {string[]}
        */
        this.masA = masA;


        /**
         * Expresion a asignar
         * @type {Expresion|undefined}
        */
        this.asig = asig;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAccesoAtributo(this);
    }
}
    
export class Llamada extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.callee Expresion a llamar
 * @param {Expresion[]} options.args Argumentos de la llamada
    */
    constructor({ callee, args }) {
        super();
        
        /**
         * Expresion a llamar
         * @type {Expresion}
        */
        this.callee = callee;


        /**
         * Argumentos de la llamada
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLlamada(this);
    }
}
    
export class DclFunc extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la funcion
 * @param {string[]} options.dm Dimensiones de la funcion
 * @param {string} options.id Id de la funcion
 * @param {strings[]} options.params Parametros de la funcion
 * @param {Bloque} options.bloque Cuerpo de la funcion
    */
    constructor({ tipo, dm, id, params, bloque }) {
        super();
        
        /**
         * Tipo de la funcion
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Dimensiones de la funcion
         * @type {string[]}
        */
        this.dm = dm;


        /**
         * Id de la funcion
         * @type {string}
        */
        this.id = id;


        /**
         * Parametros de la funcion
         * @type {strings[]}
        */
        this.params = params;


        /**
         * Cuerpo de la funcion
         * @type {Bloque}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDclFunc(this);
    }
}
    
export default { Expresion, OperacionBinaria, OperacionUnaria, Agrupacion, Dato, DeclaracionVar, DeclaracionVarTipo, ReferenciaVar, Print, ExpresionStmt, Asignacion, Bloque, If, While, For, ForEach, Ternario, Switch, Array, DclArray, DclArrayReser, DclArrayCopia, FuncionesArray, DclMatriz, DclMatrizReser, Struct, Break, Continue, Return, InstanciaStruct, InstanciaExp, AccesoAtributo, Llamada, DclFunc }
