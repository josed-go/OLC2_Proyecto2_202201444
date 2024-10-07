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
