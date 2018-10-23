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
var isDragging = false;
var isAnimatable = true;
var DELTA = 100;
var STEP = 17;
var positionRelativeToBox = 0;
var startPosition = {};
var prevDifference = 0;
var currDifference = 0;
function mouseDownHandler(event) {
    if (isAnimatable) {
        isDragging = true;
        var cursorPosition = bitmap.globalToLocal(event.stageX, event.stageY).x;
        startPosition.x = cursorPosition;
        positionRelativeToBox = cursorPosition - currentSlide * rect.width;
    }
};

function mouseMoveHandler(event) {
    if (isDragging && isAnimatable) {
        prevDifference = currDifference;
        var mouseX = bitmap.globalToLocal(event.stageX, event.stageY).x;
        currDifference = mouseX - startPosition.x;
        var bitmapBounds = bitmap.getBounds();
        bitmap.x = bitmapBounds.x + currDifference;
        bitmap.setBounds(bitmapBounds.x + currDifference, bitmapBounds.y, bitmapBounds.width, bitmapBounds.height);
        stage.update();
    }
};

function mouseUpHandler(event) {
    isDragging = false;
    if (isAnimatable) {
        var difference = event.stageX - positionRelativeToBox;
        console.log(difference, DELTA);
        if (difference > DELTA) {
            swipeLeft();
        } else if (difference < -DELTA) {
            swipeRight();
        } else if (difference < 1 && difference > -1) {
            console.log(difference);
            // bitmap.x = to;
            // bitmap.setBounds(to, startPosition.y, startPosition.width, startPosition.height);
            stage.update();
        } else {
            goToDefaultPosition();
        }
    }    
}

stage.addEventListener('stagemousedown', mouseDownHandler.bind(this));
stage.addEventListener('stagemousemove', mouseMoveHandler.bind(this));
stage.addEventListener('stagemouseup', mouseUpHandler.bind(this));

function swipeRight() {
    if (currentSlide !== slideCount - 1) {
        currentSlide++;
        var neededReplace = -currentSlide * rect.width;
        startPosition.x = neededReplace;
        animateCubicBezier(bitmap.x, neededReplace, 700);
    } else {
        goToDefaultPosition();
    }
}

function swipeLeft() {
    if (currentSlide !== 0) {
        currentSlide--;
        var neededReplace = -currentSlide * rect.width;
        startPosition.x = neededReplace;
        animateCubicBezier(bitmap.x, neededReplace, 700);
    } else {
        goToDefaultPosition();
    }
}

function goToDefaultPosition() {
    var neededReplace = -currentSlide * rect.width;
    startPosition.x = neededReplace;
    animateCubicBezier(bitmap.x, neededReplace,600);
}

function animate(from, to, step) {
    isAnimatable = false;
    var isDirectionToLeft = Math.floor((to - from) / step) < 0 ? false : true;
    var totalAnimateTimes = Math.abs(Math.floor((to - from) / step));
    var currentAnimateTimes = 0;
    var interval = setInterval(function () {
        if (totalAnimateTimes === currentAnimateTimes) {
            bitmap.x = to;
            bitmap.setBounds(to, startPosition.y, startPosition.width, startPosition.height);
            stage.update();
            clearInterval(interval);
            isAnimatable = true;
        } else {
            var operation = isDirectionToLeft ? from + step * (1 + currentAnimateTimes) : from - step * (1 + currentAnimateTimes);
            bitmap.x = operation;
            bitmap.setBounds(operation, startPosition.y, startPosition.width, startPosition.height);
            currentAnimateTimes++;
            stage.update();
        }
    }, 1000 / 60);
}

function animateCubicBezier(from, to, time) {
    isAnimatable = false;
    var step = 1000 / 60;
    var currentTime = 0;
    var isDirectionToLeft = Math.floor((to - from) / step) < 0 ? false : true;
    var x1 = isDirectionToLeft ? to + 100 : to - 100,
        x2 = isDirectionToLeft ? to + 100 : to - 100,
        x3 = isDirectionToLeft ? to - 50 : to + 50;
    var interval = setInterval(function() {
        if (currentTime >= time) {
            bitmap.x = to;
            bitmap.setBounds(to, startPosition.y, startPosition.width, startPosition.height);
            stage.update();
            clearInterval(interval);
            isAnimatable = true;
        } else {
            var F_x = cubicBezierForFivePoints(from, x1, x2, x3, to, currentTime/time);
            bitmap.x = F_x;
            bitmap.setBounds(F_x, startPosition.y, startPosition.width, startPosition.height);
            currentTime += step;
            stage.update();
        }
    }, step);
}

function cubicBezierForFivePoints(x1, x2, x3, x4, x5, time) {
    var res = x1*Math.pow(1 - time, 4) + 4*x2*time*Math.pow(1-time, 3) + 6*x3*time*time*Math.pow(1-time, 2) + 4*x4*Math.pow(time, 3)*(1 - time) + x5 * Math.pow(time, 4);
    return res;
}
