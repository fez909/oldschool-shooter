var width = 512, height = 512, gLoop, c = document.getElementById('canvas'), ctx = c.getContext('2d');
var x = 0, y = 0, man = new Image(), speed = 6, bulletSpeed = 10, keyArrowUp = false, keyArrowDown = false, keyArrowLeft = false, keyArrowRight = false;
var maxBullets = 1, srcImageOffsetX = 0, srcImageOffsetY = 0;
var bullets = new Array();
var direction = "right";

man.src = 'img/AgentWalk.png';

c.width = width;
c.height = height;

// handle key presses
var doKeyDown = function(evt) {
    switch(evt.keyCode) {
        // up - move up
        case 38:
            keyArrowUp = true;
            srcImageOffsetY = 0;
            break;
        // down - move down
        case 40:
            keyArrowDown = true;
            srcImageOffsetY = 128;
            break;
        // left - move left
        case 37:
            keyArrowLeft = true;
            if (!(keyArrowUp || keyArrowDown)) {
                srcImageOffsetY = 64;
            }
            break;
        // right - move right
        case 39:
            keyArrowRight = true;
            if (!(keyArrowUp || keyArrowDown)) {
                srcImageOffsetY = 192;
            }
            break;
        // space - shoot
        case 32:
            // check that there isn't the maximum number of bullets in use before adding another
            if (bullets.length < maxBullets) {
                // start the bullet with a 32px offset so it comes from the centre of the player
                bullets.push([direction, x + 32, y + 32]);
            }
    }
    setDirection();
};

// same as key down, but used to stop the player moving
// and to update the direction
var doKeyUp = function(evt) {
    switch(evt.keyCode) {
        // up
        case 38:
            keyArrowUp = false;
            break;
        // down
        case 40:
            keyArrowDown = false;
            break;
        // left
        case 37:
            keyArrowLeft = false;
            break;
        // right
        case 39:
            keyArrowRight = false;
            break;
    }
    setDirection();
};

// set the way the player is facing to send bullets in the correct direction
// called on key up and key down so that the direction is always the last movement made
var setDirection = function() {
    if (keyArrowUp && keyArrowLeft) {
        direction = "up left";
    } else if (keyArrowUp && keyArrowRight) {
        direction = "up right";
    } else if (keyArrowDown && keyArrowLeft) {
        direction = "down left";
    } else if (keyArrowDown && keyArrowRight) {
        direction = "down right";
    } else if (keyArrowUp) {
        direction = "up";
    } else if (keyArrowDown) {
        direction = "down";
    } else if (keyArrowLeft) {
        direction = "left";
    } else if (keyArrowRight) {
        direction = "right";
    }
};

// resets the canvas between frames
var clear = function() {
    ctx.fillStyle = '#d0e7f9';
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
}
// main loop
// clears the canvas, draws the player, updates the position of any bullets that exist and draws them
var gameLoop = function() {
    clear();
    getNewManPosition();
    drawMan();
    if (bullets.length > 0) {
        getNewBulletPosition();
        drawBullets();
    }
    gLoop = setTimeout(gameLoop, 30);
};

// update the coordinates of the player
var getNewManPosition = function() {
    if (keyArrowLeft && x > 0) {
        x -= speed;
    }
    if (keyArrowRight && x < width - 64) {
        x += speed;
    }
    if (keyArrowDown && y < height - 64) {
        y += speed;
    }
    if (keyArrowUp && y > 0) {
        y -= speed;
    }
};

// for each bullet in the array, check its direction and update the bullet cordinates
var getNewBulletPosition = function() {
    for ( i = bullets.length - 1; i >= 0; i--) {
        switch(bullets[i][0]) {
            case "left":
                if (bullets[i][1] > 0) {
                    bullets[i][1] -= bulletSpeed;
                } else {
                    bullets.splice(i, 1);
                }
                break;
            case "right":
                if (bullets[i][1] < width) {
                    bullets[i][1] += bulletSpeed;
                } else {
                    bullets.splice(i, 1);
                }
                break;
            case "up":
                if (bullets[i][2] > 0) {
                    bullets[i][2] -= bulletSpeed;
                } else {
                    bullets.splice(i, 1);
                }
                break;
            case "down":
                if (bullets[i][2] < height) {
                    bullets[i][2] += bulletSpeed;
                } else {
                    bullets.splice(i, 1);
                }
                break;
            case "up left":
                if (bullets[i][1] > 0 && bullets[i][2] > 0) {
                    bullets[i][1] -= bulletSpeed;
                    bullets[i][2] -= bulletSpeed;
                } else {
                    bullets.splice(i, 1);
                }
                break;
            case "up right":
                if (bullets[i][1] < width && bullets[i][2] > 0) {
                    bullets[i][1] += bulletSpeed;
                    bullets[i][2] -= bulletSpeed;
                } else {
                    bullets.splice(i, 1);
                }
                break;
            case "down left":
                if (bullets[i][1] > 0 && bullets[i][2] < height) {
                    bullets[i][1] -= bulletSpeed;
                    bullets[i][2] += bulletSpeed;
                } else {
                    bullets.splice(i, 1);
                }
                break;
            case "down right":
                if (bullets[i][1] < width && bullets[i][2] < height) {
                    bullets[i][1] += bulletSpeed;
                    bullets[i][2] += bulletSpeed;
                } else {
                    bullets.splice(i, 1)
                }
                break;
        }
    }
};

var drawBullets = function() {
    // loop through the array, drawing the bullets
    ctx.fillStyle = "#000000";
    for ( i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i][1], bullets[i][2], 5, 5);
    }
};

// the image is all loaded, so to animate it display each 64px image by position on board
// there's 9 images so we can use the remainder of integer division to decide which image to show
// when going left and right use the X position for calculation, and the Y when doing up and down.
var getSrcImageOffset = function() {
    if (keyArrowUp || keyArrowDown) {
        srcImageOffsetX = (y % 9) * 64;
    } else {
        srcImageOffsetX = (x % 9) * 64;
    }
};

// draw the player to the canvas
var drawMan = function() {
    getSrcImageOffset();
    ctx.drawImage(man, srcImageOffsetX, srcImageOffsetY, 64, 64, x, y, 64, 64);
};

// detect key events for moving/shooting
window.addEventListener('keydown', doKeyDown);
window.addEventListener('keyup', doKeyUp);

gameLoop();
