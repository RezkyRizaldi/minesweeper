export const TILE_STATUSES = {
	HIDDEN: 'hidden',
	MINE: 'mine',
	NUMBER: 'number',
	MARKED: 'marked',
};

export const createBoard = (boardSize, numberOfMines) => {
	const board = [];
	const minePositions = getMinePositions(boardSize, numberOfMines);

	for (let x = 0; x < boardSize; x++) {
		const row = [];

		for (let y = 0; y < boardSize; y++) {
			const element = document.createElement('div');

			element.dataset.status = TILE_STATUSES.HIDDEN;
			element.classList.add('flex', 'h-full', 'w-full', 'select-none', 'items-center', 'justify-center', 'border-2', 'border-gray-400', 'text-white');

			if (element.dataset.status === TILE_STATUSES.MINE) {
				element.classList.add('bg-red-500');
			} else if (element.dataset.status === TILE_STATUSES.NUMBER) {
				element.classList.add('bg-none');
			} else if (element.dataset.status === TILE_STATUSES.MARKED) {
				element.classList.add('bg-yellow-500');
			} else {
				element.classList.add('bg-gray-400', 'cursor-pointer');
			}

			const tile = {
				element,
				x,
				y,
				mine: minePositions.some(positionMatch.bind(null, { x, y })),
				get status() {
					return this.element.dataset.status;
				},
				set status(value) {
					this.element.dataset.status = value;
				},
			};

			row.push(tile);
		}

		board.push(row);
	}

	return board;
};

export const markTile = (tile) => {
	if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
		console.log('masuk');
	}

	if (tile.status === TILE_STATUSES.MARKED) {
		tile.status = TILE_STATUSES.HIDDEN;
		tile.element.classList.remove('bg-yellow-500');
		tile.element.classList.add('bg-gray-400', 'cursor-pointer');
	} else {
		tile.status = TILE_STATUSES.MARKED;
		tile.element.classList.remove('bg-gray-400', 'cursor-pointer');
		tile.element.classList.add('bg-yellow-500');
	}
};

export const revealTile = (board, tile) => {
	if (tile.status !== TILE_STATUSES.HIDDEN) return;

	if (tile.mine) {
		tile.status === TILE_STATUSES.MINE;
		tile.element.classList.remove('bg-gray-400', 'cursor-pointer');
		tile.element.classList.add('bg-red-500');

		return;
	}

	tile.status = TILE_STATUSES.NUMBER;
	tile.element.classList.remove('bg-gray-400', 'cursor-pointer');
	tile.element.classList.add('bg-none');

	const adjacentTiles = nearbyTiles(board, tile);
	const mines = adjacentTiles.filter((t) => t.mine);

	if (mines.length === 0) {
		adjacentTiles.forEach(revealTile.bind(null, board));
	} else {
		tile.element.textContent = mines.length;
	}
};

export const checkWin = (board) => {
	return board.every((row) => row.every((tile) => tile.status !== TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED))));
};

export const checkLose = (board) => {
	return board.some((row) => row.some((tile) => tile.status === TILE_STATUSES.MINE));
};

const getMinePositions = (boardSize, numberOfMines) => {
	const positions = [];

	while (positions.length < numberOfMines) {
		const position = {
			x: randomNumber(boardSize),
			y: randomNumber(boardSize),
		};

		if (!positions.some(positionMatch.bind(null, position))) {
			positions.push(position);
		}
	}

	return positions;
};

const positionMatch = (a, b) => {
	return a.x === b.x && a.y === b.y;
};

const randomNumber = (size) => {
	return Math.floor(Math.random() * size);
};

const nearbyTiles = (board, { x, y }) => {
	const tiles = [];

	for (let xOffset = -1; xOffset <= 1; xOffset++) {
		for (let yOffset = -1; yOffset <= 1; yOffset++) {
			const tile = board[x + xOffset]?.[y + yOffset];

			if (tile) {
				tiles.push(tile);
			}
		}
	}

	return tiles;
};
