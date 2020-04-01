// takes user input

var getUserChoice = function () {
	var userChoice = prompt('Do you choose rock, paper, or scissor?');

// if player inputs an invalid input

  while (userChoice !== 'rock' && userChoice !== 'paper' && userChoice !== 'scissor') {
	  if (userChoice === null) {
		  break;
	  }
	  userChoice = prompt('Select again.');
  }
	return userChoice;


}

// function for computer choice

var getComputerChoice = function () {
	// setting up computer choice

	var computerChoice = Math.random();
	console.log('Computer random number: ' + computerChoice);
	if (computerChoice < 0.33) {
		return 'rock';
	} else if (computerChoice > 0.33 && computerChoice < 0.67) {
		return 'paper';
	}else {
		return 'scissor';
	}
}

//compare the two choices

var getWinner = function(userChoice, computerChoice) {
	if (userChoice === computerChoice) {
		return 'draw';
	} else if (computerChoice === 'paper') {
		if (userChoice === 'scissor') {
			return 'player';
		} else if (userChoice === 'rock') {
			return 'computer';
		}
	} else if (computerChoice === 'rock') {
		if (userChoice === 'scissor') {
			return 'computer';
		} else if (userChoice === 'paper') {
			return 'player';
		}
	} else if (computerChoice === 'scissor') {
		if (userChoice === 'rock') {
			return 'player';
		} else if (userChoice === 'paper') {
			return 'computer';
		}
	}
}

// single game function

var singleGame = function() {
	var userChoice = getUserChoice();

	if (userChoice === null) {
		return;
	}

	var computerChoice = getComputerChoice();

	var winner = getWinner(userChoice, computerChoice);

	var message = "You chose " + userChoice + ": computer chose " + computerChoice;
		if (winner === "player") {
			alert(message + "\nYou won!");
		} else if (winner === "computer") {
			alert(message + "\nYou lost!");
		} else {
			alert(message + "\nDraw");
		}

		return winner;
}

var bestOfThree = function() {
	var playerPoints = 0;
	var computerPoints = 0;

	while (playerPoints < 2 && computerPoints <2) {
		var winner = singleGame();
		if (winner === 'player') {
			playerPoints++;
		} else if (winner === 'computer') {
			computerPoints++;
		}
		alert('Player score: ' + playerPoints + ' - Computer Score: ' + computerPoints);

		var message = 'Player score: ' + playerPoints + ' - Computer Score: ' + computerPoints;

		if (playerPoints === 2) {
			alert(message + "\nYou won!");
		} else if (computerPoints === 2) {
			alert(message + "\nComputer won!");
		}

	}
}

var mode = prompt("Type 1 for single mode\n 2 for Best of 3 mode .");
if (mode === '1') {
  singleGame();
} else if (mode === '2') {
  bestOfThree();
}
