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
    codigo.lb(reg.A2, reg.A1)

    codigo.bne(reg.T1, reg.A2, notEqual)

    codigo.beq(reg.T1, reg.ZERO, end) 
    codigo.beq(reg.A2, reg.ZERO, end)


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
    const fraccionLabel = codigo.getLabel()
    const fraccionLoopLabel = codigo.getLabel()
    
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
    codigo.beq(reg.T1, reg.T2, fraccionLabel)
    
    // Convertir parte entera
    codigo.addi(reg.T1, reg.T1, -48)
    codigo.li(reg.T2, 10)
    codigo.mul(reg.T0, reg.T0, reg.T2)
    codigo.add(reg.T0, reg.T0, reg.T1)
    codigo.addi(reg.A0, reg.A0, 1)
    codigo.j(loopLabel)
    
    // Procesar la parte fraccionaria
    codigo.label(fraccionLabel)
    codigo.addi(reg.A0, reg.A0, 1)
    
    codigo.label(fraccionLoopLabel)
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
    codigo.j(fraccionLoopLabel)
    
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


/**
 * 
 * @param {Generador} codigo 
 */
const booleanToString = (codigo) => {
        
    codigo.comentario('Boolean to string')
    
    const falseLabel = codigo.getLabel()
    const endLabel = codigo.getLabel()

    const copiaString = codigo.getLabel()
    const copiaStringEnd = codigo.getLabel()

    codigo.push(reg.HP)
    
    
    // Comprobar si es true o false
    codigo.beqz(reg.A0, falseLabel)
    
    // Si es true
    codigo.la(reg.T1, "val_true")
    codigo.j(copiaString);
    
    // Si es false
    codigo.addLabel(falseLabel);
    codigo.la(reg.T1, "val_false")

    codigo.addLabel(copiaString)

    codigo.lb(reg.T2, reg.T1)
    codigo.beqz(reg.T2, copiaStringEnd)
    codigo.sb(reg.T2, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.addi(reg.T1, reg.T1, 1)
    codigo.j(copiaString)

    codigo.addLabel(copiaStringEnd)
    codigo.j(endLabel)
    
    codigo.addLabel(endLabel)

    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    codigo.comentario('Fin de booleanToString')

}

/**
 * 
 * @param {Generador} codigo 
 */
const charToString = (codigo) => {
    const endFunction = codigo.getLabel();
    
    codigo.comentario('Inicio de charToString')
    
    codigo.push(reg.HP)
    
    // Convertir el caracter a string
    codigo.sb(reg.A0, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Agregar el caracter nulo
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    codigo.addLabel(endFunction)
    
    codigo.comentario('Fin de charToString')
}

/**
 * 
 * @param {Generador} codigo 
 */
export const intToString = (codigo) => {

    /*
        stringAddress = hp

		// check if the number is negative
		if(param >= 0) goto positive
		param = param * -1
		heap[hp] = 45 // "-"
		hp = hp + 1
		positive:

		if param != 0 goto next
		// if the number is 0, just print "0"
		heap[hp] = 48 // "0"
		hp = hp + 1
		heap[hp] = 0
		hp = hp + 1
		goto end

		next:
		// get the last address of the string
		stringFinalAddress = hp - 1
		aux = param
		last:
		if aux == 0 goto lastEnd:
		aux = aux / 10
		aux = (int) aux
		stringFinalAddress = stringFinalAddress + 1
		goto last
		lastEnd:

		hp = stringFinalAddress + 1

		// convert the number to string
		convert:
		if(param == 0) goto endConvert
		aux = param % 10
		aux = aux + 48
		heap[stringFinalAddress] = aux
		stringFinalAddress = stringFinalAddress - 1
		param = param / 10
		param = (int) param
		goto convert
		endConvert:

		heap[hp] = 0
		hp = hp + 1

		end:
		param = stringAddress
    */ 

    const positive = codigo.getLabel()
    const next = codigo.getLabel()
    const end = codigo.getLabel()
    const last = codigo.getLabel()
    const lastEnd = codigo.getLabel()
    const convert = codigo.getLabel()
    const endConvert = codigo.getLabel()
    
    codigo.comentario('Inicio de intToString')
    
    // Guardar la dirección inicial del string
    codigo.push(reg.HP)
    
    // Verificar si el número es negativo
    codigo.bgez(reg.A0, positive)
    
    // Si es negativo, multiplicar por -1 y agregar el signo
    codigo.sub(reg.A0, reg.ZERO, reg.A0)
    codigo.li(reg.T1, 45)  // Carácter "-"
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Si es positivo, continuar
    codigo.addLabel(positive)
    
    // Verificar si el número es 0
    codigo.bnez(reg.A0, next)
    
    // Si es 0, solo escribir "0" y terminar
    codigo.li(reg.T1, 48)  // Carácter "0"
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.j(end)
    
    // Obtener la dirección final del string
    codigo.addLabel(next)
    codigo.mv(reg.T1, reg.A0)  // Guardar param en T1 (aux)
    codigo.addi(reg.T2, reg.HP, -1)  // stringFinalAddress en T2
    
    // Calcular cuántos dígitos tiene el número
    codigo.addLabel(last)
    codigo.beqz(reg.T1, lastEnd)
    codigo.li(reg.T3, 10)
    codigo.div(reg.T1, reg.T1, reg.T3)
    codigo.addi(reg.T2, reg.T2, 1)
    codigo.j(last)
    
    // Preparar para la conversión
    codigo.addLabel(lastEnd)
    codigo.addi(reg.HP, reg.T2, 1)
    
    // Convertir el número a string
    codigo.addLabel(convert)
    codigo.beqz(reg.A0, endConvert)
    
    // Obtener el último dígito
    codigo.li(reg.T3, 10)
    codigo.rem(reg.T1, reg.A0, reg.T3)  // aux = param % 10
    codigo.addi(reg.T1, reg.T1, 48)     // aux = aux + 48
    codigo.sb(reg.T1, reg.T2)           // heap[stringFinalAddress] = aux
    
    // Actualizar índices y continuar
    codigo.addi(reg.T2, reg.T2, -1)     // stringFinalAddress--
    codigo.div(reg.A0, reg.A0, reg.T3)  // param = param / 10
    codigo.j(convert)
    
    // Finalizar la conversión
    codigo.addLabel(endConvert)
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    codigo.addLabel(end)
    
    codigo.comentario('Fin de intToString')
}


export const builtins = {
    concatenacionString,
    intToString,
    compararString,
    parseInt,
    parseFloat,
    booleanToString,
    charToString
}