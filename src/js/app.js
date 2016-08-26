(function () {

	var app = {
		player: null,
		allEnemies: [],
		numCols: constants.DEFAULT_NUM_COLS,
		numRows: constants.DEFAULT_NUM_ROWS,
		playerImage: constants.DEFAULT_PLAYER_IMAGE,
		numEnemies: constants.DEFAULT_NUM_ENEMIES,
		isGameOver: false
	};

	app.maxNumCols = parseInt(window.innerWidth / constants.COL_SIZE, 10);
	app.maxNumRows = parseInt(window.innerHeight / constants.ROW_SIZE, 10);
	app.minNumCols = constants.MIN_NUM_COLS;
	app.minNumRows = constants.MIN_NUM_ROWS;

	app.canvasWidth = constants.COL_SIZE * app.numCols;
	app.canvasHeight = constants.ROW_SIZE * app.numRows + 83;

	app.Enemy = function () {
		this.x = 0;
		var numEnemyLines = app.numRows - 3; // Two lines for Player and one line for river.
		var randomRow = Math.floor(Math.random() * numEnemyLines) + 1; // Add one more for the water row.
		this.y = randomRow * constants.ROW_SIZE;
		this.speed = Math.floor(((Math.random() * 100) % 4 + 1) * 50); // Assume that there are 4 different speeds.
		this.sprite = 'images/enemy-bug.png';
	};

	// Parameter: dt, a time delta between ticks
	app.Enemy.prototype.update = function (dt) {
		this.x = this.x + Math.floor(this.speed * dt);
		if (this.x > app.canvasWidth) {
			this.x = 0;
			var numEnemyLines = app.numRows - 3; // Two lines for Player and one line for river.
			var randomRow = Math.floor(Math.random() * numEnemyLines) + 1; // Add one more for the water row.
			this.y = randomRow * constants.ROW_SIZE;
		}
	};

	app.Enemy.prototype.render = function () {
		app.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	};

	app.Enemy.prototype.collide = function () {
		if (app.player.row != this.y / constants.ROW_SIZE)
			return false;
		else if ((this.x >= (app.player.x - constants.COL_SIZE + constants.PLAYER_MARGIN)) && (this.x <= (app.player.x + constants.COL_SIZE - constants.PLAYER_MARGIN)))
				return true;
			else
				return false;
	};

	app.Player = function (image) {
		this.col = Math.round(app.numCols / 2);
		this.row = app.numRows - 1;
		this.sprite = image;
	};

	app.Player.prototype.update = function () {
		this.x = this.col * constants.COL_SIZE;
		this.y = this.row * constants.ROW_SIZE;
	};

	app.Player.prototype.handleInput = function (direction) {
		switch (direction) {
			case 'left':
				this.col = this.col - 1;
				break;
			case 'up':
				this.row = this.row - 1;
				break;
			case 'right':
				this.col = this.col + 1;
				break;
			case 'down':
				this.row = this.row + 1;
				break;
		}
		this.col = (this.col + app.numCols) % app.numCols;
		if (this.row > app.numRows) this.row = app.numRows;
	};

	app.Player.prototype.render = function () {
		app.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	};

	app.characterCreate = function() {
		app.player = new app.Player(app.playerImage);
		app.allEnemies = [];
		for (var i = 0; i < app.numEnemies; i++) {
			app.allEnemies.push(new app.Enemy());
		}
	};

	app.characterCreate();
	
	// This listens for key presses and sends the keys to the
	// Player.handleInput() method.
	document.addEventListener('keyup', function (e) {
		var allowedKeys = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};
		app.player.handleInput(allowedKeys[e.keyCode]);
	});
	window.app = app;
}());
