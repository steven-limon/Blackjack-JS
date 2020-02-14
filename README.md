# **Blackjack-JS**
## Summary
Simple Javascript implemetation of Blackjack. Dealer does not hit on a soft 17. Use

## User Stories
### betting phase:

a player puts down the minimum number of chips for the table. maybe have a toggle where they put in as big a hand as their last bet
### players play in order:

if there are bots then there must be an order of players getting a chance to hit from the same shoe/deck. for a single player game theres no need to visit any other player besides the user

#### player's turn:

consists of allowing them to take several actions, and all of this is contextual, if the player receives blackjack their turn immediately ends and they will win unless the dealer shows a blackjack (the dealer must show a blackjack as soon as his play starts unless the surrender variant is active). Otherwise the player has the following actions
* Hit

     hits can continue until bust
* stand

     the player accepts their current hand and their play ends
* double down

     player must have enough in their balance to double their bet, they receive one card, their play ends
* surrender

     a variant that allows them to give up their hand if the dealer has no blackjack and they will receive half their bet back
* dealer phase

   The dealer is not making any ai decisions or anything, they simply draw until their standUnil is reached.
* the payout

   this phase needs to look at every players hand to determine what occurs. nothing happens when the player busts (hand above 21). if they score above the dealers hand they get paid out otherwise like a bust they receive nothing

## Wireframe
![wireframe pic](blackjack_wireframes.png)

## Missed Stretchgoals
* surrender option
* dealer hits on soft 17
* Bots playing at different positions of the table
* Offer insurance 
* Offer evens play
* Show house edge with various options, decks enabled
* fix prng (use crypto random api instead of Math.random())
