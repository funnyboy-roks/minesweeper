const size = 50;
class Cell {
	static size = size;

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {boolean} bomb
	 */
	constructor(x, y, bomb) {
		this.x = x;
		this.y = y;
		this.bomb = bomb;
		this.shown = false;
		this.flagged = false;
	}

	show(num) {
		this.surrounding = num;
		if (this.shown) {
			fill(200);
			rect(this.x, this.y, size, size);
			strokeWeight(1);
			if (this.bomb) {
				push();
				ellipseMode(CENTER);
				fill(150);
				ellipse(
					this.x + size / 2,
					this.y + size / 2,
					size / 2,
					size / 2
				);
				pop();
			} else if (num != 0) {
				push();
				fill(0);
				textAlign(CENTER, CENTER);
				strokeWeight(0);
				textSize(16);
				text(num, this.x + size / 2, this.y + size / 2);
				pop();
			} else {
				// no surrounding bombs
			}
		} else {
			fill(255);
			rect(this.x, this.y, size, size);
		}
		if (this.flagged) {
			push();
			noStroke();
			fill(255, 0, 0);
			textAlign(CENTER, CENTER);
			textSize(16);
			text('#', this.x + size / 2, this.y + size / 2);
			pop();
		}
	}

	click() {
		if (this.shown) return false;
		// this.shown = true;
		if (this.bomb) {
			// blow up xP

			for (const row of cells) {
				for (const cell of row) {
					cell.shown = true;
				}
			}
			noLoop();
            stopped = true;
			return false;
		}
		if (getSurrounding(this.x / size, this.y / size) == 0) {
			return true;
		}
		checkWin();
	}

	flag() {
		this.flagged = !this.flagged;
		checkWin();
	}
}
