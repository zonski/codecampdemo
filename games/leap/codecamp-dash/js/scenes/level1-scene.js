function level1_scene() {

    this.actors = [];

    this.type = 'level1';

    this.width = 50 * 32;
    this.height = 15 * 32;

    this.map;
    this.layers;

    this.preload = function() {

        this.map = game.add.tilemap('level1-map');
        this.layers = [];
        var layer;

        this.map.addTilesetImage('ice');
        layer = this.map.createLayer('ice-layer');
        this.layers.push(layer);
        this.map.setCollisionByExclusion([],
            true, layer);

        this.map.addTilesetImage('plains');
        layer = this.map.createLayer('plains-layer');
        this.layers.push(layer);
        this.map.setCollisionByExclusion([129,124,131],
            true, layer);


        this.actors.push(new player_actor({
            initialX: 68,
            initialY: 372
        }));
        this.actors.push(new zombie_actor({
            initialX: 600,
            initialY: 380
        }));
        this.actors.push(new zombie_actor({
            initialX: 900,
            initialY: 380
        }));
        this.actors.push(new frankie_actor({
            initialX: 1400,
            initialY: 380
        }));
        this.actors.push(new butterfly_actor({
            initialX: 654,
            initialY: 149
        }));
        this.actors.push(new butterfly_actor({
            initialX: 931,
            initialY: 147
        }));
        this.actors.push(new butterfly_actor({
            initialX: 1212,
            initialY: 143
        }));
        this.actors.push(new butterfly_actor({
            initialX: 370,
            initialY: 144
        }));
        this.actors.push(new zombie_actor({
            initialX: 1264,
            initialY: 371
        }));
        this.actors.push(new zombie_actor({
            initialX: 124,
            initialY: 88
        }));

        if (this.onLoad) {
            this.onLoad();
        }
    };

    this.create = function() {
        game.world.setBounds(0, 0, this.width, this.height);
        game.stage.backgroundColor = '#DBE1EF';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 1000;

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

        if (this.onKeyDownForScene) {
            this.onKeyDownForScene(key);
        }
    };






    //--------------------------------------------------------------------------------------------------
    // API

    this.createActor = function(type, x, y) {
        var actorMethod = window[type + '_actor'];
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

}
