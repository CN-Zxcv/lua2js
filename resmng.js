
const resmng = require('./ResContext')

resmng.load('./examples/output/define')
resmng.load('./examples/output/define_charactor')
resmng.load('./examples/output/prop_charactor')

console.dir(resmng, {depth:null})
console.log("cond",  resmng.CondOp[resmng.Lt](1, 2))
// console.log(resmng.Srv)