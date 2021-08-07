/**
 * @type {Cell[][]}
 */
const cells = [];
let canvas;
let bombs = 0;
let stopped = false;

const rows = 10;
const cols = 10;
function setup() {
	canvas = createCanvas(rows * Cell.size, cols * Cell.size);
	document.querySelector('#game').appendChild(canvas.elt);

	for (let x = 0; x < width; x += Cell.size) {
		const arr = [];
		for (let y = 0; y < height; y += Cell.size) {
			const bomb = Math.random() < 0.2;
			arr.push(new Cell(x, y, bomb));
			if (bomb) ++bombs;
		}
		cells.push(arr);
	}

	// Load images

	// Bomb: https://image.spreadshirtmedia.net/image-server/v1/mp/designs/11510420,width=178,height=178/pixel-bomb-bombe-explosion.png
	Cell.bombImg = loadImage('./bomb.png');
	// Flag: https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/25fdbd5620205f0.png
	Cell.flagImg = loadImage('./flag.png');
}

function draw() {
	background(100);
	for (const row of cells) {
		for (const cell of row) {
			const surrounding = getSurrounding(
				cell.x / Cell.size,
				cell.y / Cell.size
			);
			cell.show(surrounding);
		}
	}

	stroke(125);
	strokeWeight(0.5);
	for (let x = 0; x < width; x += Cell.size) {
		line(x, 0, x, height);
	}
	for (let y = 0; y < height; y += Cell.size) {
		line(0, y, width, y);
	}

	if (stopped) {
		let fs = 0;
		let bs = 0;
		for (const row of cells) {
			for (const cell of row) {
				if (cell.flagged && cell.bomb) ++fs;
				if (cell.bomb) ++bs;
			}
		}
		const percent = Math.round(100 * (fs / bs));
		document.querySelector(
			'#instructions'
		).innerHTML += `<br>Flagged ${percent}%`;
		noLoop();
	}
}

function mousePressed(e) {
	if (mouseButton === LEFT) {
		const cell =
			cells[Math.floor(mouseX / Cell.size)][
				Math.floor(mouseY / Cell.size)
			];
		if (!cell) return;
		if (cell.click()) {
			floodFill(
				Math.floor(mouseX / Cell.size),
				Math.floor(mouseY / Cell.size)
			);
		} else {
			if (cell.flagged) {
				cell.flagged = false;
			} else {
				cell.shown = true;
			}
		}
	} else if (mouseButton === RIGHT) {
		const cell =
			cells[Math.floor(mouseX / Cell.size)][
				Math.floor(mouseY / Cell.size)
			];
		if (!cell) return;
		cell.flag();
	}
	let flags = 0;
	for (const row of cells) {
		for (const cell of row) {
			if (cell.flagged) ++flags;
		}
	}
	if (!stopped) {
		document.querySelector('#instructions').innerHTML = `${bombs} bomb${
			bombs == 1 ? '' : 's'
		}<br>${flags} flag${flags == 1 ? '' : 's'}`;
	}
}

function getSurrounding(x, y) {
	let count = 0;
	for (let i = -1; i <= 1; ++i) {
		for (let j = -1; j <= 1; ++j) {
			if (i === 0 && j === 0) continue;
			try {
				const cell = cells[i + x][j + y];
				if (cell.bomb) ++count;
			} catch (e) {
				continue;
			}
		}
	}
	return count;
}

function floodFill(x, y) {
	let cell;
	try {
		cell = cells[x][y];
	} catch (e) {
		return;
	}
	if (!cell) return;
	if (cell?.shown) return;
	cell.shown = true;
	if (!cell?.bomb && cell?.surrounding === 0) {
		console.log('Recurring');
		for (let i = -1; i <= 1; ++i) {
			for (let j = -1; j <= 1; ++j) {
				if (i === 0 && j === 0) continue;
				floodFill(x + i, y + j);
			}
		}
	}
}

function checkWin() {
	let flags = 0;
	let bombs = 0;
	for (const row of cells) {
		for (const cell of row) {
			if (cell.flagged) ++flags;
			if (cell.bomb) ++bombs;
		}
	}
	if (flags === bombs) {
		stopped = true;
		for (const row of cells) {
			for (const cell of row) {
				cell.shown = true;
			}
		}
	}
}
