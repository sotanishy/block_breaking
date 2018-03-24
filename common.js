function Point(x, y) {
	this.x = 0;
	this.y = 0;
}

Point.prototype.length = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.normalize = function () {
	let l = this.length();
	if (l > 0) {
		this.x /= l;
		this.y /= l;
	}
};
