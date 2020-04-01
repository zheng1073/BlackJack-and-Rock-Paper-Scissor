var BlackJack = function () {

  //makes deck
  this.createDeck = function () {
    var faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    var suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];

    var deck = suits.map(function (suit) {
      return faces.map(function (face) {
        return {
          face: face,
          suit: suit
        }
      });
    }).reduce(function (deck, suits) {
      return deck.concat(suits);
    }, []);
    return deck;
  }


  //iniatite deck
  this.deck = this.createDeck();
  this.playerHand = [];
  this.dealerHand = [];
  this.roundCounter = 0;
  this.balance = 100;
  this.betSize = 0;


  this.bet = function () {
    this.betSize = Number(prompt('Enter bet amount? Minimum is $10. Maximum is $' + this.balance + '. Bets can be increased in increments of $10.', ''));
    if (this.betSize >= 10 && (this.betSize - 10) % 10 === 0 && this.betSize <= this.balance) {
      this.configureForNewRound();
      this.startRound();
    } else {
      this.bet();
    }
  };

  this.configureForNewRound = function () {
    this.deck = this.createDeck();
    this.playerHand = [];
    this.dealerHand = [];
    this.roundCounter++;
    this.balance -= this.betSize;
  }


//return value of card
  this.getHandValue = function (cards) {
    var cardValues = cards.map(function (card) {
      switch (card.face) {
        case 'J':
        case 'Q':
        case 'K':
          return 10;
          break;
        case 'A':
          return 11;
        default:
          return Number(card.face);
      }
    });
    var value = cardValues.reduce(function (acc, value) {return acc + value}, 0);
    var indexOfA = cardValues.indexOf(11);

    //determine if A is 11 or 1
    while (value > 21 && indexOfA !== -1) {
      cardValues[indexOfA] = 1;
      value = value - 10;
      indexOfA = cardValues.indexOf(11);
    }
    return value;
  }

  this.dealCard = function (hand) {
    var index = Math.floor(Math.random() * this.deck.length);
    var newCard = this.deck[index];
    this.deck = this.deck.slice(0, index).concat(this.deck.slice(index + 1));
    hand.push(newCard);

    return newCard;
  }

  this.newRoundOrNot = function () {
    var choice;
    if (this.balance > 10) {
      choice = confirm('You can start your Round ' + String(this.roundCounter + 1) + ' with bet size between $10 and $' + this.balance + ' and with $10 increments. ' + '\nClick OK to continue or click Cancel to cash out.');
    } else if (this.balance === 10) {
      choice = confirm('Click OK to start a new round with a bet size of $10 or click Cancel to exit.');
    } else {
      return alert("You don't have enough to continue.");
    }

    if (choice) {
      this.bet();
    } else {
      alert('Your balance is $' + this.balance + '.');
    }
  };

  this.getCardsInString = function (cards) {
    return cards.map(function (card) {
      return card.face + ' of ' + card.suit;
    })
  }

  this.currentRoundEnds = function (result) {
    var that = this;
    var message = {
      'player won': function () {
        that.balance += 2 * that.betSize;
        alert('You won. New balance: $' + that.balance + '.');
      },
      'player lost': function () {
        alert('You lost. New balance $' + that.balance + '.');
      },
      'push': function () {
        that.balance += that.betSize;
        alert('It\'s a push. Current balance: $' + that.balance + '.');
      }
    };

    var playerHandValue = this.getHandValue(this.playerHand);
    var playerHandString = this.getCardsInString(this.playerHand).join('\n');
    var dealerHandValue = this.getHandValue(this.dealerHand);
    var dealerHandString = this.getCardsInString(this.dealerHand).join('\n');

    alert('Summarizing the game...\n\nPlayer\'s hand value: ' + playerHandValue + '\nPlayer\'s card summary:\n' + playerHandString + '\n\nDealer\'s hand value: ' + dealerHandValue + '\nDealer\'s card summary:\n' + dealerHandString);
    message[result]();
    this.newRoundOrNot();
  };

  this.playerTurn = function () {
    var playerHandValue = this.getHandValue(this.playerHand);
    var dealerFaceUpValue = this.getHandValue(this.dealerHand) - this.getHandValue([this.dealerHand[0]]);

    var choice = confirm('Click Cancel to stand or click OK to hit.\n\n[Reminder]\nPlayer\'s hand value: ' + playerHandValue + '\nDealer\'s faced up hand value: ' + String(dealerFaceUpValue));

    if (choice) {
      var newCard = this.dealCard(this.playerHand);
      playerHandValue = this.getHandValue(this.playerHand);
      alert('Player\'s new card: ' + this.getCardsInString([newCard]).join('') + '\nPlayer\'s card summary:\n' + this.getCardsInString(this.playerHand).join('\n') + '\n\nPlayer\'s hand value: ' + playerHandValue + '\nDealer\'s faced up hand value: ' + String(dealerFaceUpValue));
      if (playerHandValue === 21) {
        return this.currentRoundEnds('player won');
      } else if (playerHandValue > 21) {
        return this.currentRoundEnds('player lost');
      } else {
        this.playerTurn();
      }
    } else {
      this.dealerTurn();
    }
  };

  this.dealerTurn = function () {
    var dealerHandValue = this.getHandValue(this.dealerHand);
    var playerHandValue = this.getHandValue(this.playerHand);

    if (dealerHandValue > 16) {
      if (dealerHandValue > 21 || dealerHandValue < playerHandValue) {
        return this.currentRoundEnds('player won');
      } else if (dealerHandValue > playerHandValue) {
        return this.currentRoundEnds('player lost');
      } else {
        return this.currentRoundEnds('push');
      }
    } else {
      var newCard = this.dealCard(this.dealerHand);
      var dealerHandValue = this.getHandValue(this.dealerHand);
      alert('Dealt a new card to Dealer. Now Dealer has ' + this.dealerHand.length + ' cards. Dealer\'s hand value: ' + dealerHandValue + '.\n\n[Reminder]\nPlayer in stand position. Player\'s hand value: ' + playerHandValue + '.\nPlayer\'s card summary:\n' + this.getCardsInString(this.playerHand).join('\n'));
      this.dealerTurn();
    }
  };

  this.startRound = function () {
    this.dealCard(this.playerHand);
    this.dealCard(this.dealerHand);
    this.dealCard(this.playerHand);
    this.dealCard(this.dealerHand);

    alert('Player\'s first two cards: ' + this.getCardsInString([this.playerHand[0]]).join('') + ' and ' + this.getCardsInString([this.playerHand[1]]).join('') + '\n\nDealer\'s sided up card: ' + this.getCardsInString([this.dealerHand[1]]).join(''));

    var playerHandValue = this.getHandValue(this.playerHand);
    var dealerHandValue = this.getHandValue(this.dealerHand);

    if (playerHandValue === 21 || dealerHandValue === 21) {
      if (playerHandValue === dealerHandValue) {
        alert('Well, you and dealer both got blackjack.');
        return this.currentRoundEnds('push');
      } else if (playerHandValue > dealerHandValue) {
        alert('Wow! You got blackjack.');
        return this.currentRoundEnds('player won');
      } else {
        alert('Dealer got blackjack.');
        return this.currentRoundEnds('player lost');
      }
    }

    this.playerTurn();
  };
}

var game = new BlackJack()
game.bet();
