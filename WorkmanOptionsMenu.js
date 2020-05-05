//-----------------------------------------------------------------------------
// Add our options onto the menu screen
//

var _Window_MenuCommand_addOptionsCommand = Window_MenuCommand.prototype.addOptionsCommand;
Window_MenuCommand.prototype.addOptionsCommand = function () {
  _Window_MenuCommand_addOptionsCommand.call(this);
  this.addWorkmanOptionsCommand();
};

Window_MenuCommand.prototype.addWorkmanOptionsCommand = function () {
  this.addCommand('Workman', 'workman', true);
};

Scene_Menu.prototype.commandWorkmanOptions = function () {
  SceneManager.push(Scene_Workman_Options);
};

Scene_Menu.prototype.createCommandWindow = function () {
  this._commandWindow = new Window_MenuCommand(0, 0);
  this._commandWindow.setHandler('item', this.commandItem.bind(this));
  this._commandWindow.setHandler('skill', this.commandPersonal.bind(this));
  this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
  this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
  this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
  this._commandWindow.setHandler('options', this.commandOptions.bind(this));
  this._commandWindow.setHandler('workman', this.commandWorkmanOptions.bind(this));
  this._commandWindow.setHandler('save', this.commandSave.bind(this));
  this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
  this._commandWindow.setHandler('cancel', this.popScene.bind(this));
  this.addWindow(this._commandWindow);
};

//-----------------------------------------------------------------------------
// Scene_Workman_Options
//
// The scene class of the options screen.

function Scene_Workman_Options() {
  this.initialize.apply(this, arguments);
}

Scene_Workman_Options.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Workman_Options.prototype.constructor = Scene_Workman_Options;

Scene_Workman_Options.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Workman_Options.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);
  this.createOptionsWindow();
};

Scene_Workman_Options.prototype.terminate = function () {
  Scene_MenuBase.prototype.terminate.call(this);
  ConfigManager.save();
};

Scene_Workman_Options.prototype.createOptionsWindow = function () {
  this._optionsWindow = new Workman_Options();
  this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
  this.addWindow(this._optionsWindow);
};


//-----------------------------------------------------------------------------
// Workman_Options
//
// The window for changing various settings on the options screen.

function Workman_Options() {
  this.initialize.apply(this, arguments);
}

Workman_Options.prototype = Object.create(Window_Command.prototype);
Workman_Options.prototype.constructor = Workman_Options;

Workman_Options.prototype.initialize = function () {
  Window_Command.prototype.initialize.call(this, 0, 0);
  this.updatePlacement();
};

Workman_Options.prototype.windowWidth = function () {
  return 400;
};

Workman_Options.prototype.windowHeight = function () {
  return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
};

Workman_Options.prototype.updatePlacement = function () {
  this.x = (Graphics.boxWidth - this.width) / 2;
  this.y = (Graphics.boxHeight - this.height) / 2;
};

Workman_Options.prototype.makeCommandList = function () {
  this.addGeneralOptions();
  this.addVolumeOptions();
};

Workman_Options.prototype.addGeneralOptions = function () {
  this.addCommand(TextManager.alwaysDash, 'alwaysDash');
  this.addCommand(TextManager.commandRemember, 'commandRemember');
};

Workman_Options.prototype.addVolumeOptions = function () {
  this.addCommand(TextManager.bgmVolume, 'bgmVolume');
  this.addCommand(TextManager.bgsVolume, 'bgsVolume');
  this.addCommand(TextManager.meVolume, 'meVolume');
  this.addCommand(TextManager.seVolume, 'seVolume');
};

Workman_Options.prototype.drawItem = function (index) {
  var rect = this.itemRectForText(index);
  var statusWidth = this.statusWidth();
  var titleWidth = rect.width - statusWidth;
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
  this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
};

Workman_Options.prototype.statusWidth = function () {
  return 120;
};

Workman_Options.prototype.statusText = function (index) {
  var symbol = this.commandSymbol(index);
  var value = this.getConfigValue(symbol);
  if (this.isVolumeSymbol(symbol)) {
    return this.volumeStatusText(value);
  } else {
    return this.booleanStatusText(value);
  }
};

Workman_Options.prototype.isVolumeSymbol = function (symbol) {
  return symbol.contains('Volume');
};

Workman_Options.prototype.booleanStatusText = function (value) {
  return value ? 'ON' : 'OFF';
};

Workman_Options.prototype.volumeStatusText = function (value) {
  return value + '%';
};

Workman_Options.prototype.processOk = function () {
  var index = this.index();
  var symbol = this.commandSymbol(index);
  var value = this.getConfigValue(symbol);
  if (this.isVolumeSymbol(symbol)) {
    value += this.volumeOffset();
    if (value > 100) {
      value = 0;
    }
    value = value.clamp(0, 100);
    this.changeValue(symbol, value);
  } else {
    this.changeValue(symbol, !value);
  }
};

Workman_Options.prototype.cursorRight = function (wrap) {
  var index = this.index();
  var symbol = this.commandSymbol(index);
  var value = this.getConfigValue(symbol);
  if (this.isVolumeSymbol(symbol)) {
    value += this.volumeOffset();
    value = value.clamp(0, 100);
    this.changeValue(symbol, value);
  } else {
    this.changeValue(symbol, true);
  }
};

Workman_Options.prototype.cursorLeft = function (wrap) {
  var index = this.index();
  var symbol = this.commandSymbol(index);
  var value = this.getConfigValue(symbol);
  if (this.isVolumeSymbol(symbol)) {
    value -= this.volumeOffset();
    value = value.clamp(0, 100);
    this.changeValue(symbol, value);
  } else {
    this.changeValue(symbol, false);
  }
};

Workman_Options.prototype.volumeOffset = function () {
  return 20;
};

Workman_Options.prototype.changeValue = function (symbol, value) {
  var lastValue = this.getConfigValue(symbol);
  if (lastValue !== value) {
    this.setConfigValue(symbol, value);
    this.redrawItem(this.findSymbol(symbol));
    SoundManager.playCursor();
  }
};

Workman_Options.prototype.getConfigValue = function (symbol) {
  return ConfigManager[symbol];
};

Workman_Options.prototype.setConfigValue = function (symbol, volume) {
  ConfigManager[symbol] = volume;
};
