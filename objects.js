const BAR_WIDTH  = 160;
const BAR_HEIGHT = 15;
const BAR_COLOR  = '#808080';

function Bar() {
	this.position = new Point();
	this.width = 0;
	this.height = 0;
	this.color = '';
	this.shape = 'rect';
}

Bar.prototype.init = function () {
	this.width = BAR_WIDTH;
	this.height = BAR_HEIGHT;
	this.color = BAR_COLOR;
};

const BALL_SIZE  = 10;
const BALL_SPEED = 10;
const BALL_COLOR = '#808080';

function Ball() {
	this.position = new Point();
	this.vector = new Point();
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

Ball.prototype.set = function (position, vector) {
	this.position.x = position.x;
	this.position.y = position.y;
	vector.normalize();
	this.vector.x = vector.x;
	this.vector.y = vector.y;
};

Ball.prototype.move = function () {
	// move the position based on the speed
	this.position.x += this.vector.x * this.speed;
	this.position.y += this.vector.y * this.speed;

	// change the direction on hitting the wall
	if ((this.position.x - this.size < 0 && this.vector.x < 0) || (this.position.x + this.size > screen.width && this.vector.x > 0)) {
		this.vector.x *= -1;
	}
	if (this.position.y  -this.size < INFO_HEIGHT - 3 && this.vector.y < 0) {
		this.vector.y *= -1;
	}

	// put down the alive flag on reaching a certain coordinate
	if (this.position.y - this.size > screen.height) {
		fire = false;
		this.life--;
		bar.init(BAR_WIDTH, BAR_HEIGHT, BAR_COLOR);
		ball.init(BALL_SIZE, BALL_SPEED, BALL_COLOR);
		for (i = 0; i < items.length; i++) {
			items[i].alive = false;
		}
	}
	
};

//block
var blockArrange = [
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

const BLOCK_WIDTH  = 37;
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

Block.prototype.init = function (position) {
	this.position.x = position.x;
	this.position.y = position.y;
	this.width = BLOCK_WIDTH;
	this.height = BLOCK_HEIGHT;
}

Block.prototype.set = function (level, row, col) {
	level -= 1;
	if (blockArrange[level][row][col] !== 0) {
		this.alive = true;
		this.life = blockArrange[level][row][col];
		this.score = blockArrange[level][row][col] * 10;
		switch (blockArrange[level][row][col]) {
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

// item
var itemTypes = [
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
function judge (obj1, obj2) {
	var differenceX = obj2.position.x - obj1.position.x;
	var differenceY = obj2.position.y - obj1.position.y;

	if ( // top and bottom
		Math.abs(differenceX) <= obj2.width / 2
		) {
		if ( // top
			differenceY <= obj2.height / 2 + obj1.size &&
			differenceY >= 0
			) {
			return 'upper';

		} else if ( // bottom
			- differenceY <= obj2.height / 2 + obj1.size &&
			- differenceY >= 0
			) {
			return 'lower';
		}

	} else if ( // side
		Math.abs(differenceY) <= obj2.height / 2
		) {

		if ( // left
			differenceX <= obj2.width / 2 + obj1.size &&
			differenceX >= 0
			) {
			return 'left';

		} else if ( // right
			- differenceX <= obj2.width / 2 + obj1.size &&
			- differenceX >= 0
			) {
			return 'right';
		}
	}
	return false;
}
