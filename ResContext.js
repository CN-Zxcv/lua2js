
const fs = require('fs')
const vm = require('vm')

let resmng = {
    package : {
        seeall : undefined,
    },
    setmetatable(t, mt)
    {
        Object.setPrototypeOf(t, mt.__index)
        return t
    },
    module() {},
    svnnum() {},

    load(path)
    {
        const str = fs.readFileSync(path + '.js', 'utf-8')
        const script = new vm.Script(str, {filename: path})
        script.runInContext(resmng)
    },
}
resmng.resmng = resmng
vm.createContext(resmng)

module.exports = resmng