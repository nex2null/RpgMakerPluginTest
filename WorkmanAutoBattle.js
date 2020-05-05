(function () {

  var fastBattleText = true;
  var skipEffects = false;
  var fastMove = true;


  //
  // Always force auto battling
  //
  Game_BattlerBase.prototype.isAutoBattle = function () {
    return true;
  }

  //
  // Fast-forward battle log text
  //
  var _Window_BattleLog_updateWaitCount = Window_BattleLog.prototype.updateWaitCount;
  Window_BattleLog.prototype.updateWaitCount = function () {
    if (fastBattleText && this._waitCount > 0) {
      this._waitCount = 1;
    }
    return _Window_BattleLog_updateWaitCount.call(this);
  };

  //
  // Move sprites quickly in battle
  //
  var _Sprite_Battler_updateMove = Sprite_Battler.prototype.updateMove;
  Sprite_Battler.prototype.updateMove = function () {
    if (fastMove && this._movementDuration > 0) {
      this._movementDuration = 1;
    }
    return _Sprite_Battler_updateMove.call(this);
  };

  //
  // Skip battle effects
  //
  var _Spriteset_Battle_isBusy = Spriteset_Battle.prototype.isBusy;
  Spriteset_Battle.prototype.isBusy = function () {
    return skipEffects ? false : _Spriteset_Battle_isBusy.call(this);
  };

  //
  // Override the selection of auto-battle actions
  //
  Game_Actor.prototype.makeAutoBattleActions = function () {

    // Choose an action for each action that is to be taken
    for (var i = 0; i < this.numActions(); i++) {

      // Build up the list of actions
      var list = this.makeActionList();

      // Choose a random action
      var action = list[Math.floor(Math.random() * list.length)];

      // Choose a random target
      var targetCandidates = action.itemTargetCandidates();
      var randomTarget = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
      action.setTarget(randomTarget.index());

      // Set the action
      this.setAction(i, action);
    }

    this.setActionState('waiting');
  };

  //
  // Override the available list of auto-battle actions
  //
  Game_Actor.prototype.makeActionList = function () {

    debugger;

    var list = [];

    var action = new Game_Action(this);
    action.setAttack();
    list.push(action);

    var action = new Game_Action(this);
    action.setGuard();
    list.push(action);

    this.usableSkills().forEach(function (skill) {
      action = new Game_Action(this);
      action.setSkill(skill.id);
      list.push(action);
    }, this);
    return list;
  };

})();