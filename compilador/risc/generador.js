import { registers as reg } from "./registros.js";
import { stringToRegistro } from "./utilidades.js";

class Instruccion {
    constructor(instruccion, rd, rs1, rs2) {
        this.instruccion = instruccion;
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }

    toString() {
        const ope = []
        if (this.rd !== undefined) ope.push(this.rd)
        if (this.rs1 !== undefined) ope.push(this.rs1)
        if (this.rs2 !== undefined) ope.push(this.rs2)
        return `${this.instruccion} ${ope.join(', ')}`
    }
}

export class Generador {
    constructor() {
        this.instrucciones = []
        this.stackObject = []
    }

    add(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("add", rd, rs1, rs2))
    }

    sub(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("sub", rd, rs1, rs2))
    }

    mul(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("mul", rd, rs1, rs2))
    }

    div(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("div", rd, rs1, rs2))
    }

    addi(rd, rs1, inm) {
        this.instrucciones.push(new Instruccion("addi", rd, rs1, inm))
    }

    rem(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("rem", rd, rs1, rs2))
    }

    sw(rs1, rs2, inm = 0) {
        this.instrucciones.push(new Instruccion("sw", rs1, `${inm}(${rs2})`))
    }

    lw(rd, rs1, inm = 0) {
        this.instrucciones.push(new Instruccion("lw", rd, `${inm}(${rs1})`))
    }

    li(rd, inm) {
        this.instrucciones.push(new Instruccion("li", rd, inm))
    }

    push(rd = reg.T0) {
        this.addi(reg.SP, reg.SP, -4)
        this.sw(rd, reg.SP)
    }

    pop(rd = reg.T0) {
        this.lw(rd, reg.SP)
        this.addi(reg.SP, reg.SP, 4)
    }

    ecall() {
        this.instrucciones.push(new Instruccion("ecall"))
    }

    printInt(rd = reg.A0) {

        if(rd !== reg.A0) {
            this.push(r.A0)
            this.add(reg.A0, rd, reg.ZERO)
        }

        this.li(reg.A7, 1)
        this.ecall()

        if(rd !== reg.A0) {
            this.pop(reg.A0)
        }
    }

    printString(rd = reg.A0) {
        if(rd !== reg.A0) {
            this.push(reg.A0)
            this.add(reg.A0, rd, reg.ZERO)
        }

        this.li(reg.A7, 4)
        this.ecall()

        if(rd !== reg.A0) {
            this.pop(reg.A0)
        }
    }

    endProgram() {
        this.li(reg.A7, 10)
        this.ecall()
    }

    comentario(texto) {
        this.instrucciones.push(new Instruccion(`# ${texto}`))
    }

    pushConstante(object) {
        let length = 0

        switch (object.tipo) {
            case "int":
                this.li(reg.T0, object.valor)
                this.push()
                length = 4
                break

            case "string":
                
                const stringArray = stringToRegistro(object.valor).reverse()

                stringArray.forEach(bloque => {
                    this.li(reg.T0, bloque)
                    this.push(reg.T0)
                });

                length = stringArray.length * 4

                break
        
            default:
                break
        }

        this.pushObject({
            length,
            tipo: object.tipo
        })
    }

    pushObject(object) {
        this.stackObject.push(object)
        // this.pushConstante(object)
    }

    popObject(rd = reg.T0) {
        const object = this.stackObject.pop()

        switch (object.tipo) {
            case "int":
                this.pop(rd)
                break;

            case "string":
                this.addi(rd, reg.SP, 0)
                this.addi(reg.SP, reg.SP, object.length)
                break
        
            default:
                break;
        }
        return object
    }

    toString() {
        this.endProgram()
        return `.text\nmain:\n${this.instrucciones.map(i => `    ${i}`).join('\n')}`
    }
}