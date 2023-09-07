/**
 * 游戏UI管理器
 * Created by 黑暗之神KDS on 2020-03-17 02:20:53.
 */
class GUI_Manager {
    /**
     * 装备/状态属性面板映射
     */
    private static getAttributeDisplayName(attName: string) {
        return WorldData["word_" + attName];
    }
    /**
     * 装备/状态属性面板映射
     */
    private static attributeNameMapping = [
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
    //------------------------------------------------------------------------------------------------------
    // 标准化组件
    //------------------------------------------------------------------------------------------------------
    /**
     * 标准化列表LIST
     * -- 键位滚动至可见区域
     */
    static standardList(list: UIList, useItemClickSe: boolean = true): void {
        list.on(EventObject.CHANGE, this, (list: UIList, state: number) => {
            if (state == 0) list.scrollTo(list.selectedIndex, true, true, 300, Ease.strongOut);
        }, [list]);
        if (useItemClickSe) {
            list.on(UIList.ITEM_CLICK, this, (list: UIList) => {
                GameAudio.playSE(ClientWorld.data.sureSE);
            }, [list]);
        }
    }
    /**
     * 标准化标签栏
     * -- 快捷键
     * @param tab 
     */
    static standardTab(tab: UITabBox): void {
        stage.on(EventObject.KEY_DOWN, tab, GUI_Manager.onStandardTabKeyDown, [tab]);
        tab["__lastIdx"] = tab.selectedIndex;
        tab.on(EventObject.CHANGE, this, (tab: UITabBox) => {
            let lastIndex = tab["__lastIdx"];
            if (lastIndex >= 0) {
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
            tab["__lastIdx"] = tab.selectedIndex;
        }, [tab]);
    }
    /**
     * 注册鼠标点击区域后激活指定的列表
     * @param area 区域 
     * @param list 列表
     * @param playSureSE [可选] 默认值=true 是否播放确认音效
     * @param onFocus [可选] 默认值=null 当产生焦点时回调
     * @param thisPtr [可选] 默认值=null 当产生焦点时回调的作用域
     */
    static regHitAreaFocusList(area: UIBase, list: UIList, playSureSE: boolean = true, onFocus: Function = null, thisPtr: any = null): void {
        list.on(UIList.ITEM_CREATE, this, hitAreaFocusListCallback);
        function hitAreaFocusListCallback(ui: UIRoot, data: UIListItemData, index: number) {
            ui.on(EventObject.MOUSE_DOWN, this, (e: EventObject) => { e.stopPropagation(); })
        }
        area.on(EventObject.MOUSE_DOWN, GUI_Manager, (list: UIList, playSureSE: boolean) => {
            onFocus && onFocus.apply(thisPtr);
            GUI_Manager.focusList(list, playSureSE);
        }, [list, playSureSE]);
    }
    //------------------------------------------------------------------------------------------------------
    // 技能面板相关
    //------------------------------------------------------------------------------------------------------
    /**
     * 技能描述：支持技能的属性和角色的属性
     * @param skill 技能
     * @param actor 角色
     * @return [string] 
     */
    static skillDesc(skill: Module_Skill, actor: Module_Actor): string {
        let intro = skill.intro;
        let systemIntro = "";
        let reg = /\${.*?}/g;
        let m = intro.match(reg);
        if (m && m.length > 0) {
            let s = skill;
            let a = actor;
            for (let i in m) {
                let res: string;
                let varKeyInfo = m[i];
                let varKeyCode = varKeyInfo.substr(2, varKeyInfo.length - 3);
                try {
                    res = eval(varKeyCode) as string;
                }
                catch (e) {
                    res = "[error]";
                }
                intro = intro.replace(varKeyInfo, res);
            }
        }
        let hasCost = false;
        if (skill.costHP > 0) {
            hasCost = true;
            systemIntro += `[${WorldData.word_cost}` + skill.costHP + `${WorldData.word_hp}]`;
        }
        if (skill.costSP > 0) {
            if (hasCost) systemIntro += " ";
            hasCost = true;
            systemIntro += `[${WorldData.word_cost}` + skill.costSP + `${WorldData.word_sp}]`;
        }
        if (hasCost) {
            systemIntro += "\n";
        }
        return systemIntro + intro;
    }
    //------------------------------------------------------------------------------------------------------
    // 装备面板相关
    //------------------------------------------------------------------------------------------------------
    /**
     * 装备描述：支持技能的属性和角色的属性
     * @param equip 装备
     * @return [string] 
     */
    static equipDesc(equip: Module_Equip): string {
        let introArr = [];
        for (let i = 0; i < GUI_Manager.attributeNameMapping.length; i++) {
            let attribute = GUI_Manager.attributeNameMapping[i];
            let attributeName = GUI_Manager.getAttributeDisplayName(attribute);
            let value = equip[attribute];
            if (value) {
                let intro = "";
                if (value > 0) {
                    intro += "+";
                }
                intro += value + " " + attributeName;
                introArr.push(intro);
            }
        }
        introArr.push(equip.intro);
        let typeM: Module_equipType = GameData.getModuleData(18, equip.type);
        let typeInfo: string = "";
        if (typeM && typeM.name) {
            typeInfo = `[${typeM.name}]\n`;
        }
        return typeInfo + introArr.join("\n");
    }
    /**
     * 获取装备名称颜色
     * @param equipID 装备编号
     * @return [string] 颜色
     */
    static getEquipNameColor(equipID: number): string {
        let sysEquip: Module_Equip = GameData.getModuleData(9, equipID);
        if (sysEquip) {
            let m: DataStructure_equipQualitySetting = ArrayUtils.matchAttributes(WorldData.equipQualitySetting, { equipQualityType: sysEquip.quality }, true)[0];
            if (m) return m.color;
        }
        return "#FFFFFF";
    }
    //------------------------------------------------------------------------------------------------------
    // 道具面板相关
    //------------------------------------------------------------------------------------------------------
    /**
     * 道具说明
     * @param item 道具
     * @return [string] 
     */
    static itemDesc(item: Module_Item): string {
        return item.intro;
    }
    //------------------------------------------------------------------------------------------------------
    // 状态面板相关
    //------------------------------------------------------------------------------------------------------
    /**
     * 状态说明
     * @param status 状态 
     * @return [string] 
     */
    static statusDesc(status: Module_Status): string {
        let intro: string = status.intro;
        let soIndex = status.fromBattlerID;
        if (soIndex >= 0) {
            let allBattler = GameBattleHelper.allBattlers;
            let fromBattler: Battler = ArrayUtils.matchAttributes(allBattler, { inBattleID: status.fromBattlerID }, true)[0];
            if (fromBattler) {
                let s = status;
                let a = fromBattler.actor;
                let reg = /\${.*?}/g;
                let m = status.intro.match(reg);
                if (m && m.length > 0) {
                    for (let i in m) {
                        let varKeyInfo = m[i];
                        let varKeyCode = varKeyInfo.substr(2, varKeyInfo.length - 3);
                        let res: string;
                        try {
                            res = eval(varKeyCode) as string;
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
    }
    //------------------------------------------------------------------------------------------------------
    // 标准化标签栏-内部实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 按键更改标签索引
     */
    private static onStandardTabKeyDown(tab: UITabBox, e: EventObject): void {
        if (!tab.stage || !tab.mouseEnabled) {
            return;
        }
        let keyCode: number = e.keyCode
        let index = tab.selectedIndex;
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
    }
    /**
     * 激活List并选中
     * @param list 列表
     * @param playSureSE [可选] 默认值=true 是否播放确认音效
     */
    private static focusList(list: UIList, playSureSE: boolean = true): void {
        if (UIList.focus == list) return;
        UIList.focus = list;
        for (let i = 0; i < list.length; i++) {
            let itemBox = list.getItemUI(i);
            if (itemBox.mouseX >= 0 && itemBox.mouseX <= list.itemWidth && itemBox.mouseY >= 0 && itemBox.mouseY <= list.itemHeight) {
                list.selectedIndex = i;
                break;
            }
        }
        if (playSureSE) GameAudio.playSE(WorldData.sureSE);
    }
}