# lua2js
translate lua config file to javascript

i searched around and found a couple of repos (like [lua.js](https://github.com/mherkender/lua.js),[basicer/lua2js](https://github.com/basicer/lua2js),etc..), they are not really fit my demand, so i made my own translator, 

what i what is

- parse config files to javascipt, 
- need trans a little simple functions, 

- to pure javascript code, not run in a vm, nor wraped in heave compatible functions
- and one important thing for a config file translator is **distinguish a lua table is used as dict or array**

##### why not json

using json can`t distinguish a lua table is expect to use as dict or array

and we use excel and lua format(not json!!) origin , to **support named keys**. 

use json will lose these information,   

```lua
HERO_A = 1001

AttackName = {
	LightFist = 1,
	HeavyFist = 2,
}

propHero = {
	[HERO_A] = {
		ID=HERO_A,
		Skills={
			[AttackName.LightFist] = xxx,
			[AttackName.HeavyFist] = xxx,
		}
	}
}

```

this tool is used for lua5.1 and lua5.3 with module extend open, not tested on pure lua5.3

## Usage

```
node app.js -i [inputfile] -o [outputfile]
```

and a simple loader : resmng.js, to show my usage, 

## Supported Syntax

```lua
-- values
IntLit = 1
NegLit = -1
BoolLit = false
NilLit = nil
SimpleCalcLit = 24 * 60 * 60
StringLit = "hello"

-- distinguish is array or dict
-- if we have key (format like, key = value, no matter what key realy is (very useful in a config file)), then is a dict, otherwise a array 
Table = {
	StringLit = "hello",
    [1] = 1,
    [Key.SubKey.SubSubKey] = Key.SubKey,
}

Array = {1, "c", 3}

-- simple functions
Eq = 1
Neq = 1
CondOp = {
   [Eq] = function(a, b) return a == b end,
   [Neq] = function(a, b) return a ~= b end,
}
```

