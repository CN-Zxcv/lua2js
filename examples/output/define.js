module('resmng', package.seeall);
SrvEnv = {
    Release: 0,
    Preview: 1,
    Pressure: 2,
    Dev: 9
};
PlayMode = {
    None: 0,
    Story: 100
};
PlayModeGroup = setmetatable({ Story: 1 }, {
    __index: {
        isStory: mode => {
            return math.floor(mode / 100) == PlayModeGroup.Story;
        }
    }
});
SceneEventOrder = {
    Offline: [
        'Kcp',
        'Fight'
    ],
    Online: [
        'Fight',
        'Kcp'
    ]
};
RandomDivisor = 10000;
CalculatePrecise = 10000;
HourSec = 60 * 60;
DaySec = 24 * 60 * 60;
Eq = 1;
Neq = 2;
Gt = 3;
Gte = 4;
Lt = 5;
Lte = 6;
CondOp = {
    [Eq]: (a, b) => {
        return a == b;
    },
    [Neq]: (a, b) => {
        return a != b;
    },
    [Gt]: (a, b) => {
        return a > b;
    },
    [Gte]: (a, b) => {
        return a >= b;
    },
    [Lt]: (a, b) => {
        return a < b;
    },
    [Lte]: (a, b) => {
        return a <= b;
    }
};
FistAttackName = {
    [1]: 'LightFist',
    [2]: 'HeavyFist',
    [3]: 'Transition',
    [4]: 'Combo',
    [5]: 'Counter'
};
AttackName = {
    LightFist: 'LightFist',
    HeavyFist: 'HeavyFist'
};
AttackSkillMapIndex = {
    [AttackName.HeavyFist]: 1,
    [AttackName.LightFist]: 2
};
SpecialAttackNameMap = {
    [AttackName.LightFist]: {
        ani: 'LightFist',
        final: false,
        level: 1,
        cooldown: 2,
        type: 1,
        skill_idx: AttackSkillMapIndex[AttackName.LightFist]
    },
    [AttackName.HeavyFist]: {
        ani: 'SuperPowerLeg',
        final: false,
        level: 1,
        cooldown: 0,
        type: 0,
        skill_idx: AttackSkillMapIndex[AttackName.HeavyFist]
    }
};