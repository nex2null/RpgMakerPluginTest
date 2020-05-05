// Initialize globals
var Workman = Workman || {};
Workman.CustomItems = Workman.CustomItems || {};

//
// Hook when the database has been loaded
//
var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {

  // If the database has not been loaded then do nothing
  if (!_DataManager_isDatabaseLoaded.call(this))
    return false;

  // Initialize if we have not yet initialized
  if (!Workman.CustomItems.initialized) {
    Workman.CustomItems.baseItemsLength = $dataItems.length;
    Workman.CustomItems.baseWeaponsLength = $dataWeapons.length;
    Workman.CustomItems.baseArmorsLength = $dataArmors.length;
    Workman.CustomItems.initialized = true;
  }

  // We know the database is already initialized so return true
  return true;
};

//
// Hook the creation of the game objects
//
var _DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {

  // Phone home
  _DataManager_createGameObjects.call(this);

  // Get rid of all our custom weapons
  $dataWeapons.splice(
    Workman.CustomItems.baseWeaponsLength,
    $dataWeapons.length - Workman.CustomItems.baseWeaponsLength);

  // Create a MEGA BOW
  $dataWeapons.push({
    animationId: 11,
    description: "The most powerful bow in existence",
    etypeId: 1,
    iconIndex: 102,
    id: $dataWeapons.length,
    meta: {},
    name: "Mega BOW",
    note: "",
    params: [0, 0, 20, 0, 0, 0, 10, 10],
    price: 1000,
    traits: [
      { code: 31, dataId: 1, value: 0 },
      { code: 22, dataId: 0, value: 0 }
    ],
    wtypeId: 7
  });

  // Make it where our awesome bat can drop the bow
  if (!Workman.CustomItems.modifiedLootTables) {
    $dataEnemies[1].dropItems.push({ kind: 2, dataId: $dataWeapons.length - 1, denominator: 1 });
    Workman.CustomItems.modifiedLootTables = true;
  }
};