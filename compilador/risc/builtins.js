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

/**
 * 
 * @param {Generador} codigo 
 */
export const floatToString = (codigo) => {
    const end = codigo.getLabel()
    
    codigo.comentario('Inicio de floatToString')
    
    // Preservar el valor float original
    codigo.fmvx(reg.T0, fr.FA0)
    
    // Obtener la parte entera del float
    codigo.fcvtws(reg.A0, fr.FA0)  // Convierte float a int
    codigo.fcvtsw(fr.FT0, reg.A0)  // Convierte int de vuelta a float
    
    // Guardar la parte entera en el stack
    codigo.push(reg.A0)
    
    // Calcular la parte decimal
    codigo.fsub(fr.FT1, fr.FA0, fr.FT0)  // parte decimal = original - parte entera
    
    // Multiplicar por 1000000 para preservar 6 decimales
    codigo.li(reg.T1, 1000000)
    codigo.fcvtsw(fr.FT2, reg.T1)
    codigo.fmul(fr.FT1, fr.FT1, fr.FT2)
    
    // Convertir la parte decimal a entero
    codigo.fcvtws(reg.A0, fr.FT1)
    
    // Si es negativo, convertir a positivo
    codigo.bgez(reg.A0, 'skip_neg')
    codigo.sub(reg.A0, reg.ZERO, reg.A0)
    codigo.label('skip_neg')
    
    // Convertir la parte decimal a string
    codigo.push(reg.RA)  // Guardar la dirección de retorno




    codigo.callBuiltin('intToString')  // Llamar a intToString
    codigo.pop(reg.RA)   // Restaurar la dirección de retorno
    
    // Guardar la dirección del string de la parte decimal
    codigo.pop(reg.T2)   // T2 = dirección del string decimal
    
    // Convertir la parte entera a string
    codigo.pop(reg.A0)   // Recuperar la parte entera
    codigo.push(reg.T2)  // Guardar temporalmente la dirección decimal
    
    codigo.push(reg.RA)  // Guardar la dirección de retorno
    codigo.callBuiltin('intToString')  // Llamar a intToString
    codigo.pop(reg.RA)   // Restaurar la dirección de retorno
    
    // Recuperar las direcciones
    codigo.pop(reg.T2)   // T2 = dirección decimal
    codigo.pop(reg.T1)   // T1 = dirección entera
    
    // Encontrar el final de la parte entera
    const findEndLoop = codigo.getLabel()
    codigo.label(findEndLoop)
    codigo.lb(reg.T3, reg.T1)
    codigo.beqz(reg.T3, 'foundEnd')
    codigo.addi(reg.T1, reg.T1, 1)
    codigo.j(findEndLoop)
    
    // Agregar el punto decimal
    codigo.label('foundEnd')
    codigo.li(reg.T3, 46)  // Carácter "."
    codigo.sb(reg.T3, reg.T1)
    codigo.addi(reg.T1, reg.T1, 1)
    
    // Copiar la parte decimal
    const copyDecLoop = codigo.getLabel()
    codigo.label(copyDecLoop)
    codigo.lb(reg.T3, reg.T2)
    codigo.beqz(reg.T3, 'copyEnd')
    codigo.sb(reg.T3, reg.T1)
    codigo.addi(reg.T1, reg.T1, 1)
    codigo.addi(reg.T2, reg.T2, 1)
    codigo.j(copyDecLoop)
    
    // Finalizar el string
    codigo.label('copyEnd')
    codigo.sb(reg.ZERO, reg.T1)
    
    codigo.addLabel(end)
    
    codigo.comentario('Fin de floatToString')
}

/**
 * 
 * @param {Generador} codigo 
 */
export const floatToStringA = (codigo) => {
    codigo.comentario('Inicio de floatToString')
    
    // Labels para la parte entera
    const positive = codigo.getLabel()
    const next = codigo.getLabel()
    const end = codigo.getLabel()
    const last = codigo.getLabel()
    const lastEnd = codigo.getLabel()
    const convert = codigo.getLabel()
    const endConvert = codigo.getLabel()
    
    // Labels para la parte decimal
    const decimalConvert = codigo.getLabel()
    const decimalEnd = codigo.getLabel()
    
    // Guardar posición inicial
    codigo.push(reg.HP)
    
    // Obtener la parte entera
    codigo.fcvtws(reg.T0, fr.FT0)       // T0 = parte entera
    codigo.fcvtsw(fr.FT1, reg.T0)       // FT1 = parte entera como float
    codigo.fsub(fr.FT2, fr.FT0, fr.FT1) // FT2 = parte decimal
    
    // Convertir parte entera (T0) a string
    codigo.mv(reg.A0, reg.T0)
    
    // Verificar si es negativo
    codigo.bgez(reg.A0, positive)
    codigo.sub(reg.A0, reg.ZERO, reg.A0)
    codigo.li(reg.T1, 45)  // "-"
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Procesar parte entera
    codigo.addLabel(positive)
    codigo.bnez(reg.A0, next)
    
    codigo.li(reg.T1, 48)  // "0"
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.j(end)
    
    codigo.addLabel(next)
    codigo.mv(reg.T1, reg.A0)
    codigo.addi(reg.T2, reg.HP, -1)
    
    codigo.addLabel(last)
    codigo.beqz(reg.T1, lastEnd)
    codigo.li(reg.T3, 10)
    codigo.div(reg.T1, reg.T1, reg.T3)
    codigo.addi(reg.T2, reg.T2, 1)
    codigo.j(last)
    
    codigo.addLabel(lastEnd)
    codigo.addi(reg.HP, reg.T2, 1)
    
    codigo.addLabel(convert)
    codigo.beqz(reg.A0, endConvert)
    codigo.li(reg.T3, 10)
    codigo.rem(reg.T1, reg.A0, reg.T3)
    codigo.addi(reg.T1, reg.T1, 48)
    codigo.sb(reg.T1, reg.T2)
    codigo.addi(reg.T2, reg.T2, -1)
    codigo.div(reg.A0, reg.A0, reg.T3)
    codigo.j(convert)
    
    // Agregar punto decimal
    codigo.addLabel(endConvert)
    codigo.addLabel(end)
    codigo.li(reg.T1, 46)  // "."
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Convertir parte decimal
    // Multiplicar por 100000 para obtener 5 decimales
    codigo.li(reg.T1, 100000)
    codigo.fcvtsw(fr.FT3, reg.T1)
    codigo.fmul(fr.FT2, fr.FT2, fr.FT3)
    codigo.fcvtws(reg.A0, fr.FT2)
    codigo.bgez(reg.A0, decimalConvert)
    codigo.sub(reg.A0, reg.ZERO, reg.A0)
    
    // Convertir los decimales a string
    codigo.addLabel(decimalConvert)
    // Asegurar al menos un dígito decimal
    codigo.beqz(reg.A0, 'zero_decimal')
    
    // Convertir decimales normalmente
    codigo.mv(reg.T1, reg.A0)           // Valor temporal
    codigo.mv(reg.T2, reg.HP)           // Posición inicial
    
    // Agregar dígitos
    codigo.li(reg.T3, 10)               // Divisor
    codigo.addLabel('decimal_loop')
    codigo.beqz(reg.T1, decimalEnd)
    codigo.rem(reg.T4, reg.T1, reg.T3)  // Obtener último dígito
    codigo.addi(reg.T4, reg.T4, 48)     // Convertir a ASCII
    codigo.sb(reg.T4, reg.T2)           // Guardar dígito
    codigo.addi(reg.T2, reg.T2, 1)      // Siguiente posición
    codigo.div(reg.T1, reg.T1, reg.T3)  // Siguiente dígito
    codigo.j('decimal_loop')
    
    // Si el decimal es cero, agregar un solo cero
    codigo.addLabel('zero_decimal')
    codigo.li(reg.T1, 48)               // "0"
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Finalizar string
    codigo.addLabel(decimalEnd)
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    codigo.comentario('Fin de floatToString')
}

/**
 * 
 * @param {Generador} codigo 
 */
export const floatToStringB = (codigo) => {
    codigo.comentario('Inicio de floatToString')
    
    // Labels para la parte entera
    const positive = codigo.getLabel()
    const next = codigo.getLabel()
    const end = codigo.getLabel()
    const last = codigo.getLabel()
    const lastEnd = codigo.getLabel()
    const convert = codigo.getLabel()
    const endConvert = codigo.getLabel()
    
    // Guardar posición inicial
    codigo.push(reg.HP)
    
    // Mover el float de A0 a FT0 si no está ya ahí
    codigo.fmvx(reg.T0, fr.FT0)
    
    // Obtener la parte entera
    codigo.fcvtws(reg.T0, fr.FT0)       // T0 = parte entera
    
    // Convertir parte entera (T0) a string
    codigo.mv(reg.A0, reg.T0)
    
    // Verificar si es negativo
    codigo.bgez(reg.A0, positive)
    codigo.sub(reg.A0, reg.ZERO, reg.A0)
    codigo.li(reg.T1, 45)  // "-"
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Procesar parte entera
    codigo.addLabel(positive)
    codigo.bnez(reg.A0, next)
    
    codigo.li(reg.T1, 48)  // "0"
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.j(end)
    
    codigo.addLabel(next)
    codigo.mv(reg.T1, reg.A0)
    codigo.addi(reg.T2, reg.HP, -1)
    
    codigo.addLabel(last)
    codigo.beqz(reg.T1, lastEnd)
    codigo.li(reg.T3, 10)
    codigo.div(reg.T1, reg.T1, reg.T3)
    codigo.addi(reg.T2, reg.T2, 1)
    codigo.j(last)
    
    codigo.addLabel(lastEnd)
    codigo.addi(reg.HP, reg.T2, 1)
    
    codigo.addLabel(convert)
    codigo.beqz(reg.A0, endConvert)
    codigo.li(reg.T3, 10)
    codigo.rem(reg.T1, reg.A0, reg.T3)
    codigo.addi(reg.T1, reg.T1, 48)
    codigo.sb(reg.T1, reg.T2)
    codigo.addi(reg.T2, reg.T2, -1)
    codigo.div(reg.A0, reg.A0, reg.T3)
    codigo.j(convert)
    
    // Agregar punto decimal
    codigo.addLabel(endConvert)
    codigo.addLabel(end)
    codigo.li(reg.T1, 46)  // "."
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Calcular parte decimal
    codigo.fcvtsw(fr.FT1, reg.T0)      // Convertir parte entera a float
    codigo.fsub(fr.FT2, fr.FT0, fr.FT1) // Obtener parte decimal
    
    // Multiplicar por 10 para obtener primer decimal
    codigo.li(reg.T1, 10)
    codigo.fcvtsw(fr.FT3, reg.T1)
    codigo.fmul(fr.FT2, fr.FT2, fr.FT3)
    codigo.fcvtws(reg.T1, fr.FT2)       // Convertir a entero
    
    // Agregar el dígito decimal
    codigo.addi(reg.T1, reg.T1, 48)     // Convertir a ASCII
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Finalizar string
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Retornar la dirección inicial del string
    codigo.pop(reg.A0)
    
    codigo.comentario('Fin de floatToString')
}

/**
 * Convierte un número flotante a string 
 * @param {Generador} codigo 
 */
export const floatToStringC = (codigo) => {
    codigo.comentario('Inicio de floatToString')
    
    // Obtener parte entera y decimal
    codigo.fcvtws(reg.T0, fr.FT0)      // integerPart = (int) param
    codigo.fcvtsw(fr.FT1, reg.T0)      // Convertir de vuelta a float
    codigo.fsub(fr.FT2, fr.FT0, fr.FT1) // decimalPart = param - integerPart
    
    // Guardar parte decimal
    codigo.pushFloat(fr.FT2)
    
    // Convertir parte entera (código de intToString)
    codigo.mv(reg.A0, reg.T0)
    
    const positive = codigo.getLabel()
    const next = codigo.getLabel()
    const end = codigo.getLabel()
    const last = codigo.getLabel()
    const lastEnd = codigo.getLabel()
    const convert = codigo.getLabel()
    const endConvert = codigo.getLabel()
    
    // Guardar dirección inicial
    codigo.push(reg.HP)
    
    // Verificar signo
    codigo.bgez(reg.A0, positive)
    codigo.sub(reg.A0, reg.ZERO, reg.A0)
    codigo.li(reg.T1, 45)
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    codigo.addLabel(positive)
    codigo.bnez(reg.A0, next)
    
    codigo.li(reg.T1, 48)
    codigo.sb(reg.T1, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.j(end)
    
    codigo.addLabel(next)
    codigo.mv(reg.T1, reg.A0)
    codigo.addi(reg.T2, reg.HP, -1)
    
    codigo.addLabel(last)
    codigo.beqz(reg.T1, lastEnd)
    codigo.li(reg.T3, 10)
    codigo.div(reg.T1, reg.T1, reg.T3)
    codigo.addi(reg.T2, reg.T2, 1)
    codigo.j(last)
    
    codigo.addLabel(lastEnd)
    codigo.addi(reg.HP, reg.T2, 1)
    
    codigo.addLabel(convert)
    codigo.beqz(reg.A0, endConvert)
    codigo.li(reg.T3, 10)
    codigo.rem(reg.T1, reg.A0, reg.T3)
    codigo.addi(reg.T1, reg.T1, 48)
    codigo.sb(reg.T1, reg.T2)
    codigo.addi(reg.T2, reg.T2, -1)
    codigo.div(reg.A0, reg.A0, reg.T3)
    codigo.j(convert)
    
    codigo.addLabel(endConvert)
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    codigo.addLabel(end)
    
    // Guardar dirección del string entero
    codigo.pop(reg.T5)
    
    // Recuperar parte decimal y convertir
    codigo.popFloat(fr.FT2)
    
    // Multiplicar por 10 para obtener un decimal
    codigo.li(reg.T0, 10)
    codigo.fcvtsw(fr.FT3, reg.T0)
    codigo.fmul(fr.FT2, fr.FT2, fr.FT3)
    
    // Convertir a entero
    codigo.fcvtws(reg.A0, fr.FT2)
    
    // Asegurarse que sea positivo
    codigo.bgez(reg.A0, 'process_decimal')
    codigo.sub(reg.A0, reg.ZERO, reg.A0)
    
    // Procesar decimal
    codigo.addLabel('process_decimal')
    
    // Reemplazar el terminador con punto
    codigo.addi(reg.HP, reg.HP, -1)
    codigo.li(reg.T0, 46)
    codigo.sb(reg.T0, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Convertir el decimal a caracteres
    codigo.addi(reg.A0, reg.A0, 48)
    codigo.sb(reg.A0, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Agregar terminador
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Retornar dirección inicial
    codigo.mv(reg.A0, reg.T5)
    
    codigo.comentario('Fin de floatToString')
}

/**
 * 
 * @param {Generador} codigo 
 */
export const floatToStringD = (codigo) => {

    const positive = codigo.getLabel();
    const end = codigo.getLabel();
    const fraccionLabel = codigo.getLabel();

    codigo.comentario('Inicio de floatToString');

    // Guardar la dirección inicial del string
    codigo.push(reg.HP);

    // Verificar si el número es negativo
    codigo.bgez(reg.A0, positive);

    // Si es negativo, multiplicar por -1 y agregar el signo
    codigo.fneg(fr.FT0, fr.FT0); // Negar el float
    codigo.li(reg.T1, 45);  // Carácter "-"
    codigo.sb(reg.T1, reg.HP);
    codigo.addi(reg.HP, reg.HP, 1);

    // Si es positivo, continuar
    codigo.addLabel(positive);

    // Obtener la parte entera
    codigo.fcvtws(reg.T0, fr.FT0);  // Convierte la parte entera del float a int (T0 = parte entera)
    codigo.mv(reg.A0, reg.T0);  // Reutiliza intToString para la parte entera
    intToString(codigo);  // Convierte la parte entera a string

    // Procesar la parte fraccionaria
    codigo.li(reg.T2, 46); // Carácter "."
    codigo.sb(reg.T2, reg.HP);  // Agregar "."
    codigo.addi(reg.HP, reg.HP, 1);

    // Obtener la parte fraccionaria
    codigo.fcvtws(reg.T0, fr.FT0);  // Convertir parte entera (T0 = parte entera)
    codigo.fcvtsw(fr.FT1, reg.T0);  // Convertir el entero de nuevo a float (FT1 = parte entera como float)
    codigo.fsub(fr.FT1, fr.FT0, fr.FT1);  // Obtener parte fraccionaria (FT1 = FT0 - parte_entera)

    // Ciclo para convertir parte fraccionaria a string
    codigo.addLabel(fraccionLabel);

    // Multiplicar la parte fraccionaria por 10
    codigo.li(reg.T4, 10);  // Constante 10 en T4
    codigo.fld(fr.FT2, reg.T4);  // Mover 10.0 al registro flotante FT2
    codigo.fmul(fr.FT1, fr.FT1, fr.FT2);  // Multiplicar parte fraccionaria por 10

    // Convertir parte fraccionaria a entero
    codigo.fcvtws(reg.T1, fr.FT1);  // Convertir parte fraccionaria a entero (T1)

    // Obtener el carácter correspondiente al dígito
    codigo.li(reg.T3, 48);  // ASCII '0'
    codigo.add(reg.T1, reg.T1, reg.T3);  // Convertir el dígito a ASCII
    codigo.sb(reg.T1, reg.HP);  // Guardar en el heap
    codigo.addi(reg.HP, reg.HP, 1);

    // Obtener el siguiente dígito fraccionario
    codigo.fcvtws(reg.T0, fr.FT1);  // Convertir parte fraccionaria actual a entero (T0)
    codigo.fcvtsw(fr.FT2, reg.T0);  // Convertir ese entero a float (FT2)
    codigo.fsub(fr.FT1, fr.FT1, fr.FT2);  // Restar la parte entera de la parte fraccionaria actual

    // Continuar mientras haya dígitos fraccionarios
    codigo.j(fraccionLabel);  // Repetir para el siguiente dígito

    // Finalizar la conversión
    codigo.addLabel(end);
    codigo.sb(reg.ZERO, reg.HP);  // Agregar terminador nulo
    codigo.addi(reg.HP, reg.HP, 1);

    codigo.comentario('Fin de floatToString');
}

/**
 * 
 * @param {Generador} codigo 
 */
export const joinArray = (codigo) => {
    const mainLoop = codigo.getLabel()
    const mainEnd = codigo.getLabel()
    const convertLoop = codigo.getLabel()
    const convertEnd = codigo.getLabel()
    const isNegative = codigo.getLabel()
    const skipNegative = codigo.getLabel()
    const skipComma = codigo.getLabel()
    const finishNumber = codigo.getLabel()
    
    codigo.comentario('Inicio de arrayJoin')
    
    // Preservar registros importantes
    codigo.push(reg.RA)
    codigo.push(reg.S0)  // Base del array
    codigo.push(reg.S1)  // Tamaño del array
    codigo.push(reg.S2)  // Contador actual
    codigo.push(reg.S3)  // Valor temporal para división
    
    // Inicializar registros
    codigo.mv(reg.S0, reg.A0)  // Dirección base del array
    codigo.mv(reg.S1, reg.A1)  // Tamaño del array
    codigo.li(reg.S2, 0)       // Contador = 0
    
    // Guardar dirección inicial del string resultado
    codigo.push(reg.HP)
    
    // Loop principal para cada elemento del array
    codigo.addLabel(mainLoop)
    
    // Verificar si hemos terminado
    codigo.beq(reg.S2, reg.S1, mainEnd)
    
    // Cargar número actual
    codigo.slli(reg.T0, reg.S2, 2)    // índice * 4
    codigo.add(reg.T0, reg.S0, reg.T0) // dirección base + offset
    codigo.lw(reg.T1, reg.T0)          // cargar número
    
    // Verificar si es negativo
    codigo.bgez(reg.T1, skipNegative)
    
    // Si es negativo
    codigo.li(reg.T0, 45)  // caracter '-'
    codigo.sb(reg.T0, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.sub(reg.T1, reg.ZERO, reg.T1)  // convertir a positivo
    
    codigo.addLabel(skipNegative)
    
    // Si el número es 0
    codigo.bnez(reg.T1, convertLoop)
    codigo.li(reg.T0, 48)  // caracter '0'
    codigo.sb(reg.T0, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.j(finishNumber)
    
    // Convertir número a string
    // Primero encontrar el último dígito
    codigo.mv(reg.T2, reg.HP)  // guardar posición inicial
    codigo.mv(reg.T3, reg.T1)  // copia del número
    
    codigo.addLabel(convertLoop)
    codigo.beqz(reg.T3, convertEnd)
    codigo.li(reg.T4, 10)
    codigo.div(reg.T3, reg.T3, reg.T4)
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.j(convertLoop)
    
    codigo.addLabel(convertEnd)
    codigo.addi(reg.HP, reg.HP, -1)
    
    // Ahora colocar los dígitos
    codigo.addLabel('placeDigits')
    codigo.beqz(reg.T1, finishNumber)
    codigo.li(reg.T4, 10)
    codigo.rem(reg.T3, reg.T1, reg.T4)  // obtener último dígito
    codigo.addi(reg.T3, reg.T3, 48)     // convertir a ASCII
    codigo.sb(reg.T3, reg.HP)
    codigo.addi(reg.HP, reg.HP, -1)
    codigo.div(reg.T1, reg.T1, reg.T4)
    codigo.j('placeDigits')
    
    codigo.addLabel(finishNumber)
    // Mover HP al final del número
    codigo.addi(reg.HP, reg.T2, 1)
    
    // Verificar si es el último elemento para la coma
    codigo.addi(reg.T0, reg.S1, -1)
    codigo.beq(reg.S2, reg.T0, skipComma)
    
    // Agregar coma y espacio
    codigo.li(reg.T0, 44)  // coma
    codigo.sb(reg.T0, reg.HP)  // Usar 0(reg.HP) en lugar de reg.HP directamente
    codigo.addi(reg.HP, reg.HP, 1)
    codigo.li(reg.T0, 32)  // espacio
    codigo.sb(reg.T0, reg.HP)  // Usar 0(reg.HP) en lugar de reg.HP directamente
    codigo.addi(reg.HP, reg.HP, 1)
    
    codigo.addLabel(skipComma)
    
    // Incrementar contador y continuar
    codigo.addi(reg.S2, reg.S2, 1)
    codigo.j(mainLoop)
    
    // Finalizar string
    codigo.addLabel(mainEnd)
    codigo.sb(reg.ZERO, reg.HP)
    codigo.addi(reg.HP, reg.HP, 1)
    
    // Restaurar registros
    codigo.pop(reg.S3)
    codigo.pop(reg.S2)
    codigo.pop(reg.S1)
    codigo.pop(reg.S0)
    codigo.pop(reg.RA)
    
    codigo.comentario('Fin de arrayJoin')
}



export const builtins = {
    concatenacionString,
    intToString,
    compararString,
    parseInt,
    parseFloat,
    booleanToString,
    charToString,
    floatToString: floatToStringA,
    joinArray
}