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
        game.load.spritesheet('cc_girl_puffyhair_red_md', 'assets/spritesheets/characters/codecamp/girls/girl_puffyhair_red_md.png', 72, 72);
        game.load.spritesheet('mummy', 'assets/spritesheets/characters/monsters/mummy_md.png', 72, 72);
        game.load.spritesheet('mushroom_1_c12', 'assets/spritesheets/characters/maple/mushroom_1_c12.png', 57, 56);
        game.load.spritesheet('anthro_item_key', 'assets/spritesheets/items/anthro/key.png', 20, 20);
        game.load.spritesheet('blob_1_c20', 'assets/spritesheets/characters/maple/blob_1_c20.png', 52, 64);
        game.load.spritesheet('dog_black_1_c20', 'assets/spritesheets/characters/maple/dog_black_1_c20.png', 59, 49);
        game.load.spritesheet('anthro_item_chicken_legs', 'assets/spritesheets/items/food/chicken_legs.png', 20, 20);
        game.load.spritesheet('anthro_item_light_orb', 'assets/spritesheets/items/anthro/light_orb.png', 20, 20);
        game.load.spritesheet('text_ready', 'assets/spritesheets/hud/kenney/text_ready.png', 230, 66);
        game.load.spritesheet('anthro_item_shadow_orb', 'assets/spritesheets/items/anthro/shadow_orb.png', 20, 20);

        // load tilesheets
        game.load.image('action-rpg', 'assets/tilesheets/action-rpg.png');
        game.load.image('desert', 'assets/tilesheets/desert.png');
        game.load.image('roguelike_city', 'assets/tilesheets/roguelike_city.png');

        // load maps
        game.load.tilemap('sc0-map', 'js/scenes/sc0-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level_1-map', 'js/scenes/level_1-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level_2-map', 'js/scenes/level_2-map.json', null, Phaser.Tilemap.TILED_JSON);
    },

    update: function() {
            game.state.start('sc0');
    }
};

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

window.onresize = function(event) {
};

game.state.add('preloader', preloader);

var sceneIds = {};
game.scenes = [];
sceneIds['Intro'] = 'sc0';
var scene = new sc0_scene();
game.scenes.push(scene);
game.state.add('sc0', scene);
sceneIds['Level 1'] = 'level_1';
var scene = new level_1_scene();
game.scenes.push(scene);
game.state.add('level_1', scene);
sceneIds['Level 2'] = 'level_2';
var scene = new level_2_scene();
game.scenes.push(scene);
game.state.add('level_2', scene);

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
