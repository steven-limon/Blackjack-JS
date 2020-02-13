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
    addCard(card) {
        this.cards.push(card);
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
    constructor(upCard, holeCard) {
        super(upCard, holeCard);
        this.upCard = upCard;
        this.holeCard = holeCard;
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
    plays(deck) {
        if (this.hand.total() < this.hitsUntil)
            this.hand.addCard(deck.hit());
    }
}

class Deck {
    constructor() {
        this.cards = [];
        for (rank of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A']) {
            for (suit of ['diamonds', 'clubs', 'hearts', 'spades']) {
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
        return this.deck.pop();
    }
    shuffle() {
        this.cards.shuffle();
    }
}

// const fullDeck = [];
// for (rank of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A']) {
//     for (suit of ['diamonds', 'clubs', 'hearts', 'spades']) {
//         if (this.rank == 'K' || this.rank == 'Q' || this.rank == 'J')
//             fullDeck.push(new Card(rank, suit, 10));
//         else if (this.rank == 'A')
//             fullDeck.push(new Card(rank, suit, 'ace'));
//         else
//             fullDeck.push(new Card(rank, suit, Number(rank)));
//     }
// }

const hitsUntil = 17;

const game = {
    playerList: [],
    computer: new Dealer(new DealerHand(), hitsUntil),
    botCount: 0,
    bots: [],
    deck: new Deck(),
    player: new Player(new Hand()),
    init() {
        // add the player and computer to a list of players to make it easier to iterate when dealing each hand, and also to iterate through other players if I decide to have bots playing at the table.
        // this.shuffle(this.deck);
        this.player.balance = prompt("pick starting balance");
        this.player.wager = prompt("pick wager");
        //this.deck = fullDeck.slice().shuffle();
        this.playerList.push(this.player);
        this.round();
    },
    // logit for ending a turn
    /*
      This might look iffy so I'll refactor the logic a little later. Basically at the end of every round I need to check which of the players busted to display loss for each player at the table on reveal of each hand. for a single player i could skip this logic since the player will know immediately when the win. another tricky thing is that this function shouldn't do anything for a player if they got a blackjack. I could have a flag per player so they dont have to check for bust or check for bust unconditionally regardless of outcome. The main thing though to consider in this function is
    */
    //
    push() {
        this.balance += this.player.lastWager;
    },
    payout() {
        if (this.dealer.hand.total() == 21 && this.player.hand.total() != 21)
            return;
        else if (this.dealer.hand.total() == 21 && this.player.hand.total() == 21)
            player.push();
        if (player.total() == 21)
            player.balance += 1.5 * player.lastWager;
        else if (this.player.hand.total() > this.dealer.hand.total())
            this.player.balance += 2 * this.player.lastWager;
    },
    hitOrBust() {
        // TODO add an event listener to my button. if they are hit during this function waiting for them then
    },
    setupControls() {
        const hitBtn = document.querySelector('.hit');
        const standBtn = document.querySelector('.stand');
        const doubleBtn = document.querySelector('.double');
        hitBtn.addEventListener('click', () => {
            this.player.addCard(this.hit());
        });
        standBtn.addEventListener('click', () => {
            this.player.doubleDown(this.hit());
        });
        doubleBtn.addEventListener('click', () => {
            this.player.stand = true;
            this.toggleControls('off');
            // this.nextPlayer();
            this.dealer.plays(this.deck);
        });
    },
    toggleControls(choice) {
        let state;
        if (choice === 'on')
            state = false;
        else
            state = true;
        const hitBtn = document.querySelector('.hit');
        const standBtn = document.querySelector('.stand');
        const doubleBtn = document.querySelector('.double');

        hitBtn.disabled = state;
        standBtn.disabled = state;
        Btn.disabled = state;
    },
    startPlayerTurn() {
        this.player.stand = false;
        toggleControls('on');
        if (this.player.stand)
            console.log('idk');
            // this.player.disableControls();
        // think of a better name for the below function. a user turn consists of hits until stand of bust.
        hitOrBust();
    },
    // I need to get rid of the game loop the way I have it since this will cause the browser to hang. THe correct way to do a js game with distinct phases is to not have a traditional game loop but instead to conceive of adding and disabling event handlers to different components of the game depending on our current progression. the progression consists of
    round() {
        this.deck = new Deck();
        this.dealHands();
        this.startPlayerTurn();
        // dealerPlays();
        // displayBusts();
        // payout();
    },
    dealHands() {
        // deal the first 2 cards
        // this.player.handthis.hit(), this.hit());
        //dom manip
        const playerHandNode = document.querySelector('#playerHand');
        let newCard;
        players.foreach(player => {
            for (let i = 0; i < 2; i++) {
                newCard = document.createElement('div');
                this.player.hand.addCard(this.hit());
                newCard.innerText = this.player.hand[i];
                playerHandNode.appendChild(newCard);
            }
        });
    },

};

//game.player.hand
game.init();
