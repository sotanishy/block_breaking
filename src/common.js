/**
 * Declares objects and functions commonly used in the program.
 *
 * @author Sota Nishiyama
 */

/**
 * Class that represents a point or a vector. 
 */
class Point {
   constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
   normalize() {
        let l = Math.sqrt(this.x * this.x + this.y * this.y);

        if (l > 0) {
            this.x /= l;
            this.y /= l;
        }
    }
}

/**
 * Returns the location at which the obj1 hits the obj2. The location is 'top', 'bottom', 'left', or 'right'.
 *
 * @param obj1  Has to be a circular object such as Ball or Item
 * @param obj2  Has to be a rectangular object such as Bar or Block
 * 
 * @return {String} location at which the obj1 hits the obj2
 */
function getCollisionLocation(obj1, obj2) {
	let diffX = obj2.position.x - obj1.position.x;
	let diffY = obj2.position.y - obj1.position.y;

	if (Math.abs(diffX) <= obj2.width / 2 && Math.abs(diffY) <= obj1.size + obj2.height / 2) {
		if (diffY >= 0) {
			return 'top';
		} else {
			return 'bottom';
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
