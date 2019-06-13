function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    var ctx = canvas.getContext('2d');
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}

var ctx = setupCanvas(document.querySelector('canvas'));
var canvas = document.getElementById('bottles_canvas');
ctx.font = '8px Comfortaa';
// var dx = 2;
var dy = 1;
var rightPressed = false;
var leftPressed = false;
var paddleHeight = 24;
var paddleWidth = 24;
var paddleX = (canvas.width-paddleWidth) /2;
var bottlecount = 0;
var bottlescaught = 0;
var bottleslost = 0;
var bottleids = 0;
var imgBottle = new Image;
imgBottle.src = 'img/plastics_bottle_PETE2.svg';
var imgBin = new Image(4,32);
imgBin.src = 'img/ic_recycling_bin.svg';

var mseconds = 0;
var bottlequeue= []; 

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function createBottle() {
    x = Math.random()*canvas.width;
    deg = (Math.random()-0.5)*100;
    bottlequeue.push([x,0,deg,bottleids]);
    bottlecount += 1;
    bottleids += 1;
}

function drawPaddle(img,x,y,width,height) {
    ctx.drawImage(imgBin,paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
}

function drawImageRot(img,x,y,width,height,deg){

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(imgBottle,width / 2 * (-1),height / 2 * (-1),width,height);

    //reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function drawBottle(bottle) {
	drawImageRot(imgBottle,bottle[0],bottle[1],10,24,bottle[2])
}

function updateBottles() {
	bottlequeue = bottlequeue.map(bottle => [bottle[0],bottle[1]+dy,bottle[2],bottle[3]])
	bottlequeue = bottlequeue.filter(bottle => bottle[1] <  canvas.height)

    	collisions = bottlequeue.map(collisionDetection).filter(Number)
        bottlequeue = bottlequeue.filter(bottle => !collisions.includes(bottle[3]))
}

function drawBottles() {
	bottlequeue.map(drawBottle)	
}
function drawScore(bottlescaught,bottleslost) {
    caughttxt = `Bottles caught: ${bottlescaught}`;
    losttxt = `Bottles lost: ${bottleslost}`;
    ctx.fillStyle = '#2a1169';
    ctx.fillText(caughttxt,canvas.width-100,canvas.height-20);
    ctx.fillText(losttxt,canvas.width-100,canvas.height-10);
}
function drawAll() {
    mseconds = mseconds + 1;
    var seconds = mseconds/100;
	if ( Math.random() <= 0.10 ){
		createBottle()
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	drawBottles();
	drawPaddle();
	updateBottles();
	drawScore(bottlescaught,bottleslost);

	//paddle
	if (rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX +=3;
	}
	else if (leftPressed && paddleX > 0 ){
		paddleX -= 3;
	}



}

function collisionDetection(bottle) {
    var paddleXmin = paddleX-(paddleWidth/2)
    var paddleXmax = paddleX+(paddleWidth/2)
    var uid = bottle[3]
    if ((bottle[1] >= canvas.height-paddleHeight-20) && (bottle[0]<=paddleXmax+10) && (bottle[0]>=paddleXmin-10)) {
	bottlescaught += 1;
	console.log(bottlescaught);
	return uid
    }
    else {
	bottleslost += 1;
    }

}

setInterval(drawAll, 10);
