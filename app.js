
const unquote  = require('unquote')
const esprima = require('esprima')
const escodegen = require('escodegen')
const luaParser = require('luaparse')
const fs = require('fs')
const minimist = require('minimist')

const esprimaConfig = {
    // comment : true,
    // loc : true,
}

function isLuaArray(fields)
{
    for (const field of fields) {
        if (field.type != 'TableValue') {
            return false
        }
    }
    return true
}

const operatorMap = {
    '~=' : '!='
}

translator = {
    Chunk : (ast) => {
        const body = []
        for (const v of ast.body) {
            body.push(trans(v))
        }
        return {
            type : 'Program',
            body : body,
            sourceType: 'script',
        }
    },
    LocalStatement : (ast) => {
        const declarations = []
        
        for (const i in ast.variables) {
            const k = ast.variables[i]
            const v = ast.init[i]
            const declarator = {
                type : "VariableDeclarator",
                id : trans(k),
                init : trans(v),
            }
            declarations.push(declarator)
        }

        return {
            type : 'VariableDeclaration',
            declarations: declarations,
            kind : 'let',
        }
    },
    AssignmentStatement : (ast) => {
        return {
            type : 'ExpressionStatement',
            expression : {
                type : 'AssignmentExpression',
                operator: '=',
                left: trans(ast.variables[0]),
                right : trans(ast.init[0]),
            }
        }
    },
    Identifier : (ast) => {
        return ast
    },
    NumericLiteral : (ast) => {
        return {
            type : 'Literal',
            value: ast.value,
            raw : ast.raw,
        }
    },
    StringLiteral : (ast) => {
        return {
            type : 'Literal',
            value: unquote(ast.raw),
            raw : ast.raw,
        }
    },
    BooleanLiteral : (ast) => {
        return {
            type : 'Literal',
            value: ast.value,
            raw : ast.raw,
        }
    },
    NilLiteral : (ast) => {
        return {
            type : "Identifier",
            name : "undefined",
        }
    },
    TableConstructorExpression : (ast) => {
        const isArray = isLuaArray(ast.fields)

        const properties = []
        for (const field of ast.fields) {
            properties.push(trans(field))
        }
        if (isArray) {
            return {
                type : 'ArrayExpression',
                elements : properties,
            }
        } else {
            return {
                type: "ObjectExpression",
                properties: properties,
            }
        }
    },
    TableKey : (ast) => {
        const key = trans(ast.key)
        const value = trans(ast.value)

        return {
            type: "Property",
            key : key,
            value : value,
            computed : true,
            kind : "init",
        }
    },
    TableKeyString : (ast) => {
        const key = trans(ast.key)
        const value = trans(ast.value)

        return {
            type: "Property",
            key : key,
            value: value,
            computed: false,
            kind: "init",
        }
    },
    TableValue : (ast) => {
        return trans(ast.value)
    },
    MemberExpression : (ast) => {
        const object = trans(ast.base)
        const property = trans(ast.identifier)

        return {
            type : "MemberExpression",
            computed : false,
            object : object,
            property : property,
        }
    },
    CallStatement : (ast) => {
        const expression = trans(ast.expression)
        return {
            type : "ExpressionStatement",
            expression : expression,
        }
    },
    CallExpression : (ast) => {
        const callee = trans(ast.base)
        const arguments = []
        for (const arg of ast.arguments) {
            arguments.push(trans(arg))
        }

        return {
            type : "CallExpression",
            callee : callee,
            arguments : arguments,
        }
    },
    IndexExpression : (ast) => {
        const object = trans(ast.base)
        const property = trans(ast.index)

        return {
            type : "MemberExpression",
            computed : true,
            object : object,
            property : property,
        }
    },
    FunctionDeclaration : (ast) => {
        const anonymousFunction = ast.identifier == null

        const params = []
        for (const param of ast.parameters) {
            params.push(trans(param))
        }

        if (anonymousFunction) {
            const body = []
            for (const v of ast.body) {
                body.push(trans(v))
            }

            const block = {
                type : "BlockStatement",
                body : body
            }

            return {
                type : "ArrowFunctionExpression",
                id: null,
                params : params,
                body : block,
            }
        } else {
            // TODO
        }
    },
    ReturnStatement : (ast) => {
        if (ast.arguments.length == 1) {
            return {
                type : "ReturnStatement",
                argument : trans(ast.arguments[0]),
            }
        } else {
            // TODO
        }
    },
    BinaryExpression : (ast) => {
        const operator = operatorMap[ast.operator] ? operatorMap[ast.operator] : ast.operator

        return {
            type : "BinaryExpression",
            operator : operator,
            left : trans(ast.left),
            right : trans(ast.right),
        }
    },
    UnaryExpression : (ast) => {
        return {
            type : "UnaryExpression",
            operator : ast.operator,
            argument : trans(ast.argument),
            prefix : true,
        }
    }
}

function trans(ast)
{
    const fn = translator[ast.type]
    if (fn) {
        return fn(ast)
    } else {
        console.error("unhandle type", ast)
    }
}

function compile(str)
{
    return trans(luaParser.parse(str))
}

function compareAST(jsStr, luaStr)
{
    const jsAST = esprima.parse(jsStr, esprimaConfig)
    console.log('===== jsAST')
    console.dir(jsAST, {depth:null})
    console.log(escodegen.generate(jsAST))

    const luaAst = luaParser.parse(luaStr)
    console.log("======= luaAst")
    console.dir(luaAst, {depth: null})

    console.log("======= ast")
    const ast = compile(luaStr)
    console.dir(ast, {depth: null})
    console.log(escodegen.generate(ast))
}

// const argv = process.argv
// const path = argv[2]
// const str = fs.readFileSync(path, 'utf-8')
// const code = compile(str)
// console.log(code)

// compareAST("const a = -100", "local a = -100")

// compareAST("// let a = 1", "-- local a = 1")

// compareAST("\
// require('resmng', package.seeall)\n\
// \n\
// // comment 1\n\
// hello = 1\n\
// // comment 2\n\
// world = 2\n\
// ", "\
// require('resmng', package.seeall)\n\
// \n\
// -- comment 1\n\
// hello = 1\n\
// -- comment 2\n\
// world = 2\n\
// ")

function help()
{
    console.log("Usage")
    console.log(" -i : input file")
    console.log(" -o : output file")
}

function main()
{
    const argv = minimist(process.argv.slice(2), {
        alias: {o: 'output', i:'input'},
    })

    let input = argv.i
    let output = argv.o
    if (!(input && output)) {
        help()
        return
    }

    const str = fs.readFileSync(input, 'utf-8')
    const ast = compile(str)
    const code = escodegen.generate(ast)
    const h = fs.createWriteStream(output)
    h.write(code)
    h.close()
    process.on('exit', (code) => process.exit(code))
}
main()