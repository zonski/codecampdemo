function level_2_scene() {

    this.game = game;

    this.actors = [];

    this.type = 'level_2';

    this.width = 50 * 32;
    this.height = 30 * 32;

    this.map;
    this.layers;

    this.preload = function() {

        this.map = game.add.tilemap('level_2-map');
        this.layers = [];
        var layer;

        this.map.addTilesetImage('roguelike_city');
        layer = this.map.createLayer('roguelike_city-layer');
        this.layers.push(layer);
        this.map.setCollisionByExclusion([],
            true, layer);

        this.map.addTilesetImage('action-rpg');
        layer = this.map.createLayer('action-rpg-layer');
        this.layers.push(layer);
        this.map.setCollisionByExclusion([1051,1052,1060,1064,1065,1066,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1109,1110,1111,1117,1118,1119,1125,1126,1127,1133,1134,1135,1141,1142,1143,1149,1150,1151,1152,1153,1154,1155],
            true, layer);


        this.actors.push(new player_actor({
            initialX: 135,
            initialY: 73
        }));
        this.actors.push(new baddie_actor({
            initialX: 155,
            initialY: 446
        }));
        this.actors.push(new baddie_actor({
            initialX: 950,
            initialY: 264
        }));
        this.actors.push(new baddie_actor({
            initialX: 524,
            initialY: 710
        }));

        if (this.onLoad) {
            this.onLoad();
        }
    };

    this.create = function() {
        game.world.setBounds(0, 0, this.width, this.height);
        game.stage.backgroundColor = '#ffff88';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.actorGroup = game.add.group();

        var i;
        var actor;

        for (i = 0; i < this.actors.length; i++) {
            actor = this.actors[i];
            actor.init(this);
        }

        for (i = 0; i < this.actors.length; i++) {
            actor = this.actors[i];
            if (actor.onCreate) {
                actor.onCreate();
            }
        }

        if (this.onCreate) {
            this.onCreate();
        }

        keys.up.onDown.add(function() {
            this.onKeyDown('up');
        }, this);
        keys.down.onDown.add(function() {
            this.onKeyDown('down');
        }, this);
        keys.left.onDown.add(function() {
            this.onKeyDown('left');
        }, this);
        keys.right.onDown.add(function() {
            this.onKeyDown('right');
        }, this);
        keys.spacebar.onDown.add(function() {
            this.onKeyDown('spacebar');
        }, this);

    };

    this.update = function () {

        if (this.onUpdate) {
            this.onUpdate();
        }

        for (var i = 0; i < this.layers.length; i++) {
            game.physics.arcade.collide(this.actorGroup, this.layers[i],
            
                function(actorSprite, tile) {
                    if (actorSprite.actor.onCollisionWithTile) {
                        actorSprite.actor.onCollisionWithTile(tile);
                    }
                    return true;
                },
            
                function(actorSprite, tile) {
                    return true;
                }
            );
        }

        game.physics.arcade.overlap(this.actorGroup, this.actorGroup, function(source, target) {
            if (source.actor.onCollisionWithActor) {
                source.actor.onCollisionWithActor({ collidedWith: target.actor });
            }
        }, null, this);


        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            if (actor.alive) {
                if (actor.update) {
                    actor.update();
                }
            }
        }

        // prune dead actors
        var i = this.actors.length;
        while (i--) {
            var actor = this.actors[i];
            if (!actor.alive) {
                this.actors.splice(i, 1);
            }
        }
    };

    this.shutdown = function() {
        for (var i = 0; i < this.actors.length; i++) {
            this.actors[i].sprite.destroy();
        }
        this.actors.length = 0;
        this.actorGroup.removeAll();

        this.layers.length = 0;
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].sprite.destroy();
        }
        this.layers.length = 0;
    };

    this.onKeyDown = function(key) {
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            if (actor.onKeyDown && actor.alive) {
                actor.onKeyDown(key);
            }
        }

    };









    //--------------------------------------------------------------------------------------------------
    // API

    this.createActor = function(name, x, y) {
        var actorMethod = window[getActorType(name)];
        var actor = new actorMethod({
            initialX: x,
            initialY: y
        });
        this.actors.push(actor);
        actor.init(this);
        if (actor.onCreate) {
            actor.onCreate();
        }
        return actor;
    };

    this.addText = function(x, y, text, style) {
        return game.add.text(x, y, text, style);
    };

    this.addTextToScreen = function(x, y, text, style) {
        var text = game.add.text(x, y, text, style);
        text.fixedToCamera = true;
        return text;
    };

    this.getScreenWidth = function() {
        return game.camera.width;
    };

    this.getScreenHeight = function() {
        return game.camera.height;
    };

    this.findActor = function(name) {
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            if (actor.alive && actor.name === name) {
                return actor;
            }
        }
        return null;
    };

    this.isKeyDown = function(key) {
        return keys[key].isDown;
    };

    this.isMouseDown = function() {
        return game.input.activePointer.isDown;
    };

    this.getMouseX = function() {
        return game.input.worldX;
    };

    this.getMouseY = function() {
        return game.input.worldY;
    };

    this.startTimer = function(time, callback) {
        game.time.events.add(Phaser.Timer.SECOND * time, callback, this);
    };
}
