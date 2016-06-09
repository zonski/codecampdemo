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
        game.load.spritesheet('cc_girl_ponytail_blonde_md', 'assets/spritesheets/characters/codecamp/girls/girl_ponytail_blonde_md.png', 72, 72);
        game.load.spritesheet('mummy', 'assets/spritesheets/characters/monsters/mummy_md.png', 72, 72);
        game.load.spritesheet('mushroom_1_c12', 'assets/spritesheets/characters/maple/mushroom_1_c12.png', 57, 56);
        game.load.spritesheet('anthro_item_key', 'assets/spritesheets/items/anthro/key.png', 20, 20);
        game.load.spritesheet('blob_1_c20', 'assets/spritesheets/characters/maple/blob_1_c20.png', 52, 64);

        // load tilesheets
        game.load.image('action-rpg', 'assets/tilesheets/action-rpg.png');
        game.load.image('desert', 'assets/tilesheets/desert.png');

        // load maps
        game.load.tilemap('level_1-map', 'js/scenes/level_1-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level_2-map', 'js/scenes/level_2-map.json', null, Phaser.Tilemap.TILED_JSON);
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
sceneIds['Level 1'] = 'level_1';
game.state.add('level_1', new level_1_scene());
sceneIds['Level 2'] = 'level_2';
game.state.add('level_2', new level_2_scene());

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

var math = {
    random: function(min, max) {
        if (typeof max === 'undefined') {
            return Math.floor(Math.random() * min) + 1;
        } else {
            return Math.floor(Math.random() * (max - min)) + min + 1;
        }
    }
};

var mouse = {
    isDown: function() {
        return game.input.activePointer.isDown;
    },

    getX: function() {
        return game.input.worldX;
    },

    getY: function() {
        return game.input.worldY;
    }
}

var global = {};

//-----------------------------------------------------------------------------

game.state.start('preloader');
