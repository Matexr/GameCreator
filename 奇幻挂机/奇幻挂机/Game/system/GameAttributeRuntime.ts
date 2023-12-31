class WorldData {
    static readonly screenMode: number; // = 0; 移动端屏幕布局模式
    static readonly sceneBGMGradientTime: number; // = 0; BGM过渡时间
    static readonly sceneBGSGradientTime: number; // = 0; BGS过渡时间
    static readonly moveToGridCenter: boolean; // = false; 移动至格子中心点
    static readonly moveDir4: boolean; // = false; 四方向移动
    static readonly jumpTimeCost: number; // = 0; 跳跃花费的时间
    static readonly jumpHeight: number; // = 0; 跳跃高度
    static menuEnabled: boolean; // = true;
    static readonly sceneObjectCollisionSize: number; // = 32; 场景对象碰撞范围
    static readonly sceneObjectMoveStartAct: number; // = 2; 行走动作
    static readonly useSceneObjectMoveStartAct2: boolean; // = false; 开启奔跑动作
    static readonly sceneObjectMoveStartAct2Speed: number; // = 0; 奔跑时的速度
    static readonly sceneObjectMoveStartAct2: number; // = 0; 奔跑动作
    static readonly selectSceneObjectEffect: number; // = 0; 场景对象悬停动画
    static readonly saveFileMax: number; // = 10; 存档总数
    static playCtrlEnabled: boolean; // = true;
    static readonly uiCompFocusAnimation: number; // = 0; 界面组件焦点动画
    static readonly gridObsDebug: boolean; // = false; 显示地图格子障碍
    static readonly rectObsDebug: boolean; // = false; 显示对象碰撞盒
    static readonly dragSceneObjectDebug: boolean; // = false; 鼠标左键拖拽对象
    static readonly zoomCameraDebug: boolean; // = false; 滚轮缩放镜头
    static readonly focusEnabled: boolean; // = false; 使用按钮焦点
    static readonly hotKeyListEnabled: boolean; // = false; 允许按键操作列表
    static readonly sceneObjectMoveStartAct2FPS: number; // = 20; 奔跑时的帧率
    static readonly selectSE: string; // = ""; 光标
    static readonly sureSE: string; // = ""; 确定
    static readonly cancelSE: string; // = ""; 取消
    static readonly disalbeSE: string; // = ""; 禁用
    static readonly dialogSE: string; // = ""; 文本播放音效
    static dialogSEEnabled: boolean; // = true;
    static readonly equipSE: string; // = ""; 穿上装备
    static readonly unequipSE: string; // = ""; 卸下装备
    static readonly battleWin: string; // = ""; 战斗胜利
    static keyboards: DataStructure_gameKeyboard[]; // = [];
    static readonly menuDisabledAni: number; // = 1; 菜单禁用时动画效果
    static readonly iconDisabledAni: number; // = 1; 图标禁用时动画效果
    static useItemActID: number; // = 1; 使用道具的动作
    static defendActID: number; // = 1; 防御的动作
    static defendAni: number; // = 1; 防御的动画
    static allowAtkOwnUnit: boolean; // = false; 允许攻击己方单位
    static forceSendActionCommand: boolean; // = false; 强制派发行为指令
    static battleMoveToTime: number; // = 0.2; 近战进攻时移动的时间
    static battleMoveBackTime: number; // = 0.2; 近战回来时移动的时间
    static keepHurtAni: number; // = 1; 持续受伤动作时的动画
    static bulletSendOffset: number; // = 50; 子弹发射偏移量
    static bulletTargetOffset: number; // = -50; 子弹击中目标偏移量
    static equipQualitySetting: DataStructure_equipQualitySetting[]; // = [];
    static battleRewardStayTime: number; // = 1; 奖励界面停留时间
    static battlerActionOverTime: number; // = 0.1; 战斗者之间行动的间隔时间
    static battlerMultipleTimesAttackTime: number; // = 0.2; 战斗者连续攻击的间隔时间
    static battleOverStayTime: number; // = 1; 战斗结束停留时间
    static word_maxHP: string; // = ""; 最大生命值
    static word_maxSP: string; // = ""; 最大魔法值
    static word_atk: string; // = ""; 攻击力
    static word_def: string; // = ""; 防御
    static word_mag: string; // = ""; 魔力
    static word_magDef: string; // = ""; 魔法防御力
    static word_agi: string; // = ""; 敏捷
    static word_hit: string; // = ""; 命中
    static word_crit: string; // = ""; 暴击
    static word_magCrit: string; // = ""; 魔法暴击率
    static word_actionSpeed: string; // = ""; 速度
    static word_cost: string; // = ""; 消耗
    static word_hp: string; // = ""; 生命值
    static word_sp: string; // = ""; 魔法值
    static word_gamepadInput: string; // = ""; 请按下游戏手柄键位
    static word_keyboardInput: string; // = ""; 请输入键盘键位
    static word_useAtk: string; // = ""; 使用了攻击
    static word_useSkill: string; // = ""; 使用了技能
    static word_useItem: string; // = ""; 使用了道具
    static word_learnSkill: string; // = ""; 习得技能
}
class PlayerData {
    sceneObject: SceneObject;
    package: DataStructure_packageItem[]; // = [];
    gold: number; // = 0; 金币
    party: DataStructure_inPartyActor[]; // = [];
}