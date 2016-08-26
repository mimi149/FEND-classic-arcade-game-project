/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on the player and enemy objects (defined in app.js).
 */

var Engine = (function (global) {
	/* Predefine the variables we'll be using within this scope,
	 * create the canvas element, grab the 2D context for that canvas
	 * set the canvas elements height/width and add it to the DOM.
	 */
	var doc = global.document,
		win = global.window,
		canvas = doc.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		lastTime;

	canvas.width = app.canvasWidth;
	canvas.height = app.canvasHeight;
	doc.body.appendChild(canvas);

	/* This function serves as the kickoff point for the game loop itself
	 * and handles properly calling the update and render methods.
	 */
	function main() {
		/* Get our time delta information which is required if the game
		 * requires smooth animation. Because everyone's computer processes
		 * instructions at different speeds we need a constant value that
		 * would be the same for everyone (regardless of how fast their
		 * computer is) - hurray time!
		 */
		var now = Date.now(),
			dt = (now - lastTime) / 1000.0;

		update(dt);
		render();
		/* Set our lastTime variable which is used to determine the time delta
		 * for the next time this function is called.
		 */
		lastTime = now;

		/* Use the browser's requestAnimationFrame function to call this
		 * function again as soon as the browser is able to draw another frame.
		 */
		if (!app.isGameOver)
			win.requestAnimationFrame(main);
	}

	function update(dt) {
		updateEntities(dt);
		if (!checkCollisions())
			checkWin();
	}

	function updateEntities(dt) {
		app.allEnemies.forEach(function (enemy) {
			enemy.update(dt);
		});
		app.player.update();
	}

	function render() {
		var rowImages = ['images/water-block.png']; // Top row is water.

		var numEnemyLines = app.numRows - 3; // Two lines for Player and one line for river.
		for (var i = 0; i < numEnemyLines; i++)         // Rows of stones.
			rowImages.push('images/stone-block.png');

		rowImages.push('images/grass-block.png');   // Rows of grass.
		rowImages.push('images/grass-block.png');

		for (var row = 0; row < app.numRows; row++) {
			for (var col = 0; col < app.numCols; col++) {
				ctx.drawImage(Resources.get(rowImages[row]), col * constants.COL_SIZE, row * constants.ROW_SIZE);
			}
		}
		if (!app.isGameOver) {
			renderEntities();
		}
	}

	function renderEntities() {
		app.allEnemies.forEach(function (enemy) {
			enemy.render();
		});

		app.player.render();
	}

	Resources.load([
		'images/stone-block.png',
		'images/water-block.png',
		'images/grass-block.png',
		'images/enemy-bug.png',
		'images/char-boy.png',
		'images/char-cat-girl.png',
		'images/char-horn-girl.png',
		'images/char-pink-girl.png',
		'images/char-princess-girl.png'
	]);

	function init() {
		lastTime = Date.now();
		main();
	}

	function checkCollisions() {
		for (var i = 0; i < app.numEnemies; i++) {
			if (app.allEnemies[i].collide()) {
			    gameOver("failed");
				return true;
			}
		}
		return false;
	}

	function checkWin() {
		if (app.player.row < 0)
		    gameOver("won");
	}

	function gameOver(result) {
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		app.isGameOver = true;
		if (result === "won")
			doc.querySelector("#myModalLabel").innerHTML = "<h1>Congratulations! You won! </h1><h3>Play again?</h3>";
		else
			doc.querySelector("#myModalLabel").innerHTML = "<h1>Game over! </h1><h3>Play again?</h3>";

		$("#myModal").modal('show');
		setTimeout(init, 1000);
	}

	app.reset = function () {
		var numRows = parseInt(document.getElementById("numRows").value, 10);
		var numCols = parseInt(document.getElementById("numCols").value, 10);
		var numEnemies = parseInt(document.getElementById("numEnemies").value, 10);

		if (!isNaN(numRows))
			app.numRows = numRows;
		if (!isNaN(numCols))
			app.numCols = numCols;
		if (!isNaN(numEnemies))
			app.numEnemies = numEnemies;

		if (app.numRows > app.maxNumRows) app.numRows = app.maxNumRows;
		if (app.numRows < app.minNumRows) app.numRows = app.minNumRows;

		if (app.numCols > app.maxNumCols) app.numCols = app.maxNumCols;
		if (app.numCols < app.minNumCols) app.numCols = app.minNumCols;

		if (app.numEnemies < 0) app.numEnemies = 0;

		app.canvasWidth = constants.COL_SIZE * app.numCols;
		app.canvasHeight = constants.ROW_SIZE * app.numRows + 83;
		canvas.width = app.canvasWidth;
		canvas.height = app.canvasHeight;

		$("#myModal").modal('hide');

		app.characterCreate();
		app.isGameOver = false;
	};

	Resources.onReady(init);

	app.ctx = ctx;

})(this);
