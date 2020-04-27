var roleHarvester = {

  run: function(creep) {
    if(creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        creep.say('harvest');
      }
    }
    else {
      creep.say('transfer');
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  }
};

var roleBuilder = {

  run: function(creep) {

    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say('harvest');
    }
    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say('build');
    }

    if(creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
};

var roleUpgrader = {

  run: function(creep) {

    if(creep.memory.controlling && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say('harvest');
    }
    if(!creep.memory.controlling && creep.store.getFreeCapacity() == 0) {
      creep.memory.controlling = true;
      creep.say('upgrade');
    }

    // if the creep's energy storage is empty
    if(creep.memory.controlling) {

      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }

    // if storage is not empty
    else {

      // find energy sources
      var sources = creep.room.find(FIND_SOURCES);

      // move closer if energy source is out of range
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }

    }
  }
};

function creepCheck() {
  var roleList = [];
  for (name in Game.creeps) {
    roleList.push(Game.creeps[name].memory.role);
  }

  for (var name in Game.spawns) {
    if (Game.spawns[name].store[RESOURCE_ENERGY] >= 300) {

      Game.spawns[name].spawnCreep([WORK, WORK, CARRY, MOVE], 'upgrader'.concat(Game.time.toString()), { memory: { role: 'upgrader' } } );
    }
  }

}

export const loop = function() {

  creepCheck();

  for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    if(creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
  }
};
