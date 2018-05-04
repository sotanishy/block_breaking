/**
 * Main program of Breakout game.
 * Instantiates the objects, listens for user inputs, and update and draws the game.
 *
 * @author  Sota Nishiyama
 */

let screen;

let fired = false;
let mouseX;
let count = 0;
let level = 0;

const STATUS_HEIGHT = 30;

// events
function mouseMove() {
	mouseX = event.clientX - screen.offsetLeft;
}

function mouseDown() {
	if (level === 0) {
		level = 1;
		count = 0;
	} else {
		fired = true;
	}
}

window.onload = function () {

    const FPS = 1000 / 50;
    const MSG_COLOR = '#FFAD80';

	screen = document.getElementById('screen');
	screen.width = 500;
	screen.height = 600;

	let ctx = screen.getContext('2d');

	screen.addEventListener('mousemove', mouseMove, true);
	screen.addEventListener('mousedown', mouseDown, true);

	mouseX = screen.width / 2;

	let bar = new Bar();
	bar.init();

	let ball = new Ball();
	ball.init();

	let numCol = Block.BLOCK_ARRANGEMENT[0][0].length;
	let interval = (screen.width - numCol * Block.BLOCK_WIDTH) / (numCol + 1);
	let blocks = new Array(Block.BLOCK_ARRANGEMENT[0].length);

	for (let row = 0; row < blocks.length; row++) {
		blocks[row] = new Array(numCol);

		for (let col = 0; col < numCol; col++) {
            let block = new Block();
			let x = Block.BLOCK_WIDTH * (col + 0.5) + interval * (col + 1);
			let y = Block.BLOCK_HEIGHT * (row + 0.5) + interval * (row + 1) + STATUS_HEIGHT;
			block.init(x, y);
            blocks[row][col] = block;
		}
	}

	let items = [];

    let score = 0;
    let itemCount = 0;
    let itemSound = new Audio("resources/item.mp3");

	(function () {
        let place, breakAll;

		count++;
		itemCount++;

		ctx.clearRect(0, 0, screen.width, screen.height);
		ctx.beginPath();
		ctx.fillStyle = '#909090';
		ctx.fillRect(0, STATUS_HEIGHT, screen.width, 3);

		// calculate the positon of the bar
		let half = bar.width / 2
		if (mouseX < half) {
			bar.position.x = half;
		} else if (mouseX > screen.width - half) {
			bar.position.x = screen.width - half;
		} else {
			bar.position.x = mouseX;
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
			ctx.fillText('BREAKOUT', screen.width / 2, screen.height / 2 - 100);
			ctx.font = '20px Consolas';
			ctx.fillText('Click the screen to start the game', screen.width / 2, screen.height / 2 + 100);

			// get ready for level 1
			for (let i = 0; i < blocks.length; i++) {
				for (let j = 0; j < blocks[i].length; j++) {
					blocks[i][j].set(1, i, j);
				}
			}

		} else {

			// move the ball
			if (!fired) {
				ball.set(bar.position.x, bar.position.y - bar.height / 2 - ball.size, 0, -1);
			} else {

				ball.move();

                // put down the alive flag when the ball reaches a certain coordinate
                if (ball.position.y - ball.size > screen.height) {
                    fired = false;
                    ball.life--;
                    bar.init();
                    ball.init();
                    for (let i = 0; i < items.length; i++) {
                        items[i].alive = false;
                    }
                }

				// collision detection between the ball and the bar
				place = getCollisionLocation(ball,bar);

                if (place !== '') {
					ball.set(ball.position.x, ball.position.y, ball.position.x - bar.position.x, -bar.width / 2);
                }
				
				// collision detection between the ball and blocks
				breakAll = true;

				for (let i = 0; i < blocks.length; i++) {
					for (let j = 0; j < blocks[i].length; j++) {

						if (blocks[i][j].alive) {
							let loc = getCollisionLocation(ball, blocks[i][j]);

							switch (loc) {
							case 'top':
							case 'bottom':
								blocks[i][j].life--;
								if (!ball.penetration || blocks[i][j].life !== 0) {
									ball.velocity.y *= -1;
								}
								break;

							case 'left':
							case 'right':
								blocks[i][j].life--;
								if (!ball.penetration || blocks[i][j].life !== 0) {
									ball.velocity.x *= -1;
								}
								break;
							}

							if (blocks[i][j].life === 0) {
								blocks[i][j].alive = false;
								score += blocks[i][j].score;
								// create an item
								let makeItem = Math.floor(Math.random() * Item.ITEM_FREQUENCY);
								if (makeItem === 0) {
                                    let item = new Item();
                                    item.init(blocks[i][j].position);
                                    items.push(item);
								}
							}

							breakAll=false;
						}
					}
				}

			}
            
			// draw blocks
			ctx.beginPath();
			for (let i = 0; i < blocks.length; i++) {
				for (let j = 0; j < blocks[i].length; j++) {
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
			for (let i = 0; i < items.length; i++) {
				if (items[i].alive) {

					items[i].move();

					let loc = getCollisionLocation(items[i],bar);
					let itemNum = Math.floor(Math.random() * Item.ITEM_TYPES.length);

                    if (loc !== '') {
                        items[i].alive = false;
						bar.init();
						ball.init();
						Item.ITEM_TYPES[itemNum].apply(bar, ball);
						itemCount = 0;
						itemSound.play();
                    }

					ctx.beginPath();
					let gradation = ctx.createLinearGradient(
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

			// show the level for a second
			if (count < (1000 / FPS) * 1) {
				ctx.beginPath();
				ctx.font = '50px Consolas';
				ctx.fillStyle = MSG_COLOR;
				ctx.textAlign = 'center';
				ctx.fillText('level ' + level, screen.width / 2, screen.height / 2);
			}

			// initialize after 10 seconds
			if (itemCount === (1000 / FPS) * 10) {
				bar.init();
				ball.init();
			}

			// show lives, the level, and the score
			// lives
			for (let i = 1; i < ball.life; i++) {
				ctx.beginPath();
				ctx.arc(20 * i,STATUS_HEIGHT / 2, 8, 0, Math.PI * 2, false);
				ctx.fillStyle = ball.color;
				ctx.fill();
			}

			// level, score
			ctx.beginPath();
			ctx.font = '20px Consolas';
			ctx.fillStyle = MSG_COLOR;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			let msg = 'level ' + level + '     ' + 'score ' + score;
			ctx.fillText(msg, screen.width / 2, STATUS_HEIGHT / 2);

			// when cleared
			if (breakAll) {
				// ready for the next level
				level++;
				count = 0;
				breakAll = false;
				bar.init();
				ball.init();

				for (let i = 0; i < items.length; i++) {
					items[i].alive = false;
				}

				// finish the game
				if (level - 1 === Block.BLOCK_ARRANGEMENT.length) {
					ctx.beginPath();
					ctx.font = '100px Consolas';
					ctx.fillStyle = MSG_COLOR;
					ctx.textAlign = 'center';
					ctx.fillText('CLEAR!', screen.width / 2, screen.height / 2);
					ctx.font = '50px Consolas';
					ctx.fillText('score: ' + score, screen.width / 2, screen.height / 2 + 100);

					return;
				} else {
					fired = false;

					for (let i = 0; i < blocks.length; i++) {
						for (let j = 0; j < blocks[i].length; j++) {
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
