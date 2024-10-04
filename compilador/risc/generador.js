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
        this.depth = 0
        this.contLabel = 0
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

    xor(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("xor", rd, rs1, rs2))
    }

    xori(rd, rs1, inm) {
        this.instrucciones.push(new Instruccion("xori", rd, rs1, inm))
    }

    or(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("or", rd, rs1, rs2))
    }

    and(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("and", rd, rs1, rs2))
    }

    slt(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("slt", rd, rs1, rs2))
    }

    bne(rs1, rs2, inm) {
        this.instrucciones.push(new Instruccion("bne", rs1, rs2, inm))
    }

    blt(rs1, rs2, inm) {
        this.instrucciones.push(new Instruccion("blt", rs1, rs2, inm))
    }

    bge(rs1, rs2, inm) {
        this.instrucciones.push(new Instruccion("bge", rs1, rs2, inm))
    }

    seq(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion("seq", rd, rs1, rs2))
    }

    seqz(rd, rs1) {
        this.instrucciones.push(new Instruccion("seqz", rd, rs1))
    }

    snez(rd, rs1) {
        this.instrucciones.push(new Instruccion("snez", rd, rs1))
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

    beqz(rs1, label) {
        this.instrucciones.push(new Instruccion('beqz', rs1, label))
    }

    j(label) {
        this.instrucciones.push(new Instruccion('j', label))
    }

    label(label) {
        this.instrucciones.push(new Instruccion(label + ':'))
    }

    la(rd, label) {
        this.instrucciones.push(new Instruccion('la', rd, label))
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
            this.push(reg.A0)
            this.add(reg.A0, rd, reg.ZERO)
        }

        this.li(reg.A7, 1)
        this.ecall()

        if(rd !== reg.A0) {
            this.pop(reg.A0)
        }
    }

    printBoolean(rd = reg.A0) {
        const labelNum = this.contLabel++
        
        if (rd !== reg.A0) {
            this.push(reg.A0)
            this.add(reg.T0, rd, reg.ZERO)
        } else {
            this.add(reg.T0, rd, reg.ZERO)
        }

        this.beqz(reg.T0, `print_false_${labelNum}`)
        
        this.la(reg.A0, "val_true")
        this.j(`print_str_${labelNum}`)
        
        this.label(`print_false_${labelNum}`)
        this.la(reg.A0, "val_false")
        
        this.label(`print_str_${labelNum}`)
        this.li(reg.A7, 4)
        this.ecall()

        if (rd !== reg.A0) {
            this.pop(reg.A0)
        }

    }

    printChar(rd = reg.A0) {
        if(rd !== reg.A0) {
            this.push(reg.A0)
            this.add(reg.A0, rd, reg.ZERO)
        }

        this.li(reg.A7, 11)
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
                console.log("aqui1", object)
                this.li(reg.T0, object.valor)
                this.push()
                length = 4
                break

            case "string":
                
                const stringArray = stringToRegistro(object.valor)

                this.comentario(`Guardando string: ${object.valor}`)
                this.addi(reg.T0, reg.HP, 4)

                this.push(reg.T0)

                stringArray.forEach(bloque => {
                    this.li(reg.T0, bloque)
                    // this.push(reg.T0)
                    this.addi(reg.HP, reg.HP, 4)
                    this.sw(reg.T0, reg.HP)
                });

                length = 4

                break

            case "boolean":
                console.log("HEREEE", object)
                this.li(reg.T0, object.valor ? 1 : 0)
                this.push()
                length = 4
                break
            case "char":
                this.li(reg.T0, object.valor.charCodeAt(0))
                this.push()
                length = 4
                break
        
            default:
                break
        }

        this.pushObject({
            length,
            tipo: object.tipo,
            depth: this.depth
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
                // this.addi(rd, reg.SP, 0)
                // this.addi(reg.SP, reg.SP, object.length)
                this.pop(rd)
                break

            case "boolean":
                this.pop(rd)
                break

            case "char":
                this.pop(rd)
                break
        
            default:
                break;
        }
        return object
    }

    // ENTORNO
    newScope() {
        this.depth++
    }

    endScope() {
        let byteOffset = 0
        for(let i = this.stackObject.length - 1; i >= 0; i--) {
            if(this.stackObject[i].depth === this.depth) {
                byteOffset += this.stackObject[i].length
                this.stackObject.pop()
            } else {
                break
            }
        }
        this.depth--
        return byteOffset
    }


    tagObject(id) {
        this.stackObject[this.stackObject.length - 1].id = id
    }

    getObject(id) {
        let byteOffset = 0

        for(let i = this.stackObject.length - 1; i >= 0; i--) {
            if(this.stackObject[i].id === id) {
                return [byteOffset, this.stackObject[i]]
            }

            byteOffset += this.stackObject[i].length
        }

        throw new Error(`Variable ${id} no encontrada`)
    }

    saltoLinea(){
        this.li(reg.A0, 10)
        this.li(reg.A7, 11)
        this.ecall()
    }

    toString() {
        this.endProgram()
        return `.data
    str_true: .string "true\\n"
    str_false: .string "false\\n"\nheap:\n.text\n
# Inicializando el Heap Pointer (HP)
la ${reg.HP}, heap
main:\n${this.instrucciones.map(i => `    ${i}`).join('\n')}`
    }
}