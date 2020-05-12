const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require("./utils.js")
admin.initializeApp();

exports.createUser = functions.auth.user().onCreate(async (user) => {
    const ref = admin.database().ref()
    let totalUsers = await ref.child('total_users').once('value',(snapshot) => {
        snapshot
    })
    totalUsers = totalUsers.val()
    let newUserID = totalUsers + 1
    await admin.database().ref().update({
        total_users: newUserID
    })
    const usersRef = admin.database().ref('users')
    let obj = {}
    obj[user.uid] = {
        email: user.email,
        user_name: null,
        registration_date : (new Date()).toISOString(),
        rooms: null,
        record: {
            w: 0,
            t: 0
        }
    }
    await usersRef.update(obj)
});

exports.updateReportError = functions.database.ref('/players/{match}/{player}/report_error')
.onCreate(async (snap, context) => { 
    let match = context.params.match
    const matchRef = admin.database().ref(`matches/${match}`)    
    let nPlayers = await matchRef.child('n_players').once('value',(snapshot) => {
        snapshot
    })   
    nPlayers = nPlayers.val()
    let count = 0
    let playersRef = admin.database().ref(`players/${match}`)
    let players = await playersRef.once('value',(snapshot) => {
        snapshot
    })
    players = Object.entries(players.val()).map( (player) => {
        if (player[1].report_error) count += 1
    })
    if (count === nPlayers){
        const gameMatchRef = admin.database().ref(`games/${match}`)  
        const turnMatchRef = admin.database().ref(`turns/${match}`) 
        const playerMatchRef = admin.database().ref(`players/${match}`)   
        let room = await matchRef.child('room').once('value',(snapshot) => {
            snapshot
        })   
        room = room.val()
        const roomMatchRef = admin.database().ref(`rooms/${room}/matches/${match}`)  
        let users = await roomMatchRef.child('users').once('value',(snapshot) => {
            snapshot
        })
        users = users.val()
        roomMatchRef.remove()
        matchRef.remove()
        const roomUsersRef = admin.database().ref(`rooms/${room}/users`) 
        for (let i in users){
            let t = await roomUsersRef.child(`${i}/t`).once('value',(snapshot) => {
                snapshot
            })
            t = t.val()
            await roomUsersRef.child(`${i}`).update({
                t: t-1
            })  

            const usersRef = admin.database().ref(`users`) 
            let tTotal = await usersRef.child(`${i}/record/t`).once('value',(snapshot) => {
                snapshot
            })
            tTotal = tTotal.val()
            await usersRef.child(`${i}/record`).update({
                t: tTotal-1
            }) 

            let tRoom = await usersRef.child(`${i}/rooms/${room}/t`).once('value',(snapshot) => {
                snapshot
            })
            tRoom = tRoom.val()
            await usersRef.child(`${i}/rooms/${room}`).update({
                t: tRoom-1
            })                 
        }
        gameMatchRef.remove() 
        turnMatchRef.remove() 
        playerMatchRef.remove()
    }
 

});

exports.updateReadyPlayers = functions.database.ref('/players/{match}/{player}/is_ready')
.onUpdate(async (change, context) => { 
    let match = context.params.match
    if ( change.before.val() === false && change.after.val() === true){
        const matchRef = admin.database().ref(`matches/${match}`)    
        let nPlayers = await matchRef.child('n_players').once('value',(snapshot) => {
            snapshot
        })   
        nPlayers = nPlayers.val()
        let count = 0
        let playersRef = admin.database().ref(`players/${match}`)
        let players = await playersRef.once('value',(snapshot) => {
            snapshot
        })
        players = Object.entries(players.val()).map( (player) => {
            if (player[1].is_ready) count += 1
        })
        let all_ready = false
        if (count === nPlayers) all_ready = true
        await matchRef.update({
            ready_players : count,
            all_ready: all_ready
        })  

    }
});

exports.updateJoinedPlayers = functions.database.ref('/players/{match}/{player}')
.onCreate(async (snap, context) => { 
    let match = context.params.match
    const matchRef = admin.database().ref(`matches/${match}`)    
    let nPlayers = await matchRef.child('n_players').once('value',(snapshot) => {
        snapshot
    })   
    nPlayers = nPlayers.val()
    let playersRef = admin.database().ref(`players/${match}`)
    let players = await playersRef.once('value',(snapshot) => {
        snapshot
    })
    let count = Object.entries(players.val()).length
    let all_joined = false
    if (count === nPlayers) all_joined = true
    await matchRef.update({
        joined_players : count,
        all_joined: all_joined
    })  
});

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
        let explosionsObj = {}

        explosions.forEach(player => {
            explosionsObj[player.player] = player.explosions
        })
        await gameRef.child(`explosions`).update(explosionsObj) 

        let nPlayers = await matchRef.child('n_players').once('value',(snapshot) => {
            snapshot
        })

        let rebornActionDone = false 
        let rebornAction = await matchRef.child('reborn_action').once('value',(snapshot) => {
            snapshot
        })
        let allPlayersAftermath = []

        for(let i = 0; i < nPlayers.val(); i++){
            let playerIsDead = await playersRef.child(`player_${i}/is_dead`).once('value',(snapshot) => {
                snapshot
            })  

            allPlayersAftermath.push({
                playerIndex: i,
                is_dead: playerIsDead.val(),
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
                }
                if(newLives === 0 && !rebornAction.val()){
                    newLives = 1
                    isDead = false
                    isReborn = true
                    rebornActionDone = true
                }
                await playersRef.child(`player_${i}`).update({
                    is_dead : isDead,
                    is_reborn : isReborn,
                    n_lives: newLives
                }) 
                
                await playersRef.child(`player_${i}`).update({
                    admitted_calls: null,
                    called_current_game: null,
                    current_call: null,
                    current_total: null,
                    current_hand: null,
                    his_turn: false,
                    next_index: null,
                    played_card: null
                }) 
                
                allPlayersAftermath.find(c => c.playerIndex === i).is_dead = isDead
                allPlayersAftermath.find(c => c.playerIndex === i).lives = newLives
                allPlayersAftermath.find(c => c.playerIndex === i).is_reborn = isReborn
            }
        }

        if (rebornActionDone){
            await matchRef.update({
                reborn_action : true
            }) 
        }

        await matchRef.update({
            lives_updated : true,
        }) 

        let stillInGame = allPlayersAftermath.filter(player => {
            return player.lives > 0
        })

        if (stillInGame.length === 1){
            await matchRef.update({
                winner_player_index: parseInt(stillInGame[0].playerIndex),
                is_ended: true,
                current_player_index: stillInGame[0].playerIndex,
                end_date: (new Date()).toISOString(),
                current_game: null,
                current_total_calls: null,
                current_turn: null,
                current_numbers_calls: null
            }) 
            await playersRef.child(`player_${stillInGame[0].playerIndex}`).update({
                is_winner: true,
            })
            let uid = await playersRef.child(`player_${stillInGame[0].playerIndex}/player_uid`).once('value',(snapshot) => {
                snapshot
            })
            let userUid = uid.val()

            let  room = await matchRef.child('room').once('value',(snapshot) => {
                snapshot
            })
            room = room.val()

            const roomRef = admin.database().ref(`rooms/${room}`)
            let roomSnapshot = await roomRef.once('value',(snapshot) => {
                snapshot
            })
            roomSnapshot = roomSnapshot.val()
            let obj = {}
            obj[`${userUid}`] = true
            await roomRef.child(`matches/${match}/users`).update(obj)                    
            await roomRef.child(`users/${userUid}`).update({
                w: roomSnapshot.users[userUid].w + 1
            })  

            const userRef = admin.database().ref(`users/${userUid}`)
            let userSnapshot = await userRef.once('value',(snapshot) => {
                snapshot
            })
            userSnapshot = userSnapshot.val()
            await userRef.child(`rooms/${room}`).update({
                w: userSnapshot.rooms[room].w + 1
            })                    
            await userRef.child(`record`).update({
                w: userSnapshot.record.w + 1
            }) 


        }
        else if (stillInGame.length === 0){
            await matchRef.update({
                is_noWinner : true,
                is_ended: true,
                end_date: (new Date()).toISOString(),
                current_game: null,
                current_player_index: null,
                current_total_calls: null,
                current_turn: null,
                current_numbers_calls: null
            }) 
        }

        else {
            let playersLives = {}
            allPlayersAftermath.forEach(player => {

                if (player.is_dead){
                    playersLives["player_" + player.playerIndex] = {
                        is_dead: true
                    }
                }
                else if (player.is_reborn){
                    playersLives["player_" + player.playerIndex] = {
                        is_reborn: true
                    }
                }
                else{
                    playersLives["player_" + player.playerIndex] = {
                        lives: player.lives
                    }
                }
            })
            await gameRef.child(`final_lives`).update(playersLives) 

            allPlayersAftermath.forEach(async player => {
                if(!player.is_dead) {
        
                    let next = player.playerIndex + 1 === nPlayers.val() ? 0 : player.playerIndex + 1
                    let definedNext = false
                    while(definedNext === false){
                        if (allPlayersAftermath.find(c => c.playerIndex === next).is_dead) next = next + 1 === nPlayers.val() ? 0 : next + 1
                        else definedNext = true
                    }
                    player.nextIndex = next
                }
            })

            players = await playersRef.once('value',(snapshot) => {
                snapshot
            }) 
            players = Object.entries(players.val())
            
            const gamesRef = admin.database().ref(`games`)
            let gameObj = {}
            gameObj = {}
            let nCards = await gameRef.child('n_cards').once('value',(snapshot) => {
                snapshot
            })
            let newCards = nCards.val() - 1 == 0 ? 5 : nCards.val() - 1
            
            let nextGame = "game_" + (parseInt(game.split('_')[1]) + 1).toString()
            let oldDealer = await gameRef.child('dealer_index').once('value',(snapshot) => {
                snapshot
            })
            let nextDealer = null
            if (allPlayersAftermath.find(c => c.playerIndex === oldDealer.val()).is_dead) {
                let nextIndex = oldDealer.val() + 1 === nPlayers.val() ? 0 : oldDealer.val() + 1
                while (nextDealer === null){
                    if (allPlayersAftermath.find(c => c.playerIndex === nextIndex).is_dead) nextIndex = nextIndex + 1 === nPlayers.val() ? 0 : nextIndex + 1
                    else nextDealer = nextIndex
                }
            }
            else nextDealer = allPlayersAftermath.find(c => c.playerIndex === oldDealer.val()).nextIndex
            
            gameObj[nextGame] = {
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
            turnObj[nextGame] = {}
            turnObj[nextGame]["turn_0"] = {
                is_started: false,
                is_ended: false,
                first_player_index: nextDealer
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
                    current_total: null,
                    called_current_game: null,
                    current_call: null,
                    current_hand: null,
                    his_turn: false,
                    played_card: null,
                    next_index: allPlayersAftermath.find(c => c.playerIndex === i).is_dead ? null : allPlayersAftermath.find(c => c.playerIndex === i).nextIndex,
                    admitted_calls: null
                }) 

                if ( i === nextDealer){
                    await playersRef.child(`player_${i}`).update({
                        his_turn: true
                    })                     
                }

            }





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

        let playerRef = admin.database().ref(`players/${match}/player_${winner_index}`)
        await playerRef.update({current_total : playerTotal.val() + 1 }) 

        await matchRef.update({
            defined_winner: true,
            egg_played: false
        })       

    }
})




exports.shuffleDealer = functions.database.ref('/matches/{match}/all_ready')
.onUpdate(async (change, context) => {
    let match = context.params.match
    const matchRef = admin.database().ref(`matches/${match}`)
    const gameRef = admin.database().ref(`games/${match}/game_0`)
    const turnRef = admin.database().ref(`turns/${match}/game_0/turn_0`)
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
        await turnRef.update({
            first_player_index: dealer_index
        })
        let playerRef = admin.database().ref(`players/${match}/player_${dealer_index}`)
        await  playerRef.update({
            his_turn:true
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
        let totalCalls = await gameRef.child('total_calls').once('value',(snapshot) => {
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

                        let admittedCallsObj= {}
                        if (nCards.val() > 1){
                            for (let i = 0; i <= nCards.val(); i++){
                                admittedCallsObj[parseInt(i)] = (i > nCards.val() || nCards.val() == totalCalls.val() + i) ? false : true
                            }
                        }

                        else {
                            admittedCallsObj= {
                                0: true,
                                1: true
                            }
                        }

                        await playerRef.update({
                            admitted_calls: admittedCallsObj
                        })                     
                    }
                    else {
                        let admittedCallsObj= {}
                        for (let i = 0; i <= nCards.val(); i++){
                            admittedCallsObj[parseInt(i)] = false
                        }
                        await playerRef.update({
                            admitted_calls: admittedCallsObj
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
