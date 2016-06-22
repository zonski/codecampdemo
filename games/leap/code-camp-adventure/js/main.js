var keys = {}

function ostr(o) {
    var cache = [];
    return JSON.stringify(o, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null;
}

var preloader = {

    preload: function() {
        keys.up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keys.down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        keys.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keys.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keys.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.input.enabled = true;
        game.input.mouse.capture = true;

        // load spritesheets
        game.load.spritesheet('assassin', 'assets/spritesheets/characters/game2dart/assassin.png', 72, 72);
        game.load.spritesheet('boar', 'assets/spritesheets/characters/game2dart/boar.png', 84, 72);
        game.load.spritesheet('mushroom_1_c12', 'assets/spritesheets/characters/maple/mushroom_1_c12.png', 57, 56);
        game.load.spritesheet('anthro_item_key', 'assets/spritesheets/items/anthro/key.png', 20, 20);
        game.load.spritesheet('blob_1_c20', 'assets/spritesheets/characters/maple/blob_1_c20.png', 52, 64);
        game.load.spritesheet('dog_black_1_c20', 'assets/spritesheets/characters/maple/dog_black_1_c20.png', 59, 49);
        game.load.spritesheet('anthro_item_chicken_legs', 'assets/spritesheets/items/food/chicken_legs.png', 20, 20);
        game.load.spritesheet('anthro_item_light_orb', 'assets/spritesheets/items/anthro/light_orb.png', 20, 20);
        game.load.spritesheet('text_ready', 'assets/spritesheets/hud/kenney/text_ready.png', 230, 66);
        game.load.spritesheet('anthro_item_shadow_orb', 'assets/spritesheets/items/anthro/shadow_orb.png', 20, 20);

        // load tilesheets
        game.load.image('gr-mountains', 'assets/tilesheets/graphic-river/mountains/mountains.png');
        game.load.image('action-rpg', 'assets/tilesheets/action-rpg.png');
        game.load.image('gr-rpg-island', 'assets/tilesheets/graphic-river/rpg-island/rpg-island.png');
        game.load.image('gr-td-jungle', 'assets/tilesheets/graphic-river/tower-defence/td-jungle.png');
        game.load.image('gr-td-urban-desert', 'assets/tilesheets/graphic-river/tower-defence/td-urban-desert.png');
        game.load.image('grass', 'assets/tilesheets/greenland/grass.png');
        game.load.image('path', 'assets/tilesheets/greenland/path.png');

        // load maps
        game.load.tilemap('level_1-map', 'js/scenes/level_1-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('sc1-map', 'js/scenes/sc1-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('sc2-map', 'js/scenes/sc2-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('sc3-map', 'js/scenes/sc3-map.json', null, Phaser.Tilemap.TILED_JSON);
    },

    update: function() {
            game.state.start('level_1');
    }
};

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

window.onresize = function(event) {
};

game.state.add('preloader', preloader);

var sceneIds = {};
game.scenes = [];
sceneIds['Level 1'] = 'level_1';
var scene = new level_1_scene();
game.scenes.push(scene);
game.state.add('level_1', scene);
sceneIds['Level 2'] = 'sc1';
var scene = new sc1_scene();
game.scenes.push(scene);
game.state.add('sc1', scene);
sceneIds['Level 3'] = 'sc2';
var scene = new sc2_scene();
game.scenes.push(scene);
game.state.add('sc2', scene);
sceneIds['Level 4'] = 'sc3';
var scene = new sc3_scene();
game.scenes.push(scene);
game.state.add('sc3', scene);

//-----------------------------------------------------------------------------

game.switchScene = function(sceneName) {
    game.state.start(sceneIds[sceneName]);
};

game.restartScene = function() {
    game.state.restart();
};

game.getCurrentTimeInSeconds = function() {
    return game.time.totalElapsedSeconds();
}

game.globals = {};

game.randomNumber = function(min, max) {
    if (typeof max === 'undefined') {
        return Math.floor(Math.random() * min) + 1;
    } else {
        return Math.floor(Math.random() * (max - min)) + min + 1;
    }
};

game.randomChoice = function(items) {
    return items[Math.floor(Math.random() * items.length)];
};

game.listenToKey = function(key) {
    keys[key] = game.input.keyboard.addKey(Phaser.Keyboard[key.toUpperCase()]);
}

function getActorType(name) {
    if (name == 'Player') {
        return 'player_actor';
    }
    if (name == 'Baddie') {
        return 'baddie_actor';
    }
    if (name == 'Gatekeeper') {
        return 'gatekeeper_actor';
    }
    if (name == 'Key') {
        return 'key_actor';
    }
    if (name == 'Helper') {
        return 'helper_actor';
    }
    if (name == 'Pet') {
        return 'ac5_actor';
    }
    if (name == 'Pet Food') {
        return 'ac6_actor';
    }
    if (name == 'Magic Ball') {
        return 'ac0_actor';
    }
    if (name == 'Intro Text') {
        return 'ac2_actor';
    }
    if (name == 'Potion of Sneakiness') {
        return 'ac3_actor';
    }
    return null;
}


//-----------------------------------------------------------------------------

game.state.start('preloader');
