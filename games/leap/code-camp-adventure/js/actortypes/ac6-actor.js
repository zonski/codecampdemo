
function ac6_actor(settings) {

    this.game = game;
    this.type = 'ac6';
    this.name = 'Pet Food';
    this.spritesheetId = 'anthro_item_chicken_legs';

    this.settings = settings;
    this.alive = true;

    this.speechBubble;

    this.init = function(scene) {

        this.scene = scene;

        this.sprite = this.scene.actorGroup.create(settings.initialX, settings.initialY, this.spritesheetId);
        game.physics.enable(this.sprite);

        var _this = this;

        this.sprite.actor = this;
        this.sprite.anchor.setTo(0.5);




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

        if (this.speechBubble) {
            this._positionSpeechBubble()
        }
    };

    this._positionSpeechBubble = function() {
        var text = this.speechBubble.text;
        var box = this.speechBubble.box;

        text.x = Math.floor(this.sprite.x + this.sprite.width / 2);
        text.y = this.sprite.y - text.height - 5;

        box.x = text.x - 10 - (text.width / 2);
        box.y = text.y - 10 - (text.height / 2);

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

    this.reverseSpeed = function() {
        this.reverseXSpeed();
        this.reverseYSpeed();
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

    this.moveAwayFromActor = function(actor, speed) {
        this.moveTowardsActor(actor, speed);
        this.reverseSpeed();
    };

    this.moveTowardsMouse = function(speed) {
        game.physics.arcade.moveToPointer(this.sprite, speed);
    };

    this.isNearActor = function(actor, radius) {
        radius = radius ? radius : 200;
        return this.getDistanceToActor(actor) < radius;
    };

    this.getDistanceToActor = function(actor) {
        var x1 = this.getXPosition();
        var y1 = this.getYPosition();
        var x2 = actor.getXPosition();
        var y2 = actor.getYPosition();
        return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
    };

    this.findNearestActor = function(name, maxDistance) {
        var nearest = null;
        var nearestDist = null;
        for (var i = 0; i < this.scene.actors.length; i++) {
            var actor = this.scene.actors[i];
            if (actor.alive && actor.name === name) {
                var dist = this.getDistanceToActor(actor);
                if (!maxDistance || dist <= maxDistance) {
                    if (!nearestDist || dist < nearestDist) {
                        nearest = actor;
                        nearestDist = dist;
                    }
                }
            }
        }
        return nearest;
    };


    this.isLeftOfActor = function(actor) {
        return this.getXPosition() < actor.getXPosition();
    };

    this.isRightOfActor = function(actor) {
        return this.getXPosition() > actor.getXPosition();
    };

    this.isAboveActor = function(actor) {
        return this.getYPosition() < actor.getYPosition();
    };

    this.isBelowActor = function(actor) {
        return this.getYPosition() > actor.getYPosition();
    };

    this.showSpeechBubble = function(text) {
        if (!this.speechBubble) {

            var box = game.add.graphics(0, 0);

            var style = {
                font: "13px Arial",
                fill: "#000000",
                backgroundColor: "#ffffff" ,
                wordWrap: true,
                wordWrapWidth: 200
            };
            var text = game.add.text(0, 0, text, style);
            text.anchor.setTo(0.5);

            box.lineStyle(0);
            box.beginFill(0xFFFFFF);
            box.drawRoundedRect(0, 0, text.width + 20, text.height + 20);
            box.endFill();

            this.speechBubble = { text: text, box: box };
            this._positionSpeechBubble();
        }
        this.speechBubble.box.visible = true;
        this.speechBubble.text.text = text;
        this.speechBubble.text.visible = true;
    };

    this.hideSpeechBubble = function() {
        if (this.speechBubble) {
            this.speechBubble.box.visible = false;
            this.speechBubble.text.visible = false;
        }
    };

    this.setAlpha = function(amount) {
        this.sprite.alpha = amount;
    };

    this.startTimer = function(time, callback) {
        var _this = this;
        game.time.events.add(Phaser.Timer.SECOND * time, function() {
            callback.call(_this);
        }, this.sprite);
    };

    this.flash = function(numberOfTimes, duration, callback) {
        var _this = this;
        var tween = game.add.tween(this.sprite)
            .to({alpha:0}, duration * Phaser.Timer.SECOND, Phaser.Easing.Linear.None, false, 0, numberOfTimes-1, true);

        if (callback) {
            tween.onComplete.add(function() {
                callback.call(_this);
            }, this.sprite);
        }
        tween.start();
    };
}
