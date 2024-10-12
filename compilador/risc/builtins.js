import { Generador } from "./generador.js"
import { registers as reg } from "./registros.js"

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
    concatenacionString: concatenacionString,
    intToString: intToString
}