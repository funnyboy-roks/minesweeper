const size = 50;

const textColors = [
	'#15ff00',
	'#91f500',
	'#c6ea00',
	'#eedf00',
	'#ffca00',
	'#ffa800',
	'#ff7b00',
	'#ff0000',
];
class Cell {
	static size = size;
	static bombImg;
	static flagImg;

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
		const imgPadding = 5;
		this.surrounding = num;
		if (this.shown) {
			if (!stopped) {
				this.flagged = false;
			}
			fill(200);
			strokeWeight(1);
			if (this.bomb) {
				image(
					Cell.bombImg,
					this.x + imgPadding,
					this.y + imgPadding,
					size - imgPadding * 2,
					size - imgPadding * 2
				);
			} else if (num != 0) {
				push();
				fill(textColors[num - 1]);
				textAlign(CENTER, CENTER);
				strokeWeight(0);
				textSize(16);
				text(num, this.x + size / 2, this.y + size / 2);
				pop();
			} else {
				// no surrounding bombs
			}
		} else {
			fill('#555');
			rect(this.x, this.y, size, size);
		}
		if (this.flagged) {
			image(
				Cell.flagImg,
				this.x + imgPadding,
				this.y + imgPadding,
				size - imgPadding * 2,
				size - imgPadding * 2
			);
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
