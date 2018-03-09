function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy, left) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.sheetWidth) {
        index -= Math.floor((this.sheetWidth - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.sheetWidth) {
        index -= Math.floor(this.sheetWidth / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    
    if (left) {
        ctx.save();
    	ctx.translate(x + (this.scale * this.frameWidth) / 2, 0);
    	ctx.scale(-1, 1);
    	ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX - 940, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
    	ctx.restore();
    }
    else
	{
    	ctx.drawImage(this.spriteSheet,
                index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                this.frameWidth, this.frameHeight,
                locX, locY,
                this.frameWidth * scaleBy,
                this.frameHeight * scaleBy);
	}
    
    ctx.font = "24pt Times New Roman";
	ctx.fillStyle = "black";
	ctx.fillText("Press Space to Jump", 200, 600);
	ctx.fillStyle = "black";
	ctx.strokeText("Press Space to Jump", 200, 600);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}

function Soma(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/somacruz.png"), 0, 160, 40, 40, 350, 0.1, 15, true, false);
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/somacruz.png"), 0, 160, 40, 40, 350, 0.1, 15, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/somacruz.png"), 0, 440, 35, 40, 180, .1, 8, false, false);
    this.jumpLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/somacruz.png"), 0, 875, 35, 40, 180, .1, 8, false, false);
    this.jumping = false;
    this.left = false;
    this.right = true;
    this.speed = 200;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 400);
}

Soma.prototype = new Entity();
Soma.prototype.constructor = Soma;

Soma.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 100;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-3 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    
    this.x += this.game.clockTick * this.speed;
    
    if(this.right)
	{
    	
    	
    	if(this.x > 800)
    	{
    		this.right = false;
    		this.left = true;
    		
    		this.x = -50;
    	}
	}
	if(this.left)
	{
		if(this.x > 1000)
		{
			console.log("set back to right");
			
			this.left = false;
			this.right = true;
			
			this.x = -50
		}
	}
    
    
    Entity.prototype.update.call(this);
}

Soma.prototype.draw = function (ctx) {
    if (this.jumping) {
    	if(this.right)
		{
            this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34, 3, false);
		}
    	else if(this.left)
		{
    		this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x - 17, this.y - 34, 3, true);
		}
    }
    else 
    {
    	if(this.right)
		{
    		console.log("draw right");
    		
    		this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3, false);
		}
    	else
    	{
    		console.log("draw left");
    		this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3, true);
    	}
        
    }
	
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/somacruz.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var soma = new Soma(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(soma);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
