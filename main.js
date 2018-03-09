var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.drawSomaFrame = function (tick, ctx, x, y, left, right) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    	
    yindex = Math.floor(frame / this.sheetWidth) + 4;
    xindex = frame % this.sheetWidth;
    
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // (x,y) source from sheet
                 this.frameWidth, this.frameHeight, // (x,y) size of sprite.
                 x, y, // sprite position on screen.
                 this.frameWidth * this.scale, // sprite scale; x
                 this.frameHeight * this.scale); // sprite scale; y
};

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Soma(game, spritesheet) {
    this.animation = new Animation(spritesheet, 40, 40, 320, 0.15, 8, true, 4);
    this.x = 0;
    this.y = 0;
    this.speed = 200;
    this.game = game;
    this.ctx = game.ctx;
}

Soma.prototype = new Entity();
Soma.prototype.constructor = Soma;

Soma.prototype.update = function () {
	this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Soma.prototype.draw = function () {
	this.animation.drawSomaFrame(this.game.clockTick, this.ctx, this.x, this.y, false, false);
	Entity.prototype.draw.call(this);
}
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/somacruz.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Soma(gameEngine, AM.getAsset("./img/somacruz.png")));

    console.log("All Done!");
});