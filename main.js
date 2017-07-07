/**
 * since: 2016
 * last modified: 2017/7/7
 * author: Sota Nishiyama
 */

var screen;
var ctx;

var bar;
var ball;
var blocks;
var items;

var fire = false;
var breakAll = false;

var mouse = new Point;
var ballVector = new Point();

var count = 0;
var itemCount = 0;
var level = 0;
var score = 0;

var i,j;

var itemSound = new Audio("resources/item.mp3");

const FPS = 1000 / 50;
const INFO_HEIGHT = 30;
const ITEM_FREQUENCY = 10;
const MSG_COLOR = '#FFAD80';

// events
function mouseMove () {
	// update the coordinate of the mouse cursor
	mouse.x = event.clientX - screen.offsetLeft;
}

function mouseDown () {
	if (level === 0) {
		// start the game
		level = 1;
		count = 0;
	} else {
		// launch the ball
		fire = true;
	}
}

window.onload = function () {
	screen = document.getElementById('screen');
	screen.width = 500;
	screen.height = 600;

	ctx = screen.getContext('2d');

	screen.addEventListener('mousemove', mouseMove, true);
	screen.addEventListener('mousedown', mouseDown, true);

	//initialization
	bar = new Bar();
	bar.init();
	bar.position.y = 550;
	mouse.x = screen.width / 2;

	ball = new Ball();
	ball.init();
	ballVector.y = -bar.width / 2;

	var rowNumber = blockArrange[0][0].length;
	var interval = (screen.width - rowNumber * BLOCK_WIDTH) / (rowNumber + 1);
	blocks = new Array(blockArrange[0].length);

	var row, col;
	for (row = 0; row < blocks.length; row++) {
		blocks[row] = new Array(rowNumber);

		for (col = 0; col < rowNumber; col++) {
			blocks[row][col] = new Block();

			var blockPoint = new Point();
			blockPoint.x = BLOCK_WIDTH * (col + 0.5) + interval * (col + 1);
			blockPoint.y = BLOCK_HEIGHT * (row + 0.5) + interval * (row + 1) + INFO_HEIGHT;

			blocks[row][col].init(blockPoint);
		}
	}

	items = new Array();
	var index = 0;

	// call loop handling
	(function () {

		count++;
		itemCount++;

		ctx.clearRect(0, 0, screen.width, screen.height);
		ctx.beginPath();
		ctx.fillStyle = '#909090';
		ctx.fillRect(0, INFO_HEIGHT, screen.width, 3);

		// calculate the positon of the bar
		var half = bar.width / 2
		if (mouse.x < half) {
			bar.position.x = half;
		} else if (mouse.x > screen.width - half) {
			bar.position.x = screen.width - half;
		} else {
			bar.position.x = mouse.x;
		}

		// draw the bar
		ctx.beginPath();
		ctx.fillStyle = bar.color;
		ctx.fillRect(bar.position.x - half, bar.position.y - (bar.height / 2), bar.width, bar.height);

		// branch by the level
		if (level === 0) {

			// title
			ctx.beginPath();
			ctx.font = '100px Consolas';
			ctx.fillStyle = MSG_COLOR;
			ctx.textAlign = 'center';
			ctx.fillText('BLOCK', screen.width / 2, screen.height / 2 - 100);
			ctx.fillText('BREAKING', screen.width / 2, screen.height / 2);
			ctx.font = '20px Consolas';
			ctx.fillText('Click the screen to start the game', screen.width / 2, screen.height / 2 + 100);

			// ready for level 1
			for (i = 0; i < blocks.length; i++) {
				for (j = 0; j < blocks[i].length; j++) {
					blocks[i][j].set(1, i, j);
				}
			}

		} else {

			// move the ball
			if (!fire) {

				// set the ball
				var ballPoint = new Point;
				ballPoint.x = bar.position.x;
				ballPoint.y = bar.position.y - (bar.height / 2) - ball.size;
				ballVector.x = 0;
				ball.set(ballPoint, ballVector);

			} else {

				ball.move();

				// collision detection between the ball and the bar --------------------
				var place = judge(ball,bar);

				switch (place) {

					case 'upper':
					case 'lower':
					case 'left':
					case 'right':

					ballVector.x = ball.position.x - bar.position.x;
					ballVector.y = - bar.width / 2;
					ball.set(ball.position, ballVector);

				}

				// collision detection between the ball and blocks--------------------
				breakAll = true;

				for (i = 0; i < blocks.length; i++) {
					for (j = 0; j < blocks[i].length; j++) {

						if (blocks[i][j].alive) {
							place = judge(ball, blocks[i][j]);

							switch (place) {
								case 'upper':
								case 'lower':
								blocks[i][j].life--;
								if (!ball.penetration || blocks[i][j].life !== 0) {
									ball.vector.y *= -1;
								}
								break;

								case 'left':
								case 'right':
								blocks[i][j].life--;
								if (!ball.penetration || blocks[i][j].life !== 0) {
									ball.vector.x *= -1;
								}
								break;
							}

							// when a block gets destroyed
							if (blocks[i][j].life === 0) {
								blocks[i][j].alive = false;
								score += blocks[i][j].score;
								// create an item
								var makeItem = Math.floor(Math.random() * ITEM_FREQUENCY);
								if (makeItem === 0) {
									items[index] = new Item();
									items[index].init(blocks[i][j].position);
									index++;
								}
							}

							breakAll=false;
						}
					}
				}

			}

			// draw blocks
			ctx.beginPath();

			for (i = 0; i < blocks.length; i++) {
				for (j = 0; j < blocks[i].length; j++) {
					if (blocks[i][j].alive) {
						ctx.fillStyle = blocks[i][j].color;
						ctx.fillRect(
							blocks[i][j].position.x - blocks[i][j].width / 2,
							blocks[i][j].position.y - blocks[i][j].height / 2,
							blocks[i][j].width,
							blocks[i][j].height
							);
						ctx.closePath();
					}
				}
			}

			// items
			for ( i = 0; i < index; i++) {
				if (items[i].alive) {

					items[i].move();

					place=judge(items[i],bar);
					var itemNum = Math.floor(Math.random() * itemTypes.length);

					switch(place){
						case 'upper':
						case 'lower':
						case 'left':
						case 'right':

						items[i].alive = false;
						bar.init();
						ball.init();
						itemTypes[itemNum].apply(bar, ball);
						itemCount = 0;
						itemSound.play();
					}

					// draw
					ctx.beginPath();
					// set the gradation
					var gradation = ctx.createLinearGradient(
						items[i].position.x - items[i].size,
						items[i].position.y - items[i].size,
						items[i].position.x - items[i].size,
						items[i].position.y + items[i].size
						);
					gradation.addColorStop(0, '#00FF60'); 
 					gradation.addColorStop(1, '#00A8FF');

					ctx.fillStyle = gradation;
					ctx.arc(items[i].position.x, items[i].position.y, items[i].size, 0, Math.PI * 2, false);
					ctx.fill();

					ctx.font='20px Consolas';
					ctx.fillStyle='#404040';
					ctx.textAlign='center';
					ctx.textBaseline='middle';
					ctx.fillText('?', items[i].position.x, items[i].position.y);
				}
			}

			// draw the ball
			ctx.beginPath();
			ctx.arc(ball.position.x, ball.position.y, ball.size, 0, Math.PI * 2, false);
			ctx.fillStyle = ball.color;
			ctx.fill();

			// show the level for a while
			if (count < (1000 / FPS) * 1) { // 1 second
				ctx.beginPath();
				ctx.font = '50px Consolas';
				ctx.fillStyle = MSG_COLOR;
				ctx.textAlign = 'center';
				ctx.fillText('level ' + level, screen.width / 2, screen.height / 2);
			}

			// initialize after a while
			if (itemCount === (1000 / FPS) * 10) { // 10 seconds
				bar.init();
				ball.init();
			}

			// show lives, the level, and the score
			// lives
			for (i = 1; i < ball.life; i++) {
				ctx.beginPath();
				ctx.arc(20 * i,INFO_HEIGHT / 2, 8, 0, Math.PI * 2, false);
				ctx.fillStyle = ball.color;
				ctx.fill();
			}
			// level, score
			ctx.beginPath();
			ctx.font = '20px Consolas';
			ctx.fillStyle = MSG_COLOR;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			var msg = 'level ' + level + '     ' + 'score ' + score;
			ctx.fillText(msg, screen.width / 2, INFO_HEIGHT / 2);

			// when cleared
			if (breakAll) {
				// ready for the next level
				level++;
				count = 0;
				breakAll = false;
				bar.init();
				ball.init();

				for (i = 0; i < index; i++) {
					items[i].alive = false;
				}

				// finish the game
				if (level - 1 === blockArrange.length) {
					ctx.beginPath();
					ctx.font = '100px Consolas';
					ctx.fillStyle = MSG_COLOR;
					ctx.textAlign = 'center';
					ctx.fillText('CLEAR!', screen.width / 2, screen.height / 2);
					ctx.font = '50px Consolas';
					ctx.fillText('score: ' + score, screen.width / 2, screen.height / 2 + 100);

					return;
				} else {
					fire = false;

					for (i = 0; i < blocks.length; i++) {
						for (j = 0; j < blocks[i].length; j++) {
							blocks[i][j].set(level, i, j);
						}
					}
				}
			}

			// game over
			if (ball.life === 0) {
				ctx.beginPath();
				ctx.font = '100px Consolas';
				ctx.fillStyle = MSG_COLOR;
				ctx.textAlign = 'center';
				ctx.fillText('GAME', screen.width / 2, screen.height / 2 - 50);
				ctx.fillText('OVER', screen.width / 2, screen.height / 2 + 50);
				ctx.font = '50px Consolas';
				ctx.fillText('score: ' + score, screen.width / 2, screen.height / 2 + 150);

				return;
			}
		}

		setTimeout(arguments.callee, FPS);
	}) ();
}
