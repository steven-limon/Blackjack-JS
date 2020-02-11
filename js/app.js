const deck = [];
for (rank of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A']) {
    for (suit of ['diamonds', 'clubs', 'hearts', 'spades']){
        deck.push(rank + ' ' +suit);
    }
}

const game = {
    deck: [],
    player: {
        hand: [],
        wager: 0,
        balance: 0,
        splitHand: []
    },
    shuffle (deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        this.deck = deck.slice();
    },
    dealHands() {
        players.foreach(player => {
            player.hand.push(this.hit());
        });
    },
    hit() {
        return this.deck.pop();
    }
};

//game.player.hand
