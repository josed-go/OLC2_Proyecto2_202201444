
{
    const crearNodo = (tipoNodo, props) => {
        const tipos = {
            'dato': nodos.Dato,
            'agrupacion': nodos.Agrupacion,
            'binaria': nodos.OperacionBinaria,
            'unaria': nodos.OperacionUnaria,
            'declaracionVarTipo': nodos.DeclaracionVarTipo,
            'declaracionVar': nodos.DeclaracionVar,
            'referenciaVar': nodos.ReferenciaVar,
            'print': nodos.Print,
            'expresionStmt': nodos.ExpresionStmt,
            'asignacion': nodos.Asignacion,
            'bloque': nodos.Bloque,
            'if': nodos.If,
            'while': nodos.While,
            'for': nodos.For,
            'operadorAsignacion': nodos.OperadorAsignacion,
            'ternario': nodos.Ternario,
            'switch': nodos.Switch,
            'array': nodos.Array,
            'dclArray': nodos.DclArray,
            'dclArrayReser': nodos.DclArrayReser,
            'dclArrayCopia': nodos.DclArrayCopia,
            'funcionesArray': nodos.FuncionesArray,
            'funcionesEmbebidas': nodos.FuncionesEmbebidas,
            'struct': nodos.Struct,
            'forEach': nodos.ForEach,
            'break': nodos.Break,
            'continue': nodos.Continue,
            'return': nodos.Return,
            'instanciaStruct': nodos.InstanciaStruct,
            'instanciaExp': nodos.InstanciaExp,
            'accesoAtributo': nodos.AccesoAtributo,
            'llamada': nodos.Llamada,
            'dclFunc': nodos.DclFunc
        }

        const nodo = new tipos[tipoNodo](props)
        nodo.location = location()
        return nodo
    }

    function unescapeString(s) {
        return s.replace(/\\(.)/g, (match, p1) => {
            switch (p1) {
                case 'n': return '\n';
                case 'r': return '\r';
                case 't': return '\t';
                case '"': return '"';
                case '\\': return '\\';
                default: return p1;
            }
        });
    }
}

start = _ global: Global* _ { return global }

Global = 
    struct:Struct { return struct }
    /dcl: Declaracion { return dcl }

Declaracion = 
    declArray: DclArray _ { return declArray }
    / decl: VarDcl _ {return decl}
    / inst: InstanciaS { return inst }
    / dclFunc: DclFunc _ { return dclFunc }
    / sen: Sentencias _ {return sen} 

VarDcl =
    "var" _ id:ID _ "=" _ exp: Expresion _ ";" { return crearNodo('declaracionVar', { id, exp } ) }
    /tipo: TipoDato _ id: ID _ exp:("=" _ exp: Expresion { return exp })? _ ";" { return crearNodo('declaracionVarTipo', { tipo, id, exp }) }

DclArray = 
    tipo: TipoDato _ "[" _ "]" _ id: ID _ "=" _ id2: ID _ posiciones:("[" _ v: Expresion _"]" {return v})* _ ";" { return crearNodo('dclArrayCopia', { tipo, id, exp: crearNodo('referenciaVar', {id: id2, posiciones} ) }) }
    /tipo: TipoDato _ nD:("[" _ val:"]" _ masV:( _"[" _ v:"]" {return v})* { return [val, ...masV] }) _ id: ID _ "=" _ valores: Expresion _ ";" { return crearNodo('dclArray', { tipo, id, nD, valores }) }
    / tipo1: TipoDato _ nD:("[" _ val:"]" _ masV:( _"[" _ v:"]" {return v})* { return [val, ...masV] }) _ id: ID _ "=" _ "new" _ tipo2: ("int"/"float"/"string"/"boolean"/"char") _ tamanos:("[" _ val: Expresion _"]" _ masV:( _"[" _ v: Expresion _"]" {return v})* { return [val, ...masV] }) _ ";" { return crearNodo('dclArrayReser', { tipo1, nD, id, tipo2, tamanos }) }

DclFunc = 
    tipo: (TipoDato/"void"/ID) dimen:( _"[" _ v:"]" {return v})* _ id: ID _ "(" _ params: Parametros? _ ")" _ bloque: Bloque { return crearNodo('dclFunc', { tipo, dm:dimen, id, params: params || [], bloque }) }

Parametros = 
    tipo: (TipoDato/ID) dimen:( _"[" _ v:"]" {return v})* _ id: ID _ masP:("," _ tipo2: (TipoDato/ID) dimen2:( _"[" _ v:"]" {return v})* _ id2: ID _ { return { tipo:tipo2, id:id2, dm: dimen2 } })* { return [ { tipo, id, dm: dimen }, ...masP ] }

TipoDato = "int" / "float" / "string" / "boolean" / "char"

ID = [a-zA-Z_][a-zA-Z0-9_]* { return text() }

Struct = "struct" _ id: ID _ "{" _ atrib: Atributo _ atributos: Atributo* _ "}" _ ";"? _ { return crearNodo('struct', { id, atrib, atributos }) }

Atributo = tipo: ("int"/"float"/"string"/"boolean"/"char"/ID) _ id: ID _ ";" _ { return { tipo, id } }

Sentencias =
    "print(" _ exp: Expresion _ expM: ( _ "," _ expM: Expresion _ { return expM })* _ ")" _ ";" { return crearNodo('print', { exps: [exp, ...expM] }) }
    / b: Bloque { return b }
    / "if" _ "(" _ cond: Expresion _")" _ sent: Sentencias _ sentF: ( _ "else" _ sentF: Sentencias { return sentF } )? { return crearNodo('if', { cond, sent, sentF }) }
    / "while" _ "(" _ cond: Expresion _ ")" _ sent: Sentencias { return crearNodo('while', { cond, sent }) }
    / "for" _ "(" _ decl: ForInicio _ cond: Expresion _ ";" _ incre: Expresion _ ")" _ sent: Sentencias { return crearNodo('for', { decl, cond, incre, sent }) }
    / "switch" _ "(" _ cond: Expresion _ ")" _ "{" _ cases: Casos* _ def:( "default" _ ":" _ sentD: Declaracion* { return sentD } )? _ "}" _ { return crearNodo('switch', { cond, cases, def }) }
    / "for" _ "(" _ tipo: ("int"/"float"/"string"/"boolean"/"char") _ id: ID _ ":" _ id2: ID _ ")" _ sent: Sentencias { return crearNodo('forEach', { tipo, id, id2, sent }) }
    / "break" _ ";" { return crearNodo('break') }
    / "continue" _ ";" { return crearNodo('continue') }
    / "return" _ exp: Expresion? _ ";" { return crearNodo('return', { exp }) }
    / exp: Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

Bloque = "{" _ dcls: Declaracion* _ "}"{ return crearNodo('bloque', { dcls }) }

ForInicio = 
    decl: VarDcl { return decl }
    / exp: Expresion _ ";" { return exp }

Casos = "case"_ exp: Expresion _ ":" _ sent: Declaracion* _ { return { exp, sent } }

InstanciaS =
    tipo: ID _ id: ID _ "=" _ exp: Expresion ";"? _ { return crearNodo('instanciaStruct', { tipo, id, exp }) }

Inst = tipo: ID _ "{"_ atributos:( atri: AtributoIn _ atris:("," _ atr: AtributoIn { return atr })* _ { return [atri, ...atris] }) _ "}" { return crearNodo('instanciaExp', { tipo, atributos }) }

AtributoIn = id: ID _ ":" _ exp: Expresion _ { return { id, exp } }

AccederAtrib = instancia: ID _ "." _ atributo: ID _ masA:("." _ atri: ID {return atri })* _ asig:( "=" _ exp: Expresion {return exp})? { return crearNodo('accesoAtributo', { instancia, atributo, masA, asig }) }

Expresion = 
    Asignacion
    // / FuncArray

Asignacion =
    id: ID _ posiciones:("[" _ v: Expresion _"]" {return v})*  _ "=" _ asign: Expresion { return crearNodo('asignacion', { id, posiciones, asign }) }
    / id: ID _ op:("+="/"-=") _ exp2: Expresion { return crearNodo('asignacion', { id, posiciones:[],asign: crearNodo('binaria', { op, izq: crearNodo('referenciaVar', { id, posiciones:[] }) , der: exp2 }) }) }
    // / FuncArray
    // / id: Expresion ".indexOf" _ "(" _ exp:Expresion _ ")" { return crearNodo('funcionesArray', { func: "indexof", id , exp } ) } 
    // / id: Expresion ".join" _ "(" _ ")" { return crearNodo('funcionesArray', { func: "join", id ,exp: undefined} ) }
    // / id: Expresion ".length" { return crearNodo('funcionesArray', { func: "length", id ,exp: undefined} ) }
    / Ternario


// FuncArray = 
//     id: Ternario ".indexOf" _ "(" _ exp:Ternario _ ")" { return crearNodo('funcionesArray', { func: "indexof", id , exp } ) } 
//     / id: Ternario ".join" _ "(" _ ")" { return crearNodo('funcionesArray', { func: "join", id ,exp: undefined} ) }
//     / id: Ternario ".length" { return crearNodo('funcionesArray', { func: "length", id ,exp: undefined} ) }
//     / Ternario

Ternario = cond: OpOR _ "?" _ exp1: OpOR _ ":" _ exp2: OpOR _ { return crearNodo('ternario', { cond, exp1, exp2 }) }
    / OpOR

OpOR = izq: OpAND expansion: (
    _ op: ("||") _ der: OpAND { return { tipo: op, der } }
    )* {
        return expansion.reduce(
            (operacionAnterior, operacionActual) => {
                const { tipo, der } = operacionActual
                return crearNodo('binaria', {op: tipo, izq: operacionAnterior, der})
            },
            izq
        )
    }

OpAND = izq: OperadoresEqua expansion: (
    _ op: ("&&") _ der: OperadoresEqua { return { tipo: op, der } }
    )* {
        return expansion.reduce(
            (operacionAnterior, operacionActual) => {
                const { tipo, der } = operacionActual
                return crearNodo('binaria', {op: tipo, izq: operacionAnterior, der})
            },
            izq
        )
    }

OperadoresEqua = izq: OperadoresComp expansion: (
    _ op: ("!="/"==") _ der: OperadoresComp { return { tipo: op, der } }
    )* {
        return expansion.reduce(
            (operacionAnterior, operacionActual) => {
                const { tipo, der } = operacionActual
                return crearNodo('binaria', {op: tipo, izq: operacionAnterior, der})
            },
            izq
        )
    }

OperadoresComp = izq: Suma expansion: (
    _ op: ("<="/"<"/">="/">") _ der: Suma { return { tipo: op, der } }
    )* {
        return expansion.reduce(
            (operacionAnterior, operacionActual) => {
                const { tipo, der } = operacionActual
                return crearNodo('binaria', {op: tipo, izq: operacionAnterior, der})
            },
            izq
        )
    }

Suma = 
    izq:Multi expansion:(
    _ op:("+" / "-") _ der:Multi { return { tipo: op, der } }
    )* { 
        return expansion.reduce(
            (operacionAnterior, operacionActual) => {
                const { tipo, der } = operacionActual
                return crearNodo('binaria', {op: tipo, izq: operacionAnterior, der})
            },
            izq
        )
    }


Multi = 
    izq:Unaria expansion:(
    _ op:("*" / "/"/"%") _ der:Unaria { return { tipo: op, der } }
    )* {
        return expansion.reduce(
        (operacionAnterior, operacionActual) => {
            const { tipo, der } = operacionActual
            return crearNodo('binaria', {op: tipo, izq: operacionAnterior, der})
        },
        izq
        )
    }

Unaria = 
    FuncArray
    / FuncionesEmbebidas
    / op:("-"/"typeof"/"!") _ num:Unaria { return crearNodo('unaria', { op, exp: num }) }
    / id: ID op:("++"/"--") { return crearNodo('asignacion', { id, posiciones:[], asign: crearNodo('unaria', { op , exp: crearNodo('referenciaVar', { id, posiciones:[] }) }) }) }
    / id: ID _ posiciones:("[" _ val: Expresion _"]" _ masV:( _"[" _ v: Expresion _"]" {return v})* { return [val, ...masV] }) { return crearNodo('referenciaVar', {id, posiciones}) }
    / AccederAtrib
    / Llamada
    / Dato

Llamada = callee:Dato _ parametros:( "(" _ args: Args? _ ")" { return args })* {
    return parametros.reduce(
        (callee, args) => {
            return crearNodo('llamada', { callee, args: args || [] })
        },
        callee
    )
}

Args = arg: Expresion _ masArg: ("," _ exp: Expresion { return exp })* { return [arg, ...masArg] }

FuncArray = 
    idR: ID _ posiciones:("[" _ v: Expresion _"]" {return v})* _ ".indexOf" _ "(" _ exp:Expresion _ ")" { return crearNodo('funcionesArray', { func: "indexof", id: crearNodo('referenciaVar', { id: idR, posiciones }) , exp } ) } 
    / idR: ID _ posiciones:("[" _ v: Expresion _"]" {return v})* _ ".join" _ "(" _ ")" { return crearNodo('funcionesArray', { func: "join", id: crearNodo('referenciaVar', { id: idR, posiciones }) ,exp: undefined} ) }
    / idR: ID _ posiciones:("[" _ v: Expresion _"]" {return v})* _ ".length" { return crearNodo('funcionesArray', { func: "length", id: crearNodo('referenciaVar', { id: idR, posiciones }),exp: undefined} ) }

FuncionesEmbebidas = 
    "parseInt" _ "(" _ exp:Expresion _ ")" { return crearNodo('unaria', { op: "parseInt", exp }) }
    / "parsefloat" _ "(" _ exp:Expresion _ ")" { return crearNodo('unaria', { op: "parsefloat", exp }) }
    / "toString" _ "(" _ exp:Expresion _ ")" { return crearNodo('unaria', { op: "toString", exp }) }
    / "toLowerCase" _ "(" _ exp:Expresion _ ")" { return crearNodo('unaria', { op: "toLowerCase", exp }) }
    / "toUpperCase" _ "(" _ exp:Expresion _ ")" { return crearNodo('unaria', { op: "toUpperCase", exp }) }
    / "Object." _ "keys" _ "(" _ exp:Expresion _ ")" { return crearNodo('unaria', { op: "keys", exp }) }

Dato = 
    [0-9]+ { return text().includes('.') ? crearNodo('dato', { valor: parseFloat(text(), 10), tipo:"float"}) : crearNodo('dato', { valor: parseInt(text(), 10), tipo:"int"})	 }
    / bool:("true"/"false") { return bool == "true" ? crearNodo('dato', { valor: true, tipo: 'boolean' }) : crearNodo('dato', { valor: false, tipo: 'boolean' }) }
    / "'" char:[^'] "'" { return crearNodo('dato', { valor: char, tipo: 'char' }) }
    / "\"" cadena:([^"]*) "\"" { return crearNodo('dato', { valor: unescapeString(cadena.join("")), tipo: 'string' }) }
    / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp })}
    / "{" _ exp1: Expresion _ valores:( "," _ exp: Expresion _ {return exp})* "}" { return crearNodo('array', {valores:[exp1, ...valores]}) }
    / ins: Inst { return ins }
    / id: ID { return crearNodo('referenciaVar', { id, posiciones:[]}) }

_ = ( Comentarios / [ \t\n\r] )*

Comentarios = 
    "//" [^\n]* 
    / "/*" (!"*/" .)* "*/"

/*PalabrasReservadas = 
    "int" / "float" / "string" / "boolean" / "char" /
    "var" / "print" / "if" / "else" / "while" / 
    "for" / "switch" / "case" / "default" / "new" /
    "typeof" / "true" / "false" / "return" /
    "struct" / "break" / "continue" / "null" / "void" /
    "toString" / "toLowerCase" / "toUpperCase" /
    "parseInt" / "parseFloat" / "length" / "join" / "indexOf"*/
