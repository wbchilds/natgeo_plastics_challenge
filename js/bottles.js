var canvas = document.getElementById("intro_canvas");
var ctx = canvas.getContext("2d");
var dx = 2;
var dy = 1;
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

function createBall() {
	x = Math.random()*canvas.width
	deg = (Math.random()-0.5)*100
	bottlequeue.push([x,0,deg])
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

function drawBall(bottle) {
	drawImageRot(img,bottle[0],bottle[1],18,40,bottle[2])
}

function updateBalls() {
	bottlequeue = bottlequeue.map(bottle => [bottle[0],bottle[1]+dy,bottle[2]])
	bottlequeue = bottlequeue.filter(bottle => bottle[1] <  canvas.height)
}

function drawBalls() {
	bottlequeue.map(drawBall)	
}
function draw() {
	mseconds = mseconds + 1
	createBall()
	createBall()
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	drawBalls();
	updateBalls();
}

setInterval(draw, 10);
