var GUI_Manager = (function () {
    function GUI_Manager() {
    }
    GUI_Manager.getAttributeDisplayName = function (attName) {
        return WorldData["word_" + attName];
    };
    GUI_Manager.standardList = function (list, useItemClickSe) {
        if (useItemClickSe === void 0) { useItemClickSe = true; }
        list.on(EventObject.CHANGE, this, function (list, state) {
            if (state == 0)
                list.scrollTo(list.selectedIndex, true, true, 300, Ease.strongOut);
        }, [list]);
        if (useItemClickSe) {
            list.on(UIList.ITEM_CLICK, this, function (list) {
                GameAudio.playSE(ClientWorld.data.sureSE);
            }, [list]);
        }
    };
    GUI_Manager.standardTab = function (tab) {
        stage.on(EventObject.KEY_DOWN, tab, GUI_Manager.onStandardTabKeyDown, [tab]);
        tab["__lastIdx"] = tab.selectedIndex;
        tab.on(EventObject.CHANGE, this, function (tab) {
            var lastIndex = tab["__lastIdx"];
            if (lastIndex >= 0) {
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
            tab["__lastIdx"] = tab.selectedIndex;
        }, [tab]);
    };
    GUI_Manager.regHitAreaFocusList = function (area, list, playSureSE, onFocus, thisPtr) {
        if (playSureSE === void 0) { playSureSE = true; }
        if (onFocus === void 0) { onFocus = null; }
        if (thisPtr === void 0) { thisPtr = null; }
        list.on(UIList.ITEM_CREATE, this, hitAreaFocusListCallback);
        function hitAreaFocusListCallback(ui, data, index) {
            ui.on(EventObject.MOUSE_DOWN, this, function (e) { e.stopPropagation(); });
        }
        area.on(EventObject.MOUSE_DOWN, GUI_Manager, function (list, playSureSE) {
            onFocus && onFocus.apply(thisPtr);
            GUI_Manager.focusList(list, playSureSE);
        }, [list, playSureSE]);
    };
    GUI_Manager.skillDesc = function (skill, actor) {
        var intro = skill.intro;
        var systemIntro = "";
        var reg = /\${.*?}/g;
        var m = intro.match(reg);
        if (m && m.length > 0) {
            var s = skill;
            var a = actor;
            for (var i in m) {
                var res = void 0;
                var varKeyInfo = m[i];
                var varKeyCode = varKeyInfo.substr(2, varKeyInfo.length - 3);
                try {
                    res = eval(varKeyCode);
                }
                catch (e) {
                    res = "[error]";
                }
                intro = intro.replace(varKeyInfo, res);
            }
        }
        var hasCost = false;
        if (skill.costHP > 0) {
            hasCost = true;
            systemIntro += "[" + WorldData.word_cost + skill.costHP + (WorldData.word_hp + "]");
        }
        if (skill.costSP > 0) {
            if (hasCost)
                systemIntro += " ";
            hasCost = true;
            systemIntro += "[" + WorldData.word_cost + skill.costSP + (WorldData.word_sp + "]");
        }
        if (hasCost) {
            systemIntro += "\n";
        }
        return systemIntro + intro;
    };
    GUI_Manager.equipDesc = function (equip) {
        var introArr = [];
        for (var i = 0; i < GUI_Manager.attributeNameMapping.length; i++) {
            var attribute = GUI_Manager.attributeNameMapping[i];
            var attributeName = GUI_Manager.getAttributeDisplayName(attribute);
            var value = equip[attribute];
            if (value) {
                var intro = "";
                if (value > 0) {
                    intro += "+";
                }
                intro += value + " " + attributeName;
                introArr.push(intro);
            }
        }
        introArr.push(equip.intro);
        var typeM = GameData.getModuleData(18, equip.type);
        var typeInfo = "";
        if (typeM && typeM.name) {
            typeInfo = "[" + typeM.name + "]\n";
        }
        return typeInfo + introArr.join("\n");
    };
    GUI_Manager.getEquipNameColor = function (equipID) {
        var sysEquip = GameData.getModuleData(9, equipID);
        if (sysEquip) {
            var m = ArrayUtils.matchAttributes(WorldData.equipQualitySetting, { equipQualityType: sysEquip.quality }, true)[0];
            if (m)
                return m.color;
        }
        return "#FFFFFF";
    };
    GUI_Manager.itemDesc = function (item) {
        return item.intro;
    };
    GUI_Manager.statusDesc = function (status) {
        var intro = status.intro;
        var soIndex = status.fromBattlerID;
        if (soIndex >= 0) {
            var allBattler = GameBattleHelper.allBattlers;
            var fromBattler = ArrayUtils.matchAttributes(allBattler, { inBattleID: status.fromBattlerID }, true)[0];
            if (fromBattler) {
                var s = status;
                var a = fromBattler.actor;
                var reg = /\${.*?}/g;
                var m = status.intro.match(reg);
                if (m && m.length > 0) {
                    for (var i in m) {
                        var varKeyInfo = m[i];
                        var varKeyCode = varKeyInfo.substr(2, varKeyInfo.length - 3);
                        var res = void 0;
                        try {
                            res = eval(varKeyCode);
                        }
                        catch (e) {
                            res = "[error]";
                        }
                        intro = intro.replace(varKeyInfo, res);
                    }
                }
            }
        }
        return intro;
    };
    GUI_Manager.onStandardTabKeyDown = function (tab, e) {
        if (!tab.stage || !tab.mouseEnabled) {
            return;
        }
        var keyCode = e.keyCode;
        var index = tab.selectedIndex;
        if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.L1)) {
            index--;
        }
        else if ((GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.R1))) {
            index++;
        }
        else {
            return;
        }
        index = Math.min(tab.length - 1, Math.max(index, 0));
        tab.selectedIndex = index;
    };
    GUI_Manager.focusList = function (list, playSureSE) {
        if (playSureSE === void 0) { playSureSE = true; }
        if (UIList.focus == list)
            return;
        UIList.focus = list;
        for (var i = 0; i < list.length; i++) {
            var itemBox = list.getItemUI(i);
            if (itemBox.mouseX >= 0 && itemBox.mouseX <= list.itemWidth && itemBox.mouseY >= 0 && itemBox.mouseY <= list.itemHeight) {
                list.selectedIndex = i;
                break;
            }
        }
        if (playSureSE)
            GameAudio.playSE(WorldData.sureSE);
    };
    GUI_Manager.attributeNameMapping = [
        "maxHP",
        "maxSP",
        "atk",
        "def",
        "mag",
        "magDef",
        "agi",
        "hit",
        "crit",
        "magCrit",
        "actionSpeed"
    ];
    return GUI_Manager;
}());
//# sourceMappingURL=GUI_Manager.js.map