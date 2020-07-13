--
-- $Id$
--

module( "resmng" )
svnnum("$Id$")

propCharacter = {

	[CHAR_TEST] = { 
        ID = CHAR_TEST, 
        Name = nil, 
        Skeleton = "Hero/test", 
        Shape = {10001,10002,10003,10004,10005}, 
        HeadImage = "ui/sprite/head", 
        AttrID = 1, 
        Skills = {[resmng.AttackName.LightFist]="TestLightFist",[resmng.AttackName.HeavyFist]="TestHeavFist"}, 
        ComboList = {"LightLeg", "HeavyLeg"}, 
        Version = nil, 
    },
}
