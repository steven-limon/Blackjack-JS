Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
};
class Card {
    constructor(rank, suit, value) {
        this.rank = rank;
        this.suit = suit;
        this.value = value;
    }
}
class Hand {
    constructor() {
        this.cards = [];
    }
    addCard(card, game) {
        this.cards.push(card);
        game.addCardPlayer(this.cards.length);
    }
    total() {
        let total = 0;
        let aces = 0;
        for (card of this.cards) {
            if (typeof(card.value) === 'string' && card.value === 'ace')
                aces++;
            else
                total += card.value;
        }
        for (let i = 0; i < aces; i++) {
            if (11 + total > 21)
                total += 1;
            else
                total += 11;
        }
        return total;
    }
}
class DealerHand extends Hand {
    constructor() {
        super();
    }
    static startingHand(upCard, holeCard) {
        this.upCard = upCard;
        this.holeCard = holeCard;
    }
    addCard(card, game) {
        // dont call super, we want to override addCard function
        this.cards.push(card);
        game.addCardDealer(this.cards.length);
        if (this.cards.length === 2)
            startingHand(this.cards[0], this.cards[1]);
    }
}

class Player {
    constructor(hand, wager, balance) {
        this.hand = hand;
        this.wager = wager;
        this.balance = balance;
        this.splitHands = [];
        this.stand = false;
    }
}

class Dealer {
    constructor(hand, hitsUntil) {
        this.hand = hand;
        this.hitsUntil = hitsUntil;
    }
    // dealer logic is fixed. it will draw until it hits a (hitsUntil) which is usually 17. A variant of blackjack has the dealer draw on a soft 17 which I will figure out later
    plays(deck, game) {
        while (this.hand.total() < this.hitsUntil)
            this.hand.addCard(deck.hit(), game);
    }
}

class Deck {
    constructor() {
        this.cards = [];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'];
        const suits = ['diamonds', 'clubs', 'hearts', 'spades'];
        for (const rank of ranks) {
            for (const suit of suits) {
                if (this.rank == 'K' || this.rank == 'Q' || this.rank == 'J')
                    this.cards.push(new Card(rank, suit, 10));
                else if (this.rank == 'A')
                    this.cards.push(new Card(rank, suit, 'ace'));
                else
                    this.cards.push(new Card(rank, suit, Number(rank)));
            }
        }
    }
    hit() {
        return this.cards.pop();
    }
    shuffle() {
        this.cards.shuffle();
    }
}

const hitsUntil = 17;

const game = {
    playerList: [],
    dealer: new Dealer(new DealerHand(), hitsUntil),
    botCount: 0,
    bots: [],
    deck: new Deck(),
    player: new Player(new Hand()),
    init() {
        // add the player and computer to a list of players to make it easier to iterate when dealing each hand, and also to iterate through other players if I decide to have bots playing at the table.
        // this.shuffle(this.deck);
        this.player.balance = prompt("pick starting balance");
        //this.deck = fullDeck.slice().shuffle();
        this.playerList.push(this.player);
        this.setupControls();
        this.round();
    },
    // logic for ending a turn
    /*
      This might look iffy so I'll refactor the logic a little later. Basically at the end of every round I need to check which of the players busted to display loss for each player at the table on reveal of each hand. for a single player i could skip this logic since the player will know immediately when the win. another tricky thing is that this function shouldn't do anything for a player if they got a blackjack. I could have a flag per player so they dont have to check for bust or check for bust unconditionally regardless of outcome. The main thing though to consider in this function is
    */
    //
    push() {
        this.player.balance += this.player.wager;
    },
    payout() {
        if (this.dealer.hand.total() == 21 && this.player.hand.total() != 21)
            return;
        else if (this.dealer.hand.total() == 21 && this.player.hand.total() == 21)
            // this.player.push();
            this.push();
        if (this.player.hand.total() == 21)
            this.player.balance += 1.5 * this.player.wager;
        else if (this.player.hand.total() > this.dealer.hand.total())
            this.player.balance += 2 * this.player.wager;
    },
    endRound() {
        this.dealer.plays(this.deck);
        this.payout();
        const playerHandNode = document.querySelector('#playerHand');
        while (playerHandNode.firstChild)
            playerHandNode.removeChild(playerHandNode.firstChild);
    },
    setupControls() {
        const hitBtn = document.querySelector('#hit');
        const standBtn = document.querySelector('#stand');
        const doubleBtn = document.querySelector('#double');
        hitBtn.addEventListener('click', () => {
            this.player.addCard(this.deck.hit(), this);
        });
        standBtn.addEventListener('click', () => {
            this.player.stand = true;
            this.toggleControls('off');
            // for bots I need to check if the type of a player is a human or bot. when iterating through the player list controls are enabled for the duration of the player turn and some external logic will take care of either proceeding to the dealers play or other bots
            // this.nextPlayer();
            // dealerPlays();
            // displayBusts();
            // add some timers so the game doesnt just instantly end
            this.endRound();
        });
        doubleBtn.addEventListener('click', () => {
            this.player.addCard(this.deck.hit(), game);
            this.toggleControls('off');
            this.player.wager *= 2;
            this.endRound();
            // this.player.doubleDown();
        });
    },
    toggleControls(choice) {
        let state;
        if (choice === 'on')
            state = false;
        else
            state = true;
        const hitBtn = document.querySelector('#hit');
        const standBtn = document.querySelector('#stand');
        const doubleBtn = document.querySelector('#double');

        hitBtn.disabled = state;
        standBtn.disabled = state;
        doubleBtn.disabled = state;
    },
    startPlayerTurn() {
        this.player.stand = false;
        this.toggleControls('on');
    },
    // I need to get rid of the game loop the way I have it since this will cause the browser to hang. THe correct way to do a js game with distinct phases is to not have a traditional game loop but instead to conceive of adding and disabling event handlers to different components of the game depending on our current progression. the progression consists of
    round() {
        this.player.wager = prompt("pick wager", (this.player.balance * .1).toString());
        this.deck = new Deck();
        this.dealHands();
        this.startPlayerTurn();
    },
    addCardPlayer(i) {
        let newCard;
        const playerHandNode = document.querySelector('#playerHand');
        newCard = document.createElement('div');
        newCard.className = 'card';
        this.player.hand.addCard(this.deck.hit(), this);
        newCard.textContent = this.player.hand[i];
        playerHandNode.appendChild(newCard);
    },
    // I need to bring the logic together under one function later
    addCardDealer(i) {
        let newCard;
        const dealerHandNode = document.querySelector('#dealerHand');
        newCard = document.createElement('div');
        newCard.className = 'card';
        this.dealer.hand.addCard(this.deck.hit(), this);
        newCard.textContent = this.dealer.hand[i];
        dealerHandNode.appendChild(newCard);
    },
    dealHands() {
        // deal the first 2 cards
        // this.player.handthis.hit(), this.hit());
        //dom manip
        this.playerList.forEach(player => {
            for (let i = 0; i < 2; i++) {
                this.addCardPlayer(i);
            }
        });
        for (let i = 0; i < 2; i++) {
            this.addCardDealer(i);
        }
        // this.dealer.upCard = this.dealer.hand[0];
        // this.dealer.holeCard = this.dealer.hand[1];
        this.dealer.hand.startingHand(this.dealer.hand[0], this.dealer.hand[1]);
    },
};

//game.player.hand
game.init();
