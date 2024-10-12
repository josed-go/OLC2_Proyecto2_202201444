const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const minusculas = 'abcdefghijklmnopqrstuvwxyz'

export const stringToRegistro = (str) => {
    const resultado = []
    let index = 0
    let comoInt = 0
    let shift = 0

    while(index < str.length) {
        comoInt = comoInt | (str.charCodeAt(index) << shift)
        shift += 8
        if(shift >= 32) {
            resultado.push(comoInt)
            comoInt = 0
            shift = 0
        }
        index++
    }

    if(shift > 0) {
        resultado.push(comoInt)
    }

    return resultado
}

export const stringA1Byte = (str) => {
    const resultado = []
    let index = 0

    while(index < str.length) {
        resultado.push(str.charCodeAt(index))
        index++
    }

    resultado.push(0)

    return resultado
}

export const stringToLower = (str) => {
    const resultado = []
    let index = 0

    while(index < str.length) {
        if(mayusculas.includes(str[index])) {
            resultado.push(str.charCodeAt(index) + 32)
        } else {
            resultado.push(str.charCodeAt(index))
        }
        index++
    }

    resultado.push(0)

    return resultado
}

export const obtenerTamano = (tipo) => {
    switch(tipo) {
        case 'int':
            return 4
        case 'boolean':
            return 4
        case 'string':
            return 4
        case 'char':
            return 4
    }
}

export const valorPorDefecto = (tipo) => {
    switch(tipo) {
        case 'int':
            return 0
        case 'boolean':
            return false
        case 'string':
            return ""
        case 'char':
            return 0
    }
}

export const numberToF32 = (num) => {
    const buffer = new ArrayBuffer(4)
    const float32 = new Float32Array(buffer)
    const uint32 = new Uint32Array(buffer)
    float32[0] = num

    const inter = uint32[0]
    const hex = inter.toString(16)
    return '0x' + hex
}