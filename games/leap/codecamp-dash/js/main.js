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
        game.load.spritesheet('zombie', 'assets/spritesheets/characters/monsters/zombie_md.png', 72, 72);
        game.load.spritesheet('glitch_butterfly', 'assets/spritesheets/characters/glitch/butterfly.png', 70, 65);
        game.load.spritesheet('cc_item_books_blue-01', 'assets/spritesheets/items/codecamp/books_blue-01.png', 30, 30);
        game.load.spritesheet('frankie', 'assets/spritesheets/characters/monsters/frankie_md.png', 72, 72);

        // load tilesheets
        game.load.image('plains', 'assets/tilesheets/plains.png');
        game.load.image('ice', 'assets/tilesheets/ice.png');

        // load maps
        game.load.tilemap('level1-map', 'js/scenes/level1-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2-map', 'js/scenes/level2-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('intro-map', 'js/scenes/intro-map.json', null, Phaser.Tilemap.TILED_JSON);
    },

    update: function() {
        game.state.start('intro');
    }
};

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

window.onresize = function(event) {
};

game.state.add('preloader', preloader);

var sceneIds = {};
sceneIds['Level 1'] = 'level1';
game.state.add('level1', new level1_scene());
sceneIds['Level 2'] = 'level2';
game.state.add('level2', new level2_scene());
sceneIds['Intro'] = 'intro';
game.state.add('intro', new intro_scene());

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
