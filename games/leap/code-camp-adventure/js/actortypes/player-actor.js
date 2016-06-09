
function player_actor(settings) {

    this.type = 'player';
    this.name = 'Player';
    this.spritesheetId = 'cc_girl_ponytail_blonde_md';

    this.settings = settings;
    this.alive = true;

    this.texts = [];

    this.init = function(scene) {

        this.scene = scene;

        this.sprite = this.scene.actorGroup.create(settings.initialX, settings.initialY, this.spritesheetId);
        game.physics.enable(this.sprite);

        var _this = this;

        this.sprite.actor = this;
        this.sprite.anchor.setTo(0.5);

        this.addAnimation('Walk Right',
            [0,1,2,3,4,5,6,7]
            
        );
        this.addAnimation('Walk Left',
            [8,9,10,11,12,13,14,15]
            
        );
        this.addAnimation('Walk Down',
            [16,17,18,19,20,21,22,23]
            
        );
        this.addAnimation('Walk Up',
            [24,25,26,27,28,29,30,31]
            
        );
    };

    //------------------------------------------------------------------------------------------------------------------


    this.animationsMeta = {};
    this.addAnimation = function(name, frames, scaleX, scaleY) {
        this.sprite.animations.add(name, frames, 10);
        this.animationsMeta[name] = {
            scaleX: scaleX ? scaleX : 1,
            scaleY: scaleY ? scaleY : 1
        };
    };

    this.update = function() {
        if (this.alive && this.onUpdate) {
            this.onUpdate();
        }

        for (var i = 0; i < this.texts.length; i++) {
            this._positionText(this.texts[i])
        }
    };

    this._positionText = function(text) {
        text.anchor.setTo(0.5);
        text.x = Math.floor(this.sprite.x + this.sprite.width / 2);
        text.y = this.sprite.y - text.height - 5;
    };


    //------------------------------------------------------------------------------------------------------------------
    // Create

    this.onCreate = function(event) {
        this.onCreate_0(event);
    };

    // Camera Follow
    this.onCreate_0 = function(event) {
        this.makeCameraFollow();
this.keepInWorld(true);
    };


    //------------------------------------------------------------------------------------------------------------------
    // Update

    this.onUpdate = function(event) {
        this.onUpdate_0(event);
    };

    // Move
    this.onUpdate_0 = function(event) {
         if (keys.right.isDown) {
    this.setXSpeed(250);
    this.playAnimation('Walk Right');
} else if (keys.left.isDown) {
    this.setXSpeed(-250);
    this.playAnimation('Walk Left');
} else if (keys.up.isDown) {
    this.setYSpeed(-250);
    this.playAnimation('Walk Up');
} else if (keys.down.isDown) {
    this.setYSpeed(250);
    this.playAnimation('Walk Down');
} else {
    this.stop();
}

    };



    //------------------------------------------------------------------------------------------------------------------
    // Actor Collisions

    this.onCollisionWithActor = function(event) {
        if (event.collidedWith.type == 'key') {
            this.onCollisionWithActor_0(event.collidedWith);
        }
        if (event.collidedWith.type == 'gatekeeper') {
            this.onCollisionWithActor_1(event.collidedWith);
        }
        if (event.collidedWith.type == 'baddie') {
            this.onCollisionWithActor_2(event.collidedWith);
        }
    }

    // Collect Key
    this.onCollisionWithActor_0 = function(collidedWith) {
        this.hasKey = true;
collidedWith.kill();
    };

    // Meet Gatekeeper
    this.onCollisionWithActor_1 = function(collidedWith) {
        if (this.hasKey) {
    game.switchScene('Level 2');
} 
    };

    // Hit by baddie
    this.onCollisionWithActor_2 = function(collidedWith) {
        game.restartScene();
    };









    //------------------------------------------------------------------------------------------------------------------
    // API

    this.kill = function() {
        this.alive = false;
        this.sprite.kill();
    };

    this.makeCameraFollow = function() {
        game.camera.follow(this.sprite);
    };

    this.getXPosition = function() {
        return this.sprite.x;
    };

    this.getYPosition = function() {
        return this.sprite.y;
    };

    this.setXSpeed = function(xspeed) {
        this.sprite.body.velocity.x = xspeed;
    };

    this.getXSpeed = function() {
        return this.sprite.body.velocity.x;
    };

    this.reverseXSpeed = function() {
        this.sprite.body.velocity.x = -this.sprite.body.velocity.x;
    };

    this.setYSpeed = function(yspeed) {
        this.sprite.body.velocity.y = yspeed;
    };

    this.getYSpeed = function() {
        return this.sprite.body.velocity.y;
    };

    this.reverseYSpeed = function() {
        this.sprite.body.velocity.y = -this.sprite.body.velocity.y;
    };

    this.isBlockedLeft = function() {
        return this.sprite.body.blocked.left;
    };

    this.isBlockedRight = function() {
        return this.sprite.body.blocked.right;
    };

    this.isBlockedUp = function() {
        return this.sprite.body.blocked.up;
    };

    this.isBlockedDown = function() {
        return this.sprite.body.blocked.down;
    };

    this.isOnGround = function() {
        return this.sprite.body.onFloor();
    };

    this.playAnimation = function(animationName, loop) {
        this.sprite.animations.play(animationName, null, loop);
        var meta = this.animationsMeta[animationName];
        if (meta) {
            this.sprite.scale.setTo(meta.scaleX, meta.scaleY);
        } else {
            this.sprite.scale.setTo(1, 1);
        }
    };

    this.stop = function() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.animations.stop(null, true);
    };

    this.setCanRotate = function(rotate) {
        this.sprite.body.fixedRotation = !rotate;
    };

    this.setAffectedByGravity = function(affected) {
        this.sprite.body.allowGravity = affected;
    };

    this.keepInWorld = function(keep) {
        this.sprite.body.collideWorldBounds = keep;
    };

    this.moveTowardsActor = function(actor, speed) {
        game.physics.arcade.moveToObject(this.sprite, actor.sprite, speed);
    };

    this.near = function(actor, radius) {
        var x1 = this.getXPosition();
        var y1 = this.getYPosition();
        var x2 = actor.getXPosition();
        var y2 = actor.getYPosition();
        var d = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
        return d < radius;
    };

    this.leftOf = function(actor) {
        return this.getXPosition() < actor.getXPosition();
    };

    this.rightOf = function(actor) {
        return this.getXPosition() > actor.getXPosition();
    };

    this.above = function(actor, radius) {
        return this.getYPosition() < actor.getYPosition();
    };

    this.below = function(actor, radius) {
        return this.getYPosition() > actor.getYPosition();
    };

    this.addText = function(text, style) {
        var text = game.add.text(0, 0, text, style);
        this._positionText(text);
        this.texts.push(text);
        return text;
    };
}