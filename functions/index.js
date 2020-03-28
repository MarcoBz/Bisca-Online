const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require("./utils.js")
admin.initializeApp();

exports.updateLives = functions.database.ref('/games/{match}/{game}/is_ended')
.onUpdate(async (change, context) => { 
    let match = context.params.match
    let game = context.params.game 
    const matchRef = admin.database().ref(`matches/${match}`)
    const playersRef = admin.database().ref(`players/${match}`)
    const gameRef = admin.database().ref(`games/${match}/${game}`)
    let isEnded = await gameRef.child('is_ended').once('value',(snapshot) => {
        snapshot
    })
    if (change.before.val() === false && isEnded.val() === true) {
        let totals = await gameRef.child('totals').once('value',(snapshot) => {
            snapshot
        })
        totals = Object.entries(totals.val()).map(player => {
            return{
                player: player[0],
                total: player[1]
            }
        })  
        let calls = await gameRef.child('calls').once('value',(snapshot) => {
            snapshot
        })
        calls = Object.entries(calls.val()).map(player => {
            return{
                player: player[0],
                call: player[1]
            }
        }) 
        let explosions = calls.map( player => {
            return {
                player: player.player,
                explosions: Math.abs(parseInt(player.call) - parseInt(totals.find(c => c.player == player.player).total))
            }
        })
        let nPlayers = await matchRef.child('n_players').once('value',(snapshot) => {
            snapshot
        })

        let rebornActionDone = false 
        let rebornAction = await matchRef.child('reborn_action').once('value',(snapshot) => {
            snapshot
        })
        let allPlayers = []
        let stillAlivePlayers = await matchRef.child(`still_alive_players`).once('value',(snapshot) => {
            snapshot
        })
        stillAlivePlayers = stillAlivePlayers.val()
        let allPlayersDead = []

        for(let i = 0; i < nPlayers.val(); i++){
            
            let playerIsDead = await playersRef.child(`player_${i}/is_dead`).once('value',(snapshot) => {
                snapshot
            })  

            allPlayersDead.push({

                playerIndex: i,
                is_dead: playerIsDead.val()

            })

            if (!playerIsDead.val()){
                let n_lives = await playersRef.child(`player_${i}/n_lives`).once('value',(snapshot) => {
                    snapshot
                })
                let newLives = n_lives.val() - explosions.find(c => c.player == `player_${i}`).explosions
                let isDead = false
                let isReborn = await playersRef.child(`player_${i}/is_reborn`).once('value',(snapshot) => {
                    snapshot
                })

                isReborn=isReborn.val()
                if (newLives <= 0) {
                    newLives = 0
                    isDead = true
                    stillAlivePlayers -= 1 
                }

                if(newLives === 0 && !rebornAction.val()){
                    newLives = 1
                    isDead = false
                    isReborn = true
                    rebornActionDone = true
                    stillAlivePlayers += 1
                }

                await playersRef.child(`player_${i}`).update({
                    is_dead : isDead,
                    is_reborn : isReborn,
                    n_lives: newLives
                }) 
                allPlayers.push({
                    player: `player_${i}`,
                    lives: newLives
                })

                allPlayersDead.find(c => c.playerIndex === i).is_dead = isDead
            }

        }

        allPlayersDead.forEach(async player => {
            if(!player.is_dead) {
                let next = await playersRef.child(`player_${player.playerIndex}/next_index`).once('value',(snapshot) => {
                    snapshot
                }) 
                next = next.val() 
                let updatedNext = null

                while(updatedNext === null){

                    if(allPlayersDead.find(c => c.playerIndex === next).is_dead) {

                        if (next == nPlayers.val()) next = 0
                        else next += 1 
                        if (!allPlayersDead.find(c => c.playerIndex === next).is_dead){
                            updatedNext = next
                        }

                    }
                    else updatedNext = next
                }

                await playersRef.child(`player_${player.playerIndex}`).update({
                    next_index: updatedNext
                }) 
            }

        })


        if (rebornActionDone){
            await matchRef.update({
                reborn_action : true
            }) 
        }

        await matchRef.update({
            still_alive_players: stillAlivePlayers,
            lives_updated : true,
        }) 

        let stillInGame = allPlayers.filter(player => {
            return player.lives > 0
        })
        if (stillInGame.length === 1){
            await matchRef.update({
                winner_player_index: parseInt(stillInGame[0].player.split('_')[1]),
                is_ended: true,
                end_date: (new Date()).toISOString(),
            }) 
            await playersRef.child(`player_${stillInGame[0].player.split('_')[1]}`).update({
                is_winner: true
            })
        }
        else if (stillInGame.length === 0){
            await matchRef.update({
                is_noWinner : true,
                is_ended: true,
                end_date: (new Date()).toISOString(),
            }) 
        }

    }
})

exports.defineTurnWinner = functions.database.ref('/turns/{match}/{game}/{turn}/is_ended')
.onUpdate(async (change, context) => {
    let match = context.params.match
    let game = context.params.game
    let turn = context.params.turn

    const matchRef = admin.database().ref(`matches/${match}`)
    const turnRef = admin.database().ref(`turns/${match}/${game}`)
    const gameRef = admin.database().ref(`games/${match}/${game}`)
    let isEnded = await turnRef.child(`${turn}/is_ended`).once('value',(snapshot) => {
        snapshot
    })
    if (change.before.val() === false && isEnded.val() === true) {

        let currentPlayer = await matchRef.child('current_player_index').once('value',(snapshot) => {
            snapshot
        })
        let playerRef = admin.database().ref(`players/${match}/player_${currentPlayer.val()}`)
        await playerRef.update({
            his_turn: false,
        }) 
        let playedCards = await turnRef.child(`${turn}/cards`).once('value',(snapshot) => {
            snapshot
        })
        playedCards = Object.entries(playedCards.val()).map(player => {
            return{
                player: player[0],
                card: player[1]
            }
        })
        playedCards = playedCards.sort(function (a, b) {
            return a.card - b.card;
        })
        let winner_index = parseInt(playedCards[0].player.split('_')[1])
        await turnRef.child(`${turn}`).update({
            winner_index: winner_index
        }) 

        let playerTotal = await gameRef.child(`totals/player_${winner_index}`).once('value',(snapshot) => {
            snapshot
        })
        let obj = {}
        obj['player_' + winner_index] = playerTotal.val() + 1
        await gameRef.child('totals').update(obj)   
        let nCards = await gameRef.child('n_cards').once('value',(snapshot) => {
            snapshot
        })

        let nPlayers = await matchRef.child('n_players').once('value',(snapshot) => {
            snapshot
        })

        if (parseInt(turn.split('_')[1]) === nCards.val() - 1){
            let playersRef = admin.database().ref(`players/${match}`)
            players = await playersRef.once('value',(snapshot) => {
                snapshot
            }) 

            players = Object.entries(players.val())

            let currentDealer = await gameRef.child('dealer_index').once('value',(snapshot) => {
                snapshot
            })
            await gameRef.update({
                is_ended: true
            })     
            const gamesRef = admin.database().ref(`games`)
            let gameObj = {}
            gameObj = {}
            let newCards = nCards.val() - 1 == 0 ? 3 : nCards.val() - 1
            // let nextDealer = utils.nextDealerIndex(currentDealer.val(), nPlayers.val(), players)
            let nextDealer = players.find(c => c[0] === `player_${currentDealer.val()}`)[1].next_index
            gameObj["game_" + (parseInt(game.split('_')[1]) + 1).toString()] = {
                is_started: false,
                is_ended: false,
                n_cards: newCards,
                dealer_index: nextDealer,
                current_turn: 0,
                total_calls: 0,          
            }

            await gamesRef.child(`${match}`).update(gameObj) 

            const turnsRef = admin.database().ref(`turns`)
            let turnObj = {}
            turnObj = {}
            turnObj["game_" + (parseInt(game.split('_')[1]) + 1).toString()] = {}
            turnObj["game_" + (parseInt(game.split('_')[1]) + 1).toString()]["turn_0"] = {
                is_started: false,
                is_ended: false,
                first_player_index: nextDealer,
                egg_played: false,
                player_with_egg_index: null,
                egg_notice: false
            }
            await turnsRef.child(`${match}`).update(turnObj)           
            await matchRef.update({
                current_turn: 0,
                current_total_calls: 0,
                current_numbers_calls: 0,
                current_game: parseInt(game.split('_')[1]) + 1,
                current_player_index: nextDealer
            }) 

            for(let i = 0; i < nPlayers.val(); i++){

                await playersRef.child(`player_${i}`).update({
                    called_current_game: false,
                    current_call: null,
                    current_hand: null,
                    his_turn: false,
                    played_card: null
                }) 
            }


        }
        else{
            let nextTurnIndex = parseInt(turn.split('_')[1]) + 1
            let turnObj = {}
            turnObj["turn_"  +  nextTurnIndex] = {
                is_started: true,
                is_ended: false,
                first_player_index: winner_index,
                egg_played: false,
                player_with_egg_index: null,
                egg_notice: false
            }
            await turnRef.update(turnObj)   
            await matchRef.update({
                current_turn: nextTurnIndex,
                current_player_index: winner_index
            }) 
            await gameRef.update({
                current_turn: nextTurnIndex
            })  
            let playersRef = admin.database().ref(`players/${match}`)  
            for(let i = 0; i < nPlayers.val(); i++){
                await playersRef.child(`player_${i}`).update({
                    played_card: null
                }) 
            } 
            let nextPlayerRef = admin.database().ref(`players/${match}/player_${winner_index}`)
            await nextPlayerRef.update({
                his_turn: true,
            }) 
        }

    }
})

exports.shuffleDealer = functions.database.ref('/matches/{match}/all_ready')
.onUpdate(async (change, context) => {
    let match = context.params.match
    const matchRef = admin.database().ref(`matches/${match}`)
    const gameRef = admin.database().ref(`games/${match}/game_0`)
    let allReady = await matchRef.child('all_ready').once('value',(snapshot) => {
        snapshot
    })
    let nPlayers = await matchRef.child('n_players').once('value',(snapshot) => {
        snapshot
    })
    if (change.before.val() === false && allReady.val() === true) {
        let dealer_index = Math.floor(Math.random() * nPlayers.val())
        await matchRef.update({
            current_player_index: dealer_index
        })
        await gameRef.update({
            dealer_index: dealer_index
        })
    }
})

exports.shuffleCards = functions.database.ref('/games/{match}/{game}/is_started')
.onUpdate(async (change, context) => {
    let match = context.params.match
    const matchRef = admin.database().ref(`matches/${match}`)
    let currentGame = await matchRef.child('current_game').once('value',(snapshot) => {
        snapshot
    })

    let playersRef = admin.database().ref(`players/${match}`)
    const gameRef = admin.database().ref(`games/${match}/game_${currentGame.val()}`)
    let isStarted = await gameRef.child('is_started').once('value',(snapshot) => {
        snapshot
    })

    if (change.before.val() === false && isStarted.val() === true) {

        let nPlayers = await matchRef.child('n_players').once('value',(snapshot) => {
            snapshot
        })
        let nCards = await gameRef.child('n_cards').once('value',(snapshot) => {
            snapshot
        })
        let dealer_index = await gameRef.child('dealer_index').once('value',(snapshot) => {
            snapshot
        })
        
        let cards = utils.shuffle(Array.from(Array(52).keys()).map( num => {return num+1}))
        let handsObj = {}

        for(let i = 0; i < nPlayers.val(); i++){
            let hand = cards.splice(0, nCards.val()).map(card => {
                return {
                    card: card,
                    is_played: false
                }
            })
            handsObj["player_" + i] = {}
            let playerIsDead = await playersRef.child(`player_${i}/is_dead`).once('value',(snapshot) => {
                snapshot
            })  
            if (!playerIsDead.val()){
                let obj = {}
                obj["player_" + i] = 0
                await gameRef.child(`calls`).update(obj)
                await gameRef.child(`totals`).update(obj)
                for(let j = 0; j < nCards.val(); j++) {
                    handsObj["player_" + i]["card_" + j] = hand[j]
                    let playerRef = admin.database().ref(`players/${match}/player_${i}`)
                    if (i === dealer_index.val()) {
                        await playerRef.update({
                            his_turn: true
                        })                    
                    }
                    await playerRef.update({
                        current_hand: handsObj["player_" + i]
                    })
                }
            }


        }
        await gameRef.update({
            hands: handsObj
        })

      } 
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
