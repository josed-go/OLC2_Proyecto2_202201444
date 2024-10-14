import { builtins } from "./builtins.js";
import { registers as reg, floatRegisters as fr } from "./registros.js";
import { numberToF32, obtenerTamano, stringA1Byte, stringToRegistro } from "./utilidades.js";

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
        this._usedBuiltins = new Set()
        this.arrayCount = []
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

    slli(rd, rs1, inm) {
        this.instrucciones.push(new Instruccion("slli", rd, rs1, inm))
    }

    bne(rs1, rs2, label) {
        this.instrucciones.push(new Instruccion("bne", rs1, rs2, label))
    }

    blt(rs1, rs2, label) {
        this.instrucciones.push(new Instruccion("blt", rs1, rs2, label))
    }

    bltz(rs1, label) {
        this.instrucciones.push(new Instruccion("bltz", rs1, label))
    }

    bge(rs1, rs2, label) {
        this.instrucciones.push(new Instruccion("bge", rs1, rs2, label))
    }

    bgez(rs1, label) {
        this.instrucciones.push(new Instruccion("bgez", rs1, label))
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

    neg(rd, rs1) {
        this.instrucciones.push(new Instruccion("neg", rd, rs1))
    }

    sw(rs1, rs2, inm = 0) {
        this.instrucciones.push(new Instruccion("sw", rs1, `${inm}(${rs2})`))
    }

    sb(rs1, rs2, inm = 0) {
        this.instrucciones.push(new Instruccion("sb", rs1, `${inm}(${rs2})`))
    }

    lw(rd, rs1, inm = 0) {
        this.instrucciones.push(new Instruccion("lw", rd, `${inm}(${rs1})`))
    }

    lb(rd, rs1, inm = 0) {
        this.instrucciones.push(new Instruccion("lb", rd, `${inm}(${rs1})`))
    }

    li(rd, inm) {
        this.instrucciones.push(new Instruccion("li", rd, inm))
    }

    beq(rs1, rs2, label) {
        this.instrucciones.push(new Instruccion('beq', rs1, rs2, label))
    }

    bnez(rs, label) {
        this.instrucciones.push(new Instruccion('bnez', rs, label));
    }

    beqz(rs1, label) {
        this.instrucciones.push(new Instruccion('beqz', rs1, label))
    }

    j(label) {
        this.instrucciones.push(new Instruccion('j', label))
    }

    jal(label) {
        this.instrucciones.push(new Instruccion('jal', label))
    }

    ret() {
        this.instrucciones.push(new Instruccion('ret'))
    }

    label(label) {
        this.instrucciones.push(new Instruccion(label + ':'))
    }

    addLabel(label) {
        label = label || this.getLabel()
        this.instrucciones.push(new Instruccion(`${label}:`))
        return label
    }

    getLabel(){
        return `L_${this.contLabel++}`
    }

    la(rd, label) {
        this.instrucciones.push(new Instruccion('la', rd, label))
    }

    mv(rd, rs1) {
        this.instrucciones.push(new Instruccion('mv', rd, rs1))
    }

    push(rd = reg.T0) {
        this.addi(reg.SP, reg.SP, -4)
        this.sw(rd, reg.SP)
    }

    pushFloat(rd = fr.FT0) {
        this.addi(reg.SP, reg.SP, -4)
        this.fsw(rd, reg.SP)
    }

    pop(rd = reg.T0) {
        this.lw(rd, reg.SP)
        this.addi(reg.SP, reg.SP, 4)
    }

    ecall() {
        this.instrucciones.push(new Instruccion("ecall"))
    }

    callBuiltin(builtin) {
        if(!builtins[builtin]) {
            throw new Error(`Builtin ${builtin} no encontrado`)
        }
        this._usedBuiltins.add(builtin)
        this.jal(builtin)
    }

    toLowerOrtoUpper(val) {
        const endLabel = this.getLabel();
        const loopLabel = this.getLabel();
        const skipLowerLabel = this.getLabel();
    
        this.pop(reg.T0)
    
        this.push(reg.T0);
    
        this.label(loopLabel);
        
        this.lb(reg.T1, reg.T0);
    
        this.beqz(reg.T1, endLabel);
    
        if(val == 32){
            this.li(reg.T2, 65)
            this.li(reg.T3, 90)
        }else {
            this.li(reg.T2, 97)
            this.li(reg.T3, 122)
        }

        this.slt(reg.T4, reg.T1, reg.T2)
        this.bnez(reg.T4, skipLowerLabel)
        this.slt(reg.T4, reg.T3, reg.T1)
        this.bnez(reg.T4, skipLowerLabel)
    
        this.addi(reg.T1, reg.T1, val)
        
        this.sb(reg.T1, reg.T0)
    
        this.label(skipLowerLabel)
        this.addi(reg.T0, reg.T0, 1)
        this.j(loopLabel)
    
        this.label(endLabel)
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
        
        /*if (rd !== reg.A0) {
            this.push(reg.A0)
            this.add(reg.T0, rd, reg.ZERO)
        } else {
            this.add(reg.T0, rd, reg.ZERO)
        }*/

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
    
    agregarArray(id, tipo, length) {
        this.arrayCount.push({id, space: obtenerTamano(tipo) * length})
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
                
                const stringArray = stringA1Byte(object.valor)

                this.comentario(`Guardando string: ${object.valor}`)
                // this.addi(reg.T0, reg.HP, 4)

                // this.push(reg.T0)
                this.push(reg.HP)

                stringArray.forEach(char => {
                    this.li(reg.T0, char)
                    // this.push(reg.T0)
                    // this.addi(reg.HP, reg.HP, 4)
                    // this.sw(reg.T0, reg.HP)
                    this.sb(reg.T0, reg.HP)
                    this.addi(reg.HP, reg.HP, 1)
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

            case "float":
                const ieee754 = numberToF32(object.valor)
                this.li(reg.T0, ieee754)
                this.push(reg.T0)
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
        this.stackObject.push({
            ...object,
            depth: this.depth,
        })
        // this.pushConstante(object)
    }

    popFloat(rd = fr.FT0) {
        this.flw(rd, reg.SP)
        this.addi(reg.SP, reg.SP, 4)
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

            case "float":
                this.popFloat(rd)
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

    deleteObject(id) {
        const index = this.stackObject.findIndex(object => object.id === id)

        if(index !== -1) {
            this.stackObject.splice(index, 1)
        }
    }

    getTopObject() {
        return this.stackObject[this.stackObject.length - 1]
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

    espacio(){
        this.li(reg.A0, 32)
        this.li(reg.A7, 11)
        this.ecall()
    }

    toString() {
        this.comentario("Fin del programa")
        this.endProgram()
        this.comentario("Builtins")

        Array.from(this._usedBuiltins).forEach(builtin => {
            this.addLabel(builtin)
            builtins[builtin](this)
            this.ret()
        })

        return `.data\n${this.arrayCount.map((array, index) => `${array.id}: .space ${array.space}`).join('\n')}
    val_true: .string "true"
    val_false: .string "false"
    val_int: .string "int"
    val_string: .string "string"
    val_bool: .string "boolean"
    val_char: .string "char"\nheap:\n.text\n
# Inicializando el Heap Pointer (HP)
la ${reg.HP}, heap
main:\n${this.instrucciones.map(i => `    ${i}`).join('\n')}`
    }

    // --- Instruciones flotantes

    fadd(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion('fadd.s', rd, rs1, rs2))
    }

    fsub(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion('fsub.s', rd, rs1, rs2))
    }

    fmul(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion('fmul.s', rd, rs1, rs2))
    }

    fdiv(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion('fdiv.s', rd, rs1, rs2))
    }

    fli(rd, inmediato) {
        this.instrucciones.push(new Instruccion('fli.s', rd, inmediato))
    }

    fmvs(rd, rs1) {
        this.instrucciones.push(new Instruccion('fmv.s.x', rd, rs1))
    }

    fmvx(rd, rs1) {
        this.instrucciones.push(new Instruccion('fmv.x.s', rd, rs1))
    }


    flw(rd, rs1, inmediato = 0) {
        this.instrucciones.push(new Instruccion('flw', rd, `${inmediato}(${rs1})`))
    }

    fsw(rs1, rs2, inmediato = 0) {
        this.instrucciones.push(new Instruccion('fsw', rs1, `${inmediato}(${rs2})`))
    }

    feq(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion('feq.s', rd, rs1, rs2))
    }

    flt(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion('flt.s', rd, rs1, rs2))
    }

    fle(rd, rs1, rs2) {
        this.instrucciones.push(new Instruccion('fle.s', rd, rs1, rs2))
    }

    fcvtsw(rd, rs1) {
        this.instrucciones.push(new Instruccion('fcvt.s.w', rd, rs1))
    }

    fneg(rd, rs1) {
        this.instrucciones.push(new Instruccion('fneg.s', rd, rs1))
    }

    printFloat() {
        this.li(reg.A7, 2)
        this.ecall()
    }
}