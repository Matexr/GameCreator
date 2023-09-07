














var ProjectGame = (function (_super) {
    __extends(ProjectGame, _super);
    function ProjectGame() {
        var _this = _super.call(this) || this;
        _this.EVENT_REMOVE_ACTOR_ITEM = "GameEVENT_REMOVE_ACTOR_ITEM";
        _this.EVENT_CARRY_ACTOR_ITEM = "GameEVENT_CARRY_ACTOR_ITEM";
        _this.EVENT_LEARN_SKILL = "GameEVENT_LEARN_SKILL";
        _this.EVENT_FORGET_SKILL = "GameEVENT_FORGET_SKILL";
        _this.EVENT_REPLACE_ATTACK_SKILL = "GameEVENT_REPLACE_ATTACK_SKILL";
        _this.EVENT_WEAR_ACTOR_EQUIP = "GameEVENT_WEAR_ACTOR_EQUIP";
        _this.EVENT_TAKE_OFF_ACTOR_EQUIP = "GameEVENT_TAKE_OFF_ACTOR_EQUIP";
        EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, _this.onInSceneStateChange, _this);
        return _this;
    }
    ProjectGame.prototype.init = function () {
        this.player = new ProjectPlayer();
    };
    ProjectGame.prototype.getActorByCheckType = function (actorCheckType, actorIDUseVar, actorID, actorIDVarID, actorInPartyIndexVarIDUseVar, actorInPartyIndex, actorInPartyIndexVarID, enemyInPartyIndexVarIDUseVar, enemyInPartyIndex, enemyInPartyIndexVarID) {
        if (actorCheckType == 0) {
            var pActorID = MathUtils.int(actorIDUseVar ? Game.player.variable.getVariable(actorIDVarID) : actorID);
            var playerActorDS = ProjectPlayer.getPlayerActorDSByActorID(pActorID);
            return playerActorDS ? playerActorDS.actor : null;
        }
        else if (actorCheckType == 1) {
            var pActorInPartyIndex = MathUtils.int(actorInPartyIndexVarIDUseVar ? Game.player.variable.getVariable(actorInPartyIndexVarID) : actorInPartyIndex);
            var playerActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(pActorInPartyIndex);
            return playerActorDS ? playerActorDS.actor : null;
        }
        else if (actorCheckType == 2) {
            if (!GameBattleHelper.isInBattle)
                return null;
            var pEnemyActorInPartyIndex = MathUtils.int(enemyInPartyIndexVarIDUseVar ? Game.player.variable.getVariable(enemyInPartyIndexVarID) : enemyInPartyIndex);
            var battler = GameBattle.enemyBattlers[pEnemyActorInPartyIndex];
            if (battler)
                return battler.actor;
            return null;
        }
        else if (actorCheckType == 3) {
            if (!GameBattleHelper.isInBattle)
                return null;
            var battler = GameBattleAction.fromBattler;
            if (battler)
                return battler.actor;
            return null;
        }
        else if (actorCheckType == 4) {
            if (!GameBattleHelper.isInBattle)
                return null;
            var battler = GameBattleAction.hitBattler;
            if (battler)
                return battler.actor;
            return null;
        }
    };
    ProjectGame.prototype.getActorSkillBySkillID = function (actor, skillID) {
        return ArrayUtils.matchAttributes(actor.skills, { id: skillID }, true)[0];
    };
    ProjectGame.prototype.actorLearnSkill = function (actor, skillID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var skill = this.getActorSkillBySkillID(actor, skillID);
        if (skill || !GameData.getModuleData(8, skillID))
            return;
        var newSkill = GameData.newModuleData(8, skillID);
        actor.skills.push(newSkill);
        if (happenEvent)
            EventUtils.happen(Game, Game.EVENT_LEARN_SKILL, [actor, newSkill]);
        return newSkill;
    };
    ProjectGame.prototype.actorForgetSkill = function (actor, skillID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var skill = this.getActorSkillBySkillID(actor, skillID);
        if (!skill || !GameData.getModuleData(8, skillID))
            return;
        actor.skills.splice(actor.skills.indexOf(skill), 1);
        if (happenEvent)
            EventUtils.happen(Game, Game.EVENT_FORGET_SKILL, [actor, skill]);
        return skill;
    };
    ProjectGame.prototype.actorForgetAllSkills = function (actor, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var forgetSkills = actor.skills.concat();
        actor.skills.length = 0;
        for (var i = 0; i < forgetSkills.length; i++) {
            if (happenEvent)
                EventUtils.happen(Game, Game.EVENT_FORGET_SKILL, [actor, forgetSkills[i]]);
        }
        return forgetSkills;
    };
    ProjectGame.prototype.actorReplaceAttackSkill = function (actor, skillID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        if (!GameData.getModuleData(8, skillID))
            return;
        var newSkill = GameData.newModuleData(8, skillID);
        actor.atkSkill = newSkill;
        actor.atkMode = 1;
        if (happenEvent)
            EventUtils.happen(Game, Game.EVENT_REPLACE_ATTACK_SKILL, [actor, newSkill]);
        return newSkill;
    };
    ProjectGame.prototype.getActorEquipByPartID = function (actor, partID) {
        return ArrayUtils.matchAttributes(actor.equips, { partID: partID }, true)[0];
    };
    ProjectGame.prototype.getActorEquipByEquipID = function (actor, equipID) {
        return ArrayUtils.matchAttributes(actor.equips, { id: equipID }, true)[0];
    };
    ProjectGame.prototype.wearActorEquip = function (actor, newEquip, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        if (newEquip) {
            var takeOffEquip = this.takeOffActorEquipByPartID(actor, newEquip.partID);
            actor.equips.push(newEquip);
            if (happenEvent)
                EventUtils.happen(Game, Game.EVENT_WEAR_ACTOR_EQUIP, [actor, newEquip.partID, takeOffEquip, newEquip]);
            return { success: true, takeOffEquip: takeOffEquip };
        }
    };
    ProjectGame.prototype.takeOffActorEquipByPartID = function (actor, partID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var idx = ArrayUtils.matchAttributes(actor.equips, { partID: partID }, true, "==", true)[0];
        if (idx == null)
            return null;
        var takeOffEquip = actor.equips.splice(idx, 1)[0];
        if (takeOffEquip && happenEvent)
            EventUtils.happen(Game, Game.EVENT_TAKE_OFF_ACTOR_EQUIP, [actor, partID, takeOffEquip]);
        return takeOffEquip;
    };
    ProjectGame.prototype.takeOffActorAllEquips = function (actor, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var takeOffEquipArr = actor.equips.concat();
        actor.equips.length = 0;
        for (var i = 0; i < takeOffEquipArr.length; i++) {
            var takeOffEquip = takeOffEquipArr[i];
            if (happenEvent)
                EventUtils.happen(Game, Game.EVENT_TAKE_OFF_ACTOR_EQUIP, [actor, takeOffEquip.partID, takeOffEquip]);
        }
        return takeOffEquipArr;
    };
    ProjectGame.prototype.getLevelUpNeedExp = function (actor, lv) {
        return Math.floor(this.getGrowValueByLv(actor, "needEXPGrow", lv));
    };
    ProjectGame.prototype.refreshActorAttribute = function (actor, lv) {
        if (lv === void 0) { lv = null; }
        if (lv == null)
            lv = GameBattleHelper.getLevelByActor(actor);
        var res = this.clacActorAttribute(actor, lv);
        if (res) {
            actor.ATK = Math.floor(res.ATK);
            actor.DEF = Math.floor(res.DEF);
            actor.AGI = Math.floor(res.AGI);
            actor.DOD = Math.floor(res.DOD);
            actor.MaxHP = Math.floor(res.MaxHP);
            actor.MaxSP = Math.floor(res.MaxSP);
            actor.POW = Math.floor(res.POW);
            actor.END = Math.floor(res.END);
            actor.MAG = Math.floor(res.MAG);
            actor.MagDef = Math.floor(res.MagDef);
            actor.HIT = Math.floor(res.HIT);
            actor.CRIT = Math.floor(res.CRIT);
            actor.MagCrit = Math.floor(res.MagCrit);
            actor.ActionSpeed = Math.floor(res.ActionSpeed);
            actor.hp = Math.min(actor.MaxHP, Math.max(actor.hp, 0));
            actor.sp = Math.min(actor.MaxSP, Math.max(actor.sp, 0));
        }
    };
    ProjectGame.prototype.clacActorAttribute = function (actor, lv, previewChangeEquipMode, previewChangeEquipID, previewChangeEquip) {
        if (previewChangeEquipMode === void 0) { previewChangeEquipMode = false; }
        if (previewChangeEquipID === void 0) { previewChangeEquipID = 0; }
        if (previewChangeEquip === void 0) { previewChangeEquip = null; }
        var systemActor = GameData.getModuleData(6, actor.id);
        if (!systemActor)
            return;
        var maxhp;
        var maxsp;
        var mag;
        var agi;
        var pow;
        var end;
        var magDef;
        var hit;
        var crit;
        var magCrit;
        var actionSpeed;
        if (actor.growUpEnabled) {
            maxhp = this.getGrowValueByLv(actor, "MaxHPGrow", lv) + actor.increaseMaxHP;
            maxsp = this.getGrowValueByLv(actor, "MaxSPGrow", lv) + actor.increaseMaxSP;
            mag = this.getGrowValueByLv(actor, "MAGGrow", lv) + actor.increaseMag;
            agi = this.getGrowValueByLv(actor, "AGIGrow", lv) + actor.increaseAgi;
            pow = this.getGrowValueByLv(actor, "POWGrow", lv) + actor.increasePow;
            end = this.getGrowValueByLv(actor, "ENDGrow", lv) + actor.increaseEnd;
        }
        else {
            maxhp = systemActor.MaxHP + actor.increaseMaxHP;
            maxsp = systemActor.MaxSP + actor.increaseMaxSP;
            mag = systemActor.MAG + actor.increaseMag;
            agi = systemActor.AGI + actor.increaseAgi;
            pow = systemActor.POW + actor.increasePow;
            end = systemActor.END + actor.increaseEnd;
        }
        magDef = systemActor.MagDef;
        hit = systemActor.HIT;
        crit = 0;
        magCrit = 0;
        actionSpeed = systemActor.ActionSpeed;
        ArrayUtils.removeSameObjectD2(actor.equips, "id", false);
        ArrayUtils.removeSameObjectD2(actor.skills, "id", false);
        ArrayUtils.removeSameObjectD2(actor.status, "id", false);
        var atkIncrease = 0;
        var defIncrease = 0;
        actor.selfStatus.length = 0;
        actor.selfImmuneStatus.length = 0;
        actor.hitTargetStatus.length = 0;
        actor.hitTargetSelfAddStatus.length = 0;
        var equipPartsLength = GameData.getLength(19);
        for (var i = 1; i <= equipPartsLength; i++) {
            var equip = void 0;
            if (previewChangeEquipMode && previewChangeEquipID == i) {
                equip = previewChangeEquip;
            }
            else {
                equip = Game.getActorEquipByPartID(actor, i);
            }
            if (equip) {
                maxhp += equip.maxHP;
                maxsp += equip.maxSP;
                atkIncrease += equip.atk;
                defIncrease += equip.def;
                mag += equip.mag;
                magDef += equip.magDef;
                actionSpeed += equip.actionSpeed;
                hit += equip.hit;
                agi += equip.agi;
                crit += equip.crit;
                magCrit += equip.magCrit;
                if (equip.passiveStatus) {
                    actor.selfStatus = actor.selfStatus.concat(equip.selfStatus);
                    actor.selfImmuneStatus = actor.selfImmuneStatus.concat(equip.selfImmuneStatus);
                    actor.hitTargetStatus = actor.hitTargetStatus.concat(equip.hitTargetStatus);
                    actor.hitTargetSelfAddStatus = actor.hitTargetSelfAddStatus.concat(equip.hitTargetSelfAddStatus);
                }
            }
        }
        for (var i = 0; i < actor.skills.length; i++) {
            var actorSkill = actor.skills[i];
            if (actorSkill.passiveAttribute) {
                maxhp += actorSkill.maxHP;
                maxsp += actorSkill.maxSP;
                atkIncrease += actorSkill.atk;
                defIncrease += actorSkill.def;
                mag += actorSkill.mag;
                magDef += actorSkill.magDef;
                actionSpeed += actorSkill.actionSpeed;
                hit += actorSkill.hitC;
                agi += actorSkill.agi;
                crit += actorSkill.crit;
                magCrit += actorSkill.magCrit;
            }
            if (actorSkill.passiveStatus) {
                actor.selfStatus = actor.selfStatus.concat(actorSkill.selfStatus);
                actor.selfImmuneStatus = actor.selfImmuneStatus.concat(actorSkill.selfImmuneStatus);
                actor.hitTargetStatus = actor.hitTargetStatus.concat(actorSkill.hitTargetStatus);
                actor.hitTargetSelfAddStatus = actor.hitTargetSelfAddStatus.concat(actorSkill.hitTargetSelfAddStatus);
            }
        }
        var atk = pow * 1.5 + atkIncrease;
        var def = end * 2 + defIncrease;
        var dod = agi * 0.1;
        actionSpeed += agi * 0.5;
        var stHPPer = 100;
        var stSPPer = 100;
        var stATKPer = 100;
        var stDEFPer = 100;
        var stMAGPer = 100;
        var stMagDefPer = 100;
        var stActionSpeedPer = 100;
        var stHitPer = 100;
        var stCritPer = 100;
        var stMagCritPer = 100;
        for (var i = 0; i < actor.status.length; i++) {
            var status = actor.status[i];
            stHPPer *= Math.pow(status.maxHPPer / 100, status.currentLayer);
            stSPPer *= Math.pow(status.maxSPPer / 100, status.currentLayer);
            stATKPer *= Math.pow(status.atkPer / 100, status.currentLayer);
            stDEFPer *= Math.pow(status.defPer / 100, status.currentLayer);
            stMAGPer *= Math.pow(status.magPer / 100, status.currentLayer);
            stMagDefPer *= Math.pow(status.magDefPer / 100, status.currentLayer);
            stActionSpeedPer *= Math.pow(status.actionSpeedPer / 100, status.currentLayer);
            stHitPer *= Math.pow(status.hitPer / 100, status.currentLayer);
            stCritPer *= Math.pow(status.critPer / 100, status.currentLayer);
            stMagCritPer *= Math.pow(status.magCritPer / 100, status.currentLayer);
            maxhp += status.maxHP * status.currentLayer;
            maxsp += status.maxSP * status.currentLayer;
            atk += status.atk * status.currentLayer;
            def += status.def * status.currentLayer;
            mag += status.mag * status.currentLayer;
            magDef += status.magDef * status.currentLayer;
            actionSpeed += status.actionSpeed * status.currentLayer;
            hit += status.hit * status.currentLayer;
            crit += status.crit * status.currentLayer;
            magCrit += status.magCrit * status.currentLayer;
        }
        maxhp *= stHPPer / 100;
        maxsp *= stSPPer / 100;
        atk *= stATKPer / 100;
        def *= stDEFPer / 100;
        mag *= stMAGPer / 100;
        magDef *= stMagDefPer / 100;
        actionSpeed *= stActionSpeedPer / 100;
        hit *= stHitPer / 100;
        crit *= stCritPer / 100;
        magCrit *= stMagCritPer / 100;
        atk = Math.max(atk, 0);
        def = Math.max(def, 0);
        agi = Math.max(agi, 0);
        dod = Math.max(dod, 0);
        maxhp = Math.max(maxhp, 0);
        maxsp = Math.max(maxsp, 0);
        pow = Math.max(pow, 0);
        end = Math.max(end, 0);
        mag = Math.max(mag, 0);
        magDef = Math.max(magDef, 0);
        hit = Math.max(hit, 0);
        crit = Math.max(Math.min(crit, 100), 0);
        magCrit = Math.max(Math.min(magCrit, 100), 0);
        actionSpeed = Math.max(actionSpeed, 0);
        return {
            ATK: Math.floor(atk),
            DEF: Math.floor(def),
            AGI: Math.floor(agi),
            DOD: Math.floor(dod),
            MaxHP: Math.floor(maxhp),
            MaxSP: Math.floor(maxsp),
            POW: Math.floor(pow),
            END: Math.floor(end),
            MAG: Math.floor(mag),
            MagDef: Math.floor(magDef),
            HIT: Math.floor(hit),
            CRIT: Math.floor(crit),
            MagCrit: Math.floor(magCrit),
            ActionSpeed: Math.floor(actionSpeed),
        };
    };
    ProjectGame.prototype.onInSceneStateChange = function (inNewSceneState) {
        if (GameGate.gateState == GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT) {
            if (inNewSceneState == 1) {
                ProjectGame.gameStartTime = new Date();
                ProjectPlayer.init();
            }
            else if (inNewSceneState == 2) {
                ProjectGame.gameStartTime = new Date((Date.now() - GUI_SaveFileManager.currentSveFileIndexInfo.indexInfo.gameTime));
            }
        }
        else if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
            if (inNewSceneState == 1 || inNewSceneState == 2) {
                for (var i = 0; i < Game.player.data.party.length; i++) {
                    var actorDS = Game.player.data.party[i];
                    if (actorDS == null)
                        continue;
                    GameData.changeModuleDataToCopyMode(actorDS.actor, 1);
                }
            }
        }
    };
    ProjectGame.prototype.getGrowValueByLv = function (actor, growAttrName, lv) {
        var actorClass = GameData.getModuleData(7, actor.class);
        if (!actorClass)
            return 0;
        var cacheGrowName = growAttrName + "_cache";
        var growData = actor[cacheGrowName];
        if (!actor[cacheGrowName])
            growData = actor[cacheGrowName] = GameUtils.getCurveData(actorClass[growAttrName]);
        var per = lv == 0 ? 0 : (lv - 1) / (actor.MaxLv - 1);
        return GameUtils.getBezierPoint2ByGroupValue(growData, per);
    };
    return ProjectGame;
}(GameBase));
//# sourceMappingURL=ProjectGame.js.map