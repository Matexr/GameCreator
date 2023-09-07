














var GUI_BattlerStatus = (function (_super) {
    __extends(GUI_BattlerStatus, _super);
    function GUI_BattlerStatus() {
        var _this = _super.call(this) || this;
        _this.on(EventObject.DISPLAY, _this, _this.onDisplay);
        return _this;
    }
    GUI_BattlerStatus.prototype.onDisplay = function () {
        this.refreshActorDataPanel();
        this.refreshStatus();
    };
    GUI_BattlerStatus.prototype.refreshActorDataPanel = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler)
            return;
        var selectedActor = battler.actor;
        var lv = GameBattleHelper.getLevelByActor(selectedActor);
        this.smallAvatar.avatarID = selectedActor.avatar;
        this.actorFace.image = selectedActor.face;
        this.actorName.text = selectedActor.name;
        var classData = GameData.getModuleData(7, selectedActor.class);
        this.actorClass.text = classData ? classData.name : "";
        this.classIcon.image = classData ? classData.icon : "";
        if (selectedActor.growUpEnabled) {
            this.actorLv.text = "LV." + lv;
            var nextExp = Game.getLevelUpNeedExp(selectedActor, lv);
            this.actorExpInfo.text = selectedActor.currentEXP + "/" + nextExp;
            this.actorExpSlider.value = selectedActor.currentEXP * 100 / nextExp;
        }
        else {
            this.actorLv.text = "-----";
            this.actorExpInfo.text = "-----";
            this.actorExpSlider.value = 100;
        }
        this.atk.text = selectedActor.ATK.toString();
        this.def.text = selectedActor.DEF.toString();
        this.agi.text = selectedActor.AGI.toString();
        this.mag.text = selectedActor.MAG.toString();
        this.magDef.text = selectedActor.MagDef.toString();
        this.pow.text = selectedActor.POW.toString();
        this.end.text = selectedActor.END.toString();
        this.actionSpeed.text = selectedActor.ActionSpeed.toString();
        this.crit.text = selectedActor.CRIT.toString();
        this.magCrit.text = selectedActor.MagCrit.toString();
        this.hit.text = selectedActor.HIT.toString();
        this.dod.text = selectedActor.DOD.toString();
        this.refreshActorDataPanelEnergyValue();
    };
    GUI_BattlerStatus.prototype.refreshActorDataPanelEnergyValue = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler)
            return;
        var selectedActor = battler.actor;
        this.maxHP.text = selectedActor.hp + "/" + selectedActor.MaxHP.toString();
        this.maxSP.text = selectedActor.sp + "/" + selectedActor.MaxSP.toString();
    };
    GUI_BattlerStatus.prototype.refreshStatus = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler)
            return;
        var selectedActor = battler.actor;
        var arr = [];
        for (var i = 0; i < selectedActor.status.length; i++) {
            var status = selectedActor.status[i];
            if (!status.icon)
                continue;
            var d = new ListItem_1028;
            d.icon = status.icon;
            d.tipsLabel = GUI_Manager.statusDesc(status);
            d.layer = status.currentLayer > 1 ? status.currentLayer.toString() : "";
            arr.push(d);
        }
        this.statusList.items = arr;
    };
    return GUI_BattlerStatus;
}(GUI_26));
//# sourceMappingURL=GUI_BattlerStatus.js.map