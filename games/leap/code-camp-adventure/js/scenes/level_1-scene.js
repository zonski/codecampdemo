function level_1_scene() {

    this.game = game;

    this.actors = [];

    this.type = 'level_1';

    this.width = 49 * 32;
    this.height = 30 * 32;

    this.map;
    this.layers;

    this.preload = function() {

        this.map = game.add.tilemap('level_1-map');
        this.layers = [];
        var layer;

        this.map.addTilesetImage('action-rpg');
        layer = this.map.createLayer('action-rpg-layer');
        this.layers.push(layer);
        this.map.setCollisionByExclusion([15,16,24,28,29,30,32,33,34,35,36,37,38,39,40,41,42,73,74,75,81,82,83,89,90,91,97,98,99,105,106,107,113,114,115,116,117,118,119],
            true, layer);


        this.actors.push(new player_actor({
            initialX: 195,
            initialY: 148
        }));
        this.actors.push(new baddie_actor({
            initialX: 70,
            initialY: 430
        }));
        this.actors.push(new baddie_actor({
            initialX: 198,
            initialY: 846
        }));
        this.actors.push(new baddie_actor({
            initialX: 810,
            initialY: 351
        }));
        this.actors.push(new baddie_actor({
            initialX: 481,
            initialY: 194
        }));
        this.actors.push(new baddie_actor({
            initialX: 1347,
            initialY: 797
        }));
        this.actors.push(new gatekeeper_actor({
            initialX: 1171,
            initialY: 207
        }));
        this.actors.push(new key_actor({
            initialX: 678,
            initialY: 808
        }));
        this.actors.push(new baddie_actor({
            initialX: 792,
            initialY: 662
        }));
        this.actors.push(new baddie_actor({
            initialX: 959,
            initialY: 714
        }));
        this.actors.push(new helper_actor({
            initialX: 1391,
            initialY: 471
        }));
        this.actors.push(new ac3_actor({
            initialX: 1469,
            initialY: 513
        }));
        this.actors.push(new ac0_actor({
            initialX: 251,
            initialY: 692
        }));
        this.actors.push(new baddie_actor({
            initialX: 815,
            initialY: 854
        }));
        this.actors.push(new baddie_actor({
            initialX: 1175,
            initialY: 636
        }));
        this.actors.push(new baddie_actor({
            initialX: 495,
            initialY: 663
        }));
        this.actors.push(new baddie_actor({
            initialX: 570,
            initialY: 855
        }));
        this.actors.push(new ac5_actor({
            initialX: 670,
            initialY: 218
        }));
        this.actors.push(new ac6_actor({
            initialX: 968,
            initialY: 538
        }));

        if (this.onLoad) {
            this.onLoad();
        }
    };

    this.create = function() {
        game.world.setBounds(0, 0, this.width, this.height);
        game.stage.backgroundColor = '#8db161';
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
