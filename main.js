
var rect = {
    width: 416,
    height: 740
};

stage = new createjs.Stage("demoCanvas");
createjs.Touch.enable(stage);
var bitmap;
// code to delete in adobe animate
var image = new Image();
image.src = "_1.jpg";
image.onload = handleImageLoad;
function handleImageLoad(event) {
    var image = event.target;
    bitmap = new createjs.Bitmap(image);
    stage.addChild(bitmap);
    stage.update();
}
//
var currentSlide = 0;
var slideCount = 3;
let isDragging = false;
var isAnimatable = true;
const DELTA = 160;
const STEP = 7;
var e = 0;
var startPosition = {};
let prevDifference = 0;
let currDifference = 0;
function mouseDownHandler(event) {
    if (isAnimatable) {
        isDragging = true;
        var p = bitmap.globalToLocal(event.stageX, event.stageY).x;
        startPosition.x = p;
        e = p - currentSlide * rect.width;
        startPosition.y = p.y;
    }
};

function mouseMoveHandler(event) {
    if (isDragging && isAnimatable) {
        prevDifference = currDifference;
        var mouseX = bitmap.globalToLocal(event.stageX, event.stageY).x;
        currDifference = mouseX - startPosition.x;
        const bitmapBounds = bitmap.getBounds();
        bitmap.x = bitmapBounds.x + currDifference;
        bitmap.setBounds(bitmapBounds.x + currDifference, bitmapBounds.y, bitmapBounds.width, bitmapBounds.height);
        console.log(bitmap);
        stage.update();
    }
};

function mouseUpHandler(event) {
    isDragging = false;
    if (isAnimatable) {
        var p = bitmap.globalToLocal(event.stageX, event.stageY).x;
        let difference = event.stageX - e;
        
        if (difference > DELTA) {
            swipeLeft();
        } else if (difference < -DELTA) {
            swipeRight();
        } else {
            goToDefaultPosition();
        }
    }    
}

stage.addEventListener('stagemousedown', mouseDownHandler.bind(this));
stage.addEventListener('stagemousemove', mouseMoveHandler.bind(this));
stage.addEventListener('stagemouseup', mouseUpHandler.bind(this));

function swipeRight() {
    console.log('swipe rigth');
    if (currentSlide !== slideCount - 1) {
        currentSlide++;
        const neededReplace = -currentSlide * rect.width;
        startPosition.x = neededReplace;
        animate(bitmap.x, neededReplace, STEP);
    } else {
        goToDefaultPosition();
    }
}

function swipeLeft() {
    console.log('swipe left');
    if (currentSlide !== 0) {
        currentSlide--;
        const neededReplace = -currentSlide * rect.width;
        startPosition.x = neededReplace;
        animate(bitmap.x, neededReplace, STEP);
    } else {
        goToDefaultPosition();
    }
}

function goToDefaultPosition() {
    console.log('go to default position');
    const neededReplace = -currentSlide * rect.width;
    startPosition.x = neededReplace;
    animate(bitmap.x, neededReplace, STEP);
}

function animate(from, to, step) {
    console.log('animating');
    isAnimatable = false;
    const isDirectionToLeft = Math.floor((to - from) / step) < 0 ? false : true;
    const totalAnimateTimes = Math.abs(Math.floor((to - from) / step));
    let currentAnimateTimes = 0;
    const interval = setInterval(function () {
        if (totalAnimateTimes === currentAnimateTimes) {
            bitmap.x = to;
            bitmap.setBounds(to, startPosition.y, startPosition.width, startPosition.height);
            stage.update();
            clearInterval(interval);
            isAnimatable = true;
        } else {
            let operation = isDirectionToLeft ? from + step * (1 + currentAnimateTimes) : from - step * (1 + currentAnimateTimes);
            bitmap.x = operation;
            bitmap.setBounds(operation, startPosition.y, startPosition.width, startPosition.height);
            currentAnimateTimes++;
            stage.update();
        }
    }, 1000 / 60);
}