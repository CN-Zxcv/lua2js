module("resmng", package.seeall)

-- Hx@2019-07-25: 服务器ID规则
--[环境(1)][大区(1)][类型(1)][编号(3)]

SrvEnv = {
    Release = 0,  -- 发布
    Preview = 1,  -- 预览
    Pressure = 2, -- 压测
    Dev = 9,      -- 开发
}

PlayMode = {
	None = 0,
	Story = 100,       -- 主线
}

PlayModeGroup = setmetatable({
    Story = 1,
}, {__index = {
    isStory = function(mode)
        return math.floor(mode / 100) == PlayModeGroup.Story
    end
}})

SceneEventOrder = {
    Offline = {
        'Kcp', 'Fight',  
    },
    Online = {
        'Fight', 'Kcp',  
    },
}

-- 随机值上限
RandomDivisor = 10000
-- 计算精度
CalculatePrecise = 10000

HourSec = 60 * 60
DaySec = 24 * 60 * 60

--操作符
Eq = 1      -- ==
Neq = 2     -- ~=
Gt = 3      -- >
Gte = 4     -- >=
Lt = 5      -- <
Lte = 6     -- <=

CondOp = {
	[Eq] = function(a, b) return a == b end,
	[Neq] = function(a, b) return a ~= b end,
	[Gt] = function(a, b) return a > b end,
	[Gte] = function(a, b) return a >= b end,
	[Lt] = function(a, b) return a < b end,
	[Lte] = function(a, b) return a <= b end,
}

FistAttackName = {
	[1] = "LightFist",
	[2] = "HeavyFist",
	[3] = "Transition",
    [4] = "Combo",
    [5] = "Counter",
}

AttackName = {
    LightFist = "LightFist",
    HeavyFist = "HeavyFist",
}

AttackSkillMapIndex = {    
    [AttackName.HeavyFist] = 1,
    [AttackName.LightFist] = 2,
}

SpecialAttackNameMap = {
    [AttackName.LightFist] = {ani="LightFist", final=false, level=1, cooldown=2, type=1, skill_idx=AttackSkillMapIndex[AttackName.LightFist]},
    [AttackName.HeavyFist] = {ani="SuperPowerLeg", final=false, level=1, cooldown=0, type=0, skill_idx=AttackSkillMapIndex[AttackName.HeavyFist]},
}