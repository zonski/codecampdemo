
function player_actor(settings) {

    this.type = 'player';
    this.name = 'Player';
    this.spritesheetId = 'cc_girl_puffyhair_red_md';

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

        if (this.speechBubble) {
            this._positionSpeechBubble()
        }
    };

    this._positionSpeechBubble = function() {
        var text = this.speechBubble.text;
        text.x = Math.floor(this.sprite.x + this.sprite.width / 2);
        text.y = this.sprite.y - text.height - 5;

        var box = this.speechBubble.box;
        box.x = text.x - 10 - (text.width / 2);
        box.y = text.y - 10 - (text.height / 2);

    };


    //------------------------------------------------------------------------------------------------------------------
    // Create

    this.onCreate = function(event) {
        this.onCreate_0(event);
    };

    // Setup
    this.onCreate_0 = function(event) {
        this.makeCameraFollow();
this.setCanRotate(false);

var style = { 
    font: "14px Arial", 
    backgroundColor: "#ffffff",
    boundsAlignH: 'center'    
};

this.scene.addTextToScreen(10, 30, 'Lives: ' + global.lives, style);

this.scoreLabel = this.scene.addTextToScreen(game.camera.width - 100, 30, 'Score: ' + global.score, style);
    };


    //------------------------------------------------------------------------------------------------------------------
    // Update

    this.onUpdate = function(event) {
        this.onUpdate_0(event);
        this.onUpdate_1(event);
    };

    // Walk
    this.onUpdate_0 = function(event) {
         if (keys.right.isDown) {
    this.setXSpeed(250);
    this.playAnimation('Walk Right');
} else if (keys.left.isDown) {
    this.setXSpeed(-250);
    this.playAnimation('Walk Left');
} else {
    this.setXSpeed(0);
}
    };

    // Mouse Move
    this.onUpdate_1 = function(event) {
        if (mouse.isDown()) {
    if (mouse.getX() < this.getXPosition()) {
        this.setXSpeed(-250);
        this.playAnimation('Walk Left');
    } else {
        this.setXSpeed(250);
        this.playAnimation('Walk Right');
    }

    if (mouse.getY() < this.getYPosition()) {
        if (this.isOnGround()) {
            this.setYSpeed(-550);
        }
    } 
}
    };



    //------------------------------------------------------------------------------------------------------------------
    // Actor Collisions

    this.onCollisionWithActor = function(event) {
        if (event.collidedWith.type == 'zombie') {
            this.onCollisionWithActor_0(event.collidedWith);
        }
        if (event.collidedWith.type == 'butterfly') {
            this.onCollisionWithActor_1(event.collidedWith);
        }
        if (event.collidedWith.type == 'frankie') {
            this.onCollisionWithActor_2(event.collidedWith);
        }
    }

    // Hit Zombie
    this.onCollisionWithActor_0 = function(collidedWith) {
        this.die();

    };

    // Hit a Butterfly
    this.onCollisionWithActor_1 = function(collidedWith) {
        collidedWith.kill();
this.addToScore(5);

    };

    // Hit Frankie
    this.onCollisionWithActor_2 = function(collidedWith) {
        game.switchScene('Level 2');

    };






    //------------------------------------------------------------------------------------------------------------------
    // Key Presses

    this.onKeyDown = function(key) {
        if (key == 'up') {
            this.onKeyDown_up_0();
        }
        if (key == 'spacebar') {
            this.onKeyDown_spacebar_0();
        }
    }

    // Jump
    this.onKeyDown_up_0 = function() {
        if (this.isOnGround()) {
    this.setYSpeed(-550);
}
    };
    // Shoot
    this.onKeyDown_spacebar_0 = function() {
        var bullet = this.scene.createActor('bullet', this.getXPosition() + 40, this.getYPosition());
bullet.setXSpeed(300);
bullet.setYSpeed(-300);

    };

    //------------------------------------------------------------------------------------------------------------------
    // Custom Functions

    // Death
    this.die = function() {
        console.log('Dying with lives: ' + global.lives);
global.lives = global.lives - 1;

if (global.lives > 0) {
    game.restartScene();    
} else {
    game.switchScene('Intro');
}

    };
    // Add to score
    this.addToScore = function(amount) {
        global.score = global.score + amount;
this.scoreLabel.text = 'Score: ' + global.score;
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

    this.moveTowardsMouse = function(speed) {
        game.physics.arcade.moveToPointer(this.sprite, speed);
    };

    this.near = function(actor, radius) {
        radius = radius ? radius : 200;
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
        this.speechBubble.text.visible = true;
    };

    this.hideSpeechBubble = function() {
        if (this.speechBubble) {
            this.speechBubble.box.visible = false;
            this.speechBubble.text.visible = false;
        }
    }
}
