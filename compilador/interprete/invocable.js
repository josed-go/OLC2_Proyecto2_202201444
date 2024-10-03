import { Entorno } from "./entorno.js";
import { IntepreteVisitor } from "./interprete.js";

export class Invocable {


    aridad() {
        throw new Error("Método no implementado");
    }

    /**
     * 
     * @param interprete {IntepreteVisitor}
     * @param args {any[]}
     */
    invocar(interprete, args) {
        throw new Error("Método no implementado");
    }
}