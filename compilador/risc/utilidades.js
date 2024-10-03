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