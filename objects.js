const BAR_POSITION_Y = 550;
const BAR_WIDTH = 160;
const BAR_HEIGHT = 15;
const BAR_COLOR = '#808080';

function Bar() {
	this.position = new Point();
	this.width = 0;
	this.height = 0;
	this.color = '';
	this.shape = 'rect';
}

Bar.prototype.init = function () {
    this.position.y = BAR_POSITION_Y;
	this.width = BAR_WIDTH;
	this.height = BAR_HEIGHT;
	this.color = BAR_COLOR;
};

const BALL_SIZE = 10;
const BALL_SPEED = 10;
const BALL_COLOR = '#808080';

function Ball() {
	this.position = new Point();
	this.velocity = new Point();
	this.size = 0;
	this.speed = 0;
	this.life = 5;
	this.penetration = false;
	this.color = '';
	this.shape = 'circle';
}

Ball.prototype.init = function () {
	this.size = BALL_SIZE;
	this.speed = BALL_SPEED;
	this.color = BALL_COLOR;
	this.penetration = false;
}

Ball.prototype.set = function (x, y, vx, vy) {
	this.position.x = x;
	this.position.y = y;
	this.velocity.x = vx;
	this.velocity.y = vy;
    this.velocity.normalize();
};

Ball.prototype.move = function () {
	// move the position based on the speed
	this.position.x += this.velocity.x * this.speed;
	this.position.y += this.velocity.y * this.speed;

	// change the direction when hitting the wall
	if ((this.position.x - this.size <= 0 && this.velocity.x < 0) || (this.position.x + this.size >= screen.width && this.velocity.x > 0)) {
		this.velocity.x *= -1;
	}
	if (this.position.y - this.size <= INFO_HEIGHT && this.velocity.y < 0) {
		this.velocity.y *= -1;
	}
};

const BLOCK_ARRANGEMENT = [
	[
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0]
	],
	[
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[2,2,2,2,2,2,2,2,2,2,2,2,2],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0]
	],
	[
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[2,2,2,2,2,2,2,2,2,2,2,2,2],
		[3,3,3,3,3,3,3,3,3,3,3,3,3],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[3,3,3,3,3,3,3,3,3,3,3,3,3],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0]
	],
	[
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,3,2,3,2,3,2,3,2,3,2,3,2],
		[1,1,1,1,1,1,1,1,1,1,1,1,1],
		[2,2,2,2,2,2,0,2,2,2,2,2,2],
		[0,3,0,3,0,3,0,3,0,3,0,3,0],
		[1,1,1,1,1,1,0,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0]
	],
]

const BLOCK_WIDTH = 37;
const BLOCK_HEIGHT = 20;

function Block() {
	this.position = new Point();
	this.width = 0;
	this.height = 0;
	this.score = 0;
	this.life = 5;
	this.color = '';
	this.alive = false;
	this.shape = 'rect';
}

Block.prototype.init = function (x, y) {
	this.position.x = x;
	this.position.y = y;
	this.width = BLOCK_WIDTH;
	this.height = BLOCK_HEIGHT;
}

Block.prototype.set = function (level, row, col) {
	level -= 1;
	if (BLOCK_ARRANGEMENT[level][row][col] !== 0) {
		this.alive = true;
		this.life = BLOCK_ARRANGEMENT[level][row][col];
		this.score = BLOCK_ARRANGEMENT[level][row][col] * 10;
		switch (BLOCK_ARRANGEMENT[level][row][col]) {
		case 1:
			this.color = '#02CBFD';
			break;
		case 2:
			this.color = '#02FD0E'
			break;
		case 3:
			this.color = '#DEFF00';
			break;
		}
	} else {
		this.alive = false;
	}
}

const ITEM_TYPES = [
	{
		name: 'bigBar',
		apply: function (bar, ball) {
			bar.width = BAR_WIDTH * 1.5;
			bar.color = '#FF4545';
		}
	},
	{
		name: 'smallBar',
		apply: function (bar, ball) {
			bar.width = BAR_WIDTH / 2;
			bar.color = '#477BFF';
		}
	},
	{
		name: 'fastBall',
		apply: function (bar, ball) {
			ball.speed = BALL_SPEED * 1.5;
			ball.color = '#FC0101';
		}
	},
	{
		name: 'slowBall',
		apply: function (bar, ball) {
			ball.speed = BALL_SPEED / 2;
			ball.color = '#0802FE';
		}
	},
	{
		name: 'bigBall',
		apply: function (bar, ball) {
			ball.size = BALL_SIZE * 1.5;
			ball.color = '#FF4545';
		}
	},
	{
		name: 'smallBall',
		apply: function (bar, ball) {
			ball.size = BALL_SIZE / 2;
			ball.color = '#477BFF';
		}
	},
	{
		name: 'penetration',
		apply: function (bar, ball) {
			ball.color = '#FF8400';
			ball.penetration = true;
		}
	}
];

const ITEM_SIZE = 10;
const ITEM_SPEED = 3;

function Item() {
	this.position = new Point();
	this.size = 0;
	this.speed = 0;
	this.kind = '';
	this.alive = false;
	this.shape = 'circle';
}

Item.prototype.init = function (position) {
	this.position.x = position.x;
	this.position.y = position.y;
	this.size = ITEM_SIZE;
	this.speed = ITEM_SPEED;
	this.alive = true;
}

Item.prototype.move = function () {
	this.position.y += this.speed;

	// bottom
	if(this.position.y - this.size > screen.height) {
		this.alive = false;
	}
}

/*
 * judge(obj1, obj2)
 * obj1 ... Ball or Item
 * obj2 ... Bar or Block
 */
function judge(obj1, obj2) {
	let diffX = obj2.position.x - obj1.position.x;
	let diffY = obj2.position.y - obj1.position.y;

	if (Math.abs(diffX) <= obj2.width / 2 && Math.abs(diffY) <= obj1.size + obj2.height / 2) {
		if (diffY >= 0) {
			return 'upper';
		} else {
			return 'lower';
		}
	} else if (Math.abs(diffY) <= obj2.height / 2 && Math.abs(diffX) < obj1.size + obj2.width / 2) {
		if (diffX >= 0) {
			return 'left';
		} else {
			return 'right';
		}
	}
	return '';
}
