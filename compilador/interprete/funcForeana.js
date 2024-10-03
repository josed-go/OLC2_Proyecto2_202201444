import { Entorno } from "./entorno.js";
import { IntepreteVisitor } from "./interprete.js";
import { Invocable } from "./invocable.js";
import { DclFunc } from "../nodos.js";
import { ErrorSemantico, ExcepcionBreak, ExcepcionContinue, ExcepcionReturn } from "./sentTransferencia.js";

export class FuncionForeanea extends Invocable {
    constructor(node, clousure) {
        super();

        /**
         * @type {DclFunc}
         */
        this.node = node;

        /**
         * @type {Entorno}
         */
        this.clousure = clousure;
    }

    aridad() {
        return this.node.params
    }

    /**
     * @type { Invocable['invocar'] }
    */
    invocar(interprete, args) {
        const newEntorno = new Entorno(this.clousure, this.node.id)
        this.node.params.forEach((param, i) => {
            if(IntepreteVisitor.palabrasReservadas.includes(param.id)) throw new ErrorSemantico(`No se puede usar la palabra reservada ${param.id} como identificador`, this.node.location)
            newEntorno.setVariable(param.tipo, param.id, args[i].valor, this.node.location)
        })

        const entornoAnterior = interprete.entornoActual
        interprete.entornoActual = newEntorno

        try {
            this.node.bloque.accept(interprete)
        } catch (error) {
            
            interprete.entornoActual = entornoAnterior

            if (error instanceof ExcepcionReturn) {

                if(this.node.tipo === "void" && error.value !== null) throw new ErrorSemantico(`La funcion ${this.node.id} no debe retornar un valor porque es de tipo void`, this.node.location)
                
                if(this.node.tipo === "void" && error.value === null) return null

                if(this.node.tipo === "float" && error.value.tipo === "int") error.value.tipo = "float"
                
                if(this.node.tipo !== error.value.tipo) throw new ErrorSemantico(`El tipo de retorno no coincide con el tipo de la funcion ${this.node.id}`, this.node.location)

                if(this.node.dm.length > 0 && !Array.isArray(error.value.valor) ){
                    throw new ErrorSemantico(`El valor de retorno no es un arreglo`, this.node.location)
                }
                
                return error.value
            }

            
            if(this.node.tipo != "void" && error instanceof ExcepcionBreak) throw new ErrorSemantico(`La funcion ${this.node.id} debe retornar un valor de tipo ${this.node.tipo}`, this.node.location)
                
            if(this.node.tipo != "void" && error instanceof ExcepcionContinue) throw new ErrorSemantico(`La funcion ${this.node.id} debe retornar un valor de tipo ${this.node.tipo}`, this.node.location)
                            
            throw error
        }

        if(this.node.tipo !== "void") throw new ErrorSemantico(`La funcion ${this.node.id} debe retornar un valor de tipo ${this.node.tipo}`, this.node.location)

        interprete.entornoActual = entornoAnterior

        return null
    }
}