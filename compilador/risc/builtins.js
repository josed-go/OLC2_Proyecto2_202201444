import { Generador } from "./generador.js"
import { registers as reg, floatRegisters as fr } from "./registros.js"

/**
 * 
 * @param {Generador} codigo 
 */
export const concatenacionString = (codigo) => {
    codigo.push(reg.HP)

    const loop1 = codigo.addLabel()
    const end1 = codigo.getLabel()

    codigo.lb(reg.T1, reg.A0)
    codigo.beq(reg.T1, reg.ZERO, end1)

    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.addi(reg.A0, reg.A0, 1)
    codigo.j(loop1)
    codigo.addLabel(end1)

    const loop2 = codigo.addLabel()
    const end2 = codigo.getLabel()

    codigo.lb(reg.T1, reg.A1)
    codigo.beq(reg.T1, reg.ZERO, end2)
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.addi(reg.A1, reg.A1, 1)
    codigo.j(loop2)
    codigo.addLabel(end2)

    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
}

/**
 * 
 * @param {Generador} codigo 
 */
export const compararString = (codigo) => {
    const loop = codigo.getLabel()
    const end = codigo.getLabel()
    const notEqual = codigo.getLabel()
    const fin = codigo.getLabel()

    // Inicia el ciclo
    codigo.addLabel(loop)
    codigo.lb(reg.T1, reg.A0)
    codigo.lb(reg.T2, reg.A1)

    codigo.bne(reg.T1, reg.T2, notEqual)

    codigo.beq(reg.T1, reg.ZERO, end) 
    codigo.beq(reg.T2, reg.ZERO, end)


    codigo.addi(reg.A0, reg.A0, 1)
    codigo.addi(reg.A1, reg.A1, 1)

    // Vuelve al inicio del ciclo
    codigo.j(loop)


    codigo.addLabel(end)
    codigo.li(reg.T0, 1)
    codigo.j(fin)


    codigo.addLabel(notEqual)
    codigo.li(reg.T0, 0)
    codigo.j(fin)

    // Finaliza la comparación
    codigo.addLabel(fin)

}

/**
 * 
 * @param {Generador} codigo 
 */
export const parseInt = (codigo) => {
    const loopLabel = codigo.getLabel()
    const endLabel = codigo.getLabel()
    const negativoLabel = codigo.getLabel()
    const floatLabel = codigo.getLabel()
    
    codigo.comentario('Inicio de parseInt')
    
    // codigo.popObject(reg.A0)
    
    codigo.li(reg.T0, 0)

    codigo.li(reg.T3, 0)
    
    codigo.lb(reg.T1, reg.A0);
    codigo.li(reg.T2, 45)
    codigo.beq(reg.T1, reg.T2, negativoLabel)
    codigo.j(loopLabel)
    
    codigo.label(negativoLabel)
    codigo.li(reg.T3, 1)
    codigo.addi(reg.A0, reg.A0, 1)
    
    codigo.label(loopLabel)
    
    codigo.lb(reg.T1, reg.A0)
    
    codigo.beqz(reg.T1, endLabel)
    
    codigo.li(reg.T2, 46)
    codigo.beq(reg.T1, reg.T2, endLabel)
    
    codigo.addi(reg.T1, reg.T1, -48)
    
    codigo.li(reg.T2, 10)
    codigo.mul(reg.T0, reg.T0, reg.T2)
    
    codigo.add(reg.T0, reg.T0, reg.T1)
    
    codigo.addi(reg.A0, reg.A0, 1)
    
    codigo.j(loopLabel)
    
    codigo.label(endLabel)
    
    codigo.beqz(reg.T3, floatLabel)
    codigo.sub(reg.T0, reg.ZERO, reg.T0)
    
    codigo.label(floatLabel)
    
    codigo.mv(reg.A0, reg.T0)
    
    // codigo.pushObject({ tipo: 'int', length: 4 })
    // codigo.push(reg.A0)
    // codigo.pushObject({ tipo: "int", length: 4 })
    
    codigo.comentario('Fin de parseInt')
}

/**
 * 
 * @param {Generador} codigo 
 */
export const parseFloat = (codigo) => {
    const loopLabel = codigo.getLabel()
    const endLabel = codigo.getLabel()
    const negativoLabel = codigo.getLabel()
    const fractionLabel = codigo.getLabel()
    const fractionLoopLabel = codigo.getLabel()
    
    codigo.comentario('Inicio de parseFloat')

    // Inicializar registros
    codigo.li(reg.T0, 0)
    codigo.li(reg.T3, 0)
    codigo.li(reg.T4, 1)
    codigo.fmvs(fr.FT0, reg.ZERO)
    codigo.li(reg.T5, 0)
    
    // Verificar si el número es negativo
    codigo.lb(reg.T1, reg.A0)
    codigo.li(reg.T2, 45)
    codigo.beq(reg.T1, reg.T2, negativoLabel)
    codigo.j(loopLabel)
    
    // Si es negativo
    codigo.label(negativoLabel)
    codigo.li(reg.T3, 1) // Marcar como negativo
    codigo.addi(reg.A0, reg.A0, 1)
    
    // Procesar la parte entera
    codigo.label(loopLabel)
    codigo.lb(reg.T1, reg.A0)
    
    // Fin del string o parte fraccionaria
    codigo.beqz(reg.T1, endLabel)
    codigo.li(reg.T2, 46)
    codigo.beq(reg.T1, reg.T2, fractionLabel)
    
    // Convertir parte entera
    codigo.addi(reg.T1, reg.T1, -48)
    codigo.li(reg.T2, 10)
    codigo.mul(reg.T0, reg.T0, reg.T2)
    codigo.add(reg.T0, reg.T0, reg.T1)
    codigo.addi(reg.A0, reg.A0, 1)
    codigo.j(loopLabel)
    
    // Procesar la parte fraccionaria
    codigo.label(fractionLabel)
    codigo.addi(reg.A0, reg.A0, 1)
    
    codigo.label(fractionLoopLabel)
    codigo.lb(reg.T1, reg.A0)
    codigo.beqz(reg.T1, endLabel)
    
    codigo.addi(reg.T1, reg.T1, -48)
    
    // Calcular el factor fraccional en float
    codigo.li(reg.T5, 10)
    codigo.mul(reg.T4, reg.T4, reg.T5)
    
    // Convertir el dígito y el factor a flotante
    codigo.fcvtsw(fr.FT1, reg.T1)
    codigo.fcvtsw(fr.FT2, reg.T4)
    
    // Multiplicar el dígito por el factor fraccionario y sumar
    codigo.fdiv(fr.FT1, fr.FT1, fr.FT2)
    codigo.fadd(fr.FT0, fr.FT0, fr.FT1)
    
    codigo.addi(reg.A0, reg.A0, 1) // Avanzar al siguiente carácter
    codigo.j(fractionLoopLabel)
    
    // Fin del parseo
    codigo.label(endLabel)
    
    // Si es negativo, ajustar el valor final
    codigo.beqz(reg.T3, 'finalize')
    codigo.sub(reg.T0, reg.ZERO, reg.T0)
    codigo.fneg(fr.FT0, fr.FT0)
    
    codigo.label('finalize')
    
    // Convertir parte entera a float y sumarla con la fracción
    codigo.fcvtsw(fr.FT2, reg.T0)
    codigo.fadd(fr.FT0, fr.FT0, fr.FT2)
    
    // Guardar el valor float resultante en el registro de retorno
    codigo.fmvx(reg.A0, fr.FT0)
    
    codigo.comentario('Fin de parseFloat')
}

export const intToString = (codigo) => {
    const isNegative = codigo.getLabel();  // Label para manejar números negativos
    const startConversion = codigo.getLabel();  // Label para iniciar la conversión
    const endConversion = codigo.getLabel();  // Label para finalizar la conversión

    // Verifica si el número es negativo
    codigo.bltz(reg.A0, isNegative);

    // Conversión de entero positivo a string
    codigo.addLabel(startConversion);

    // Calcular el dígito menos significativo
    codigo.li(reg.T2, 10);  // Divisor (base 10)
    codigo.div(reg.T1, reg.A0, reg.T2);  // T1 = A0 / 10
    codigo.rem(reg.T0, reg.A0, reg.T2);  // T0 = A0 % 10 (dígito)
    
    // Convierte el dígito a ASCII
    codigo.addi(reg.T0, reg.T0, 48);  // Convierte el número a su valor ASCII
    codigo.sb(reg.T0, reg.HP);  // Almacena el carácter en el heap
    codigo.addi(reg.HP, reg.HP, 1);  // Mueve el puntero del heap

    // Si el cociente es mayor que 0, continúa con la conversión
    codigo.bnez(reg.T1, startConversion);

    // Finaliza la conversión
    codigo.sb(reg.ZERO, reg.HP);  // Termina el string con un carácter nulo
    codigo.addi(reg.HP, reg.HP, 1);
    codigo.j(endConversion);

    // Manejo de números negativos
    codigo.addLabel(isNegative);
    codigo.li(reg.T0, 45);  // ASCII del signo negativo '-'
    codigo.sb(reg.T0, reg.HP);
    codigo.addi(reg.HP, reg.HP, 1);
    codigo.neg(reg.A0, reg.A0);  // Convierte el número a positivo
    codigo.j(startConversion);

    // Label para el final de la conversión
    codigo.addLabel(endConversion);
};


export const builtins = {
    concatenacionString,
    intToString,
    compararString,
    parseInt,
    parseFloat
}