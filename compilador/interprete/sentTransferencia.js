export class ExcepcionBreak extends Error {
    constructor() {
        super('Break');
    }
}

export class ExcepcionContinue extends Error {
    constructor() {
        super('Continue');
    }
}

export class ExcepcionReturn extends Error {
    /**
     * @param {any} value
     */
    constructor(value) {
        super('Return');
        this.value = value;
    }
}

export class ErrorSemantico extends Error {
    /**
     * @param {string} message
     */
    constructor(message, location) {
        super(message);
        this.location = location
        this.tipo = "Semantico"
    }
}