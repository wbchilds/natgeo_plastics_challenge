var canvas = document.getElementById("intro_canvas");
var ctx = canvas.getContext("2d");
var dx = 2;
var dy = 1;
var rightPressed = false;
var leftPressed = false;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) /2;
var bottlecount = 0;
var bottlescaught = 0;
var bottleids = 0;
var img = new Image;
img.src = 'img/plastics_bottle_PETE1.svg'

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
    x = Math.random()*canvas.width
    deg = (Math.random()-0.5)*100
    bottlequeue.push([x,0,deg,bottleids])
    bottlecount += 1;
    bottleids += 1;
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawImageRot(img,x,y,width,height,deg){

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    //reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function drawBottle(bottle) {
	drawImageRot(img,bottle[0],bottle[1],18,40,bottle[2])
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
function drawAll() {
    mseconds = mseconds + 1;
    var seconds = mseconds/100;
	if ( Math.random() <= 0.10 ){
		createBottle()
	};
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	drawBottles();
	drawPaddle();
	updateBottles();

	//paddle
	if (rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX +=7;
	}
	else if (leftPressed && paddleX > 0 ){
		paddleX -= 7;
	}



}

function collisionDetection(bottle) {
    var paddleXmin = paddleX-(paddleWidth/2)
    var paddleXmax = paddleX+(paddleWidth/2)
    var uid = bottle[3]
    if ((bottle[1] > canvas.height-paddleHeight) && (bottle[0]<paddleXmax) && (bottle[0]>paddleXmin)) {
	bottlescaught += 1;
	console.log(bottlescaught);
	return uid
    }

}

setInterval(drawAll, 10);
