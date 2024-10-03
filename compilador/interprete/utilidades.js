export function EncontrarTipo(valor) {

    if (typeof valor == 'number') {
        return Number.isInteger(valor) && !valor.toString().includes('.') ? 'int' : 'float';
    } else if (typeof valor == 'string') {
        return valor.length == 1 ? 'char' : 'string';
    } else if (typeof valor == 'boolean') {
        return 'boolean';
    } else {
        throw new Error(`No se puede determinar el tipo de la variable "${this.nombre}".`);
    }
}

export function ValorPorDefecto(tipo) {
    switch (tipo) {
        case "int":               
            return 0
        case "float":
            return 0.0
        case "string":
            return ""
        case "boolean":
            return true
        case "char":
            return ''
        default:
            throw new Error(`Tipo ${tipo} no es valido`)
    }
}

export function validarDimensiones(array, dimensionesEsperadas) {
    // Caso base: si no quedan dimensiones por validar, el valor dentro del objeto no debe ser un array
    if (dimensionesEsperadas === 0) {
        return !Array.isArray(array);
    }

    // Si se esperaba más de 0 dimensiones pero el valor dentro del objeto no es un array, es inválido
    if (!Array.isArray(array)) {
        return false;
    }

    // Recursivamente validar cada sub-array dentro del valor del objeto
    for (let subArray of array) {
        if (!validarDimensiones(subArray, dimensionesEsperadas - 1)) {
            return false;
        }
    }

    // Si todos los sub-arrays son válidos, entonces el array es válido
    return true;
}

export function validarYObtenerValores(tipo, valores) {
    return valores.map(valor => {
        if (Array.isArray(valor.valor)) {
            // Si es un arreglo, llama recursivamente a la función
            return validarYObtenerValores(tipo, valor.valor);
        } else {
            // Si es un valor, valida su tipo y devuelve el valor
            if (tipo === "float" && valor.tipo === "int") {
                return valor.valor; // Convierte int a float si es necesario
            } else if (tipo !== valor.tipo) {
                throw new Error(`El tipo del array no coincide con el tipo del valor: se esperaba ${tipo} pero se encontró ${valor.tipo}`);
            } else {
                return valor.valor; // Tipo coincide, devuelve el valor
            }
        }
    });
}