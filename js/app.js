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
class Deck {
    constructor() {
        this.cards = [];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'];
        const suits = ['diamonds', 'clubs', 'hearts', 'spades'];
        for (const rank of ranks) {
            for (const suit of suits) {
                if (rank == 'K' || rank == 'Q' || rank == 'J')
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
class Hand {
    constructor(handNode) {
        this.cards = [];
        this.handNode = handNode;
    }
    addCard(card, hide = false) {
        let newCard;
        newCard = document.createElement('div');
        newCard.className = 'card';
        if (hide === true) {
            newCard.style.backgroundColor = 'black';
            newCard.id = 'hole';
        }
        newCard.textContent = card.rank + ' ' + card.suit;
        this.cards.push(card);
        this.handNode.appendChild(newCard);
    }
    total() {
        let total = 0;
        let aces = 0;
        for (let card of this.cards) {
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
    clear() {
        while (this.handNode.firstChild)
            this.handNode.removeChild(this.handNode.firstChild);
    }
}
class DealerHand extends Hand {
    constructor(handNode) {
        super(handNode);
    }
    static startingHand(upCard, holeCard) {
        this.upCard = upCard;
        this.holeCard = holeCard;
    }
    addCard(card) {
        if (this.cards.length === 0)
            super.addCard(card, true);
        else
            super.addCard(card);
        /* broken
        if (this.cards.length === 2) {
            this.startingHand(super.cards[0], super.cards[1]);
        }
        */
    }
}
class Player {
    constructor(wager, balance) {
        // this.hand = hand;
        // consider having the reset method reset the wager. the wager should be set to the minimum of the table
        this.reset();
        this.wager = wager;
        this.balance = balance;
        // this.splitHands = [];
    }
    endHand() {
        this.hand.clear();
    }
    reset() {
        this.hand = new Hand(document.querySelector('#playerHand'));
    }
}
class Dealer {
    constructor(hitsUntil) {
        this.hitsUntil = hitsUntil;
        this.reset();
    }
    // dealer logic is fixed. it will draw until it hits a (hitsUntil) which is usually 17. A variant of blackjack has the dealer draw on a soft 17 which I will figure out later
    reset() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new DealerHand(document.querySelector('#dealerHand'));
    }
    plays(deck) {
        let holeCardEl = document.querySelector('#hole');
        holeCardEl.style.backgroundColor = 'white';
        while (this.hand.total() < this.hitsUntil)
            this.hand.addCard(this.deck.hit());
    }
    deals() {
        // this.deck.pop();
        return this.deck.hit();
    }
    dealHands(playerList) {
        // deal the first 2 cards
        // this.player.handthis.hit(), this.hit());
        //dom manip
        playerList.forEach(player => {
            for (let i = 0; i < 2; i++) {
                //this.addCardPlayer(i);
                player.hand.addCard(this.deals());
            }
        });
        for (let i = 0; i < 2; i++) {
            this.hand.addCard(this.deals());
        }
        // this.dealer.upCard = this.dealer.hand[0];
        // this.dealer.holeCard = this.dealer.hand[1];
        // this.dealer.hand.startingHand(this.dealer.hand[0], this.dealer.hand[1]);
    }
    endHand() {
        this.hand.clear();
        // weirdly enough there is no need to explicitly clear out the deck and hand since on reset we will replace those values, just need to clear the nodes that held the card info
        // while (playerHandNode.firstChild)
        //     playerHandNode.removeChild(playerHandNode.firstChild);
    }
}

const hitsUntil = 17;
const game = {
    playerList: [],
    dealer: new Dealer(hitsUntil),
    botCount: 0,
    bots: [],
    player: new Player(),
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
    result: "",
    payout() {
        if (this.dealer.hand.cards[0] + this.dealer.hand.cards[1] == 21 && this.player.hand.total() != 21) {
            this.result = "Dealer has a blackjack, player loses";
            return;
        }
        else if ((this.dealer.hand.cards[0] + this.dealer.hand.cards[1]) == 21 == 21 && (this.player.hand.cards[0] + this.player.hand.cards[1]) == 21) {
            // this.player.push();
            this.result = "Dealer and player both show blackjack. Push.";
            this.push();
        }
        if (this.player.hand.total() == 21) {
            this.player.balance += 1.5 * this.player.wager;
            this.result = "Player wins by blackjack";
        }
        else if (this.player.hand.total() > this.dealer.hand.total()) {
            this.player.balance += 2 * this.player.wager;
            this.result = "Player wins";
        }
        // order matters for the next 2 conditions
        else if (this.player.hand.total() > 21)
            this.result = "Player busts";
        else if (this.dealer.hand.total() > 21) {
            this.player.balance += 2 * this.player.wager;
            this.result = "Dealer busts. Player wins";
        }
        else {
            this.result = "Player Loses";
        }
    },
    endRound() {
        // this.dealer.plays(this.deck);
        this.dealer.plays();
        this.payout();
        game.showStats();
    },
    setupControls() {
        const hitBtn = document.querySelector('#hit');
        const doubleBtn = document.querySelector('#double');
        const standBtn = document.querySelector('#stand');
        hitBtn.addEventListener('click', () => {
            this.player.hand.addCard(this.dealer.deals());
            if (this.player.hand.total() > 21) {
                this.toggleControls('off');
                this.endRound();
            }
        });
        standBtn.addEventListener('click', () => {
            this.toggleControls('off');
            this.endRound();
        });
        doubleBtn.addEventListener('click', () => {
            this.player.hand.addCard(this.dealer.deals());
            this.toggleControls('off');
            this.player.balance -= this.player.wager;
            this.player.wager *= 2;
            this.endRound();
        });

        const againBtn = document.querySelector('#again');
        againBtn.addEventListener('click', () => {
            this.player.endHand();
            this.dealer.endHand();
            this.round();
        });
    },
    toggleControls(choice) {
        let state;
        if (choice === 'on')
            state = false;
        else
            state = true;
        const hitBtn = document.querySelector('#hit');
        const doubleBtn = document.querySelector('#double');
        const standBtn = document.querySelector('#stand');

        hitBtn.disabled = state;
        doubleBtn.disabled = state;
        standBtn.disabled = state;

        const againBtn = document.querySelector('#again');
        againBtn.disabled = !state;
    },
    startPlayerTurn() {
        this.player.stand = false;
        this.toggleControls('on');
    },
    // I need to get rid of the game loop the way I have it since this will cause the browser to hang. THe correct way to do a js game with distinct phases is to not have a traditional game loop but instead to conceive of adding and disabling event handlers to different components of the game depending on our current progression. the progression consists of
    round() {
        //this.result = "";
        this.player.wager = prompt("pick wager", (this.player.balance * .1).toString());
        this.player.balance -= this.player.wager;
        this.player.reset();
        // this.deck = new Deck();
        // this.dealer.deck = new Deck();
        this.dealer.reset();
        this.dealer.dealHands(this.playerList);
        this.startPlayerTurn();
    },
    showStats(){
        let info = document.querySelector('#info');
        info.innerHTML = `<p>balance: ${ this.player.balance }</p><p>result: ${ this.result }</p>`;
    }
};

//game.player.hand
game.init();
