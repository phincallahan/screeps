var roleSettler = {
    run: function(creep) {
        var reserve = creep.reserveController(creep.room.controller);
        if (creep.reserveController(creep.room.controller) == -9) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

var roleHarvester = {

  run: function(creep) {

    if(creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.transferring = false;
      creep.say('harvest');
    }
    if(!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
      creep.memory.transferring = true;
      creep.say('transfer');
    }

    if(creep.memory.transferring) {
      creep.say('transfer');
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
    else {

      // find energy sources
      var sources = creep.room.find(FIND_SOURCES);

      // move closer if energy source is out of range
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
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
          creep.moveTo(targets[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
        }
      } else {
         creep.suicide();
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {

        creep.moveTo(sources[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
};

var roleRepairman = {

  run: function(creep) {

    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.repairing = false;
      creep.say('harvest');
    }
    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
      creep.memory.repairing = true;
      creep.say('repair');
    }

    if(creep.memory.repairing) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return ((object.structureType == STRUCTURE_ROAD || object.structureType == STRUCTURE_CONTAINER) && object.hits < object.hitsMax);
            }
        });

        targets.sort((a,b) => a.hits - b.hits);

        if(targets.length > 0) {
            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
         creep.suicide();
        }
    }

    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {

        creep.moveTo(sources[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
};

var roleUpgrader = {

  run: function(creep) {

    if(creep.memory.controlling && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.controlling = false;
      creep.say('harvest');
    }
    if(!creep.memory.controlling && creep.store.getFreeCapacity() == 0) {
      creep.memory.controlling = true;
      creep.say('upgrade');
    }

    // if the creep's energy storage is empty
    if(creep.memory.controlling) {

      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }

    // if storage is not empty
    else {

      // find energy sources
      var sources = creep.room.find(FIND_SOURCES);
      const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
        filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                   i.store[RESOURCE_ENERGY] > 0
        });

      // move closer if energy source is out of range
      if (containersWithEnergy.length) {
          if (creep.withdraw(containersWithEnergy[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(containersWithEnergy[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
          }
      }

      else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
};

// function for getting the total energy availables
function getTotalEnergy(spawn) {
  var totalEnergy = 0;

  var spawnEnergy = spawn.store[RESOURCE_ENERGY];
  totalEnergy += spawnEnergy;

  const extensions = spawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION)
    }
  });
  for (var extension in extensions) {
    var extensionEnergy = extension.store[RESOURCE_ENERGY];
    totalEnergy += extensionEnergy;
  }
};

// function for creating a new creep
function newCreep(creepRole, availableEnergy) {
  var numWork = 5;
  var numCarry = 5;
  var numMove = 5;
  var totalEnergy = 100*numWork + 50*(numCarry + numMove);
  console.log(totalEnergy);

  // var bodyPartList = ['WORK' * numWork, 'CARRY' * numCarry, 'MOVE' & numMove];
  // while (totalEnergy > availableEnergy) {
  //   if (currPart == )
  // }
  //
  // Game.spawns[name].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  //                             'creepRole'.concat(Game.time.toString()),
  //                             {memory: {role: creepRole}});
};

function creepCheck() {
  var roleList = [];
  var upgraders = [];
  var builders = [];
  var harvesters = [];
  var repairmen = [];
  for (name in Game.creeps) {
      if(Game.creeps[name].memory.role == 'upgrader') {
          upgraders.push(Game.creeps[name].ticksToLive);
      }
      else if(Game.creeps[name].memory.role == 'builder') {
          builders.push(Game.creeps[name].ticksToLive);
      }
      else if(Game.creeps[name].memory.role == 'harvester') {
          harvesters.push(Game.creeps[name].ticksToLive);
      }
      else if(Game.creeps[name].memory.role == 'repairman') {
          repairmen.push(Game.creeps[name].ticksToLive);
      }
    roleList.push(Game.creeps[name].memory.role);
  }

  console.log('----------------------');
  console.log('NumHarvesters: ' + harvesters.length + ' – ' + harvesters);
  console.log('NumBuilders: ' + builders.length + ' – ' + builders);
  console.log('NumUpgraders: ' + upgraders.length + ' – ' + upgraders);
  console.log('NumRepairmen: ' + repairmen.length + ' – ' + repairmen);

  // code for generating new creeps
  for (var name in Game.spawns) {
    console.log(getTotalEnergy(Game.spawns[name]));

    if (Game.spawns[name].store[RESOURCE_ENERGY] >= 300) {
        var targets = Game.spawns[name].room.find(FIND_CONSTRUCTION_SITES);

        if (harvesters.length < 2 || (harvesters.length == 2 && Math.min(...harvesters) < 100)) {
            Game.spawns[name].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'harvester'.concat(Game.time.toString()), { memory: { role: 'harvester' } } );
        }

        else if (upgraders.length < 5 || (upgraders.length == 5 && Math.min(...upgraders) < 100)) {
            Game.spawns[name].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'upgrader'.concat(Game.time.toString()), { memory: { role: 'upgrader' } } );
        }

        else if (repairmen.length < 1 || (repairmen.length == 1 && Math.min(...repairmen) < 100)) {
            Game.spawns[name].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'repairman'.concat(Game.time.toString()), { memory: { role: 'repairman' } } );
        }

        else if (targets.length && (builders.length < 3 || (builders.length == 3 && Math.min(...builders) < 100))) {
            Game.spawns[name].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'builder'.concat(Game.time.toString()), { memory: { role: 'builder' } } );
        }
    }
  }

};

const loop = function() {

  creepCheck();
  newCreep();

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
    if(creep.memory.role == 'settler') {
      roleSettler.run(creep);
    }
    if(creep.memory.role == 'repair') {
      roleRepair.run(creep);
    }
  }
};
