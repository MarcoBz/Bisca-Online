<template>
  <div class="container-fluid">

    <div v-if = " match">

        <div v-if= "match.is_ended">
            <div class= "row text-center m-3" v-if = "!match.is_noWinner">
                <div class="col-12">
                   <h2> The winner is : {{players.find(c => parseInt(c[0].split('_')[1]) === this.match.winner_player_index)[1].player_name}} </h2>
                </div>
            </div>     
            <div class= "row text-center m-3" v-else>
                <div class="col-12">
                   <h2>No winner</h2>
                </div>
            </div>          
        </div>

        <div v-else-if = "!authorized">
            <div class="row text-center">
                <div class="col-12 text-center">
                    <h2>Enter your password</h2>
                </div>
            </div>
            <div class="form-group row text-center">
                <div class="col-4 text-center">
                </div>
                <div class="col-4 text-center">
                    <input type="text" class="form-control" placeholder="Password" v-model = "playerPsw">
                </div>
                <div class="col-4 text-center">
                </div>
            </div>
            <div class="row text-center">
                <div class="col-12 text-center">
                    <button class="btn btn-danger" @click ="back">Back</button>
                    <button class="btn btn-success" @click ="submit">Submit</button>
                </div>
            </div>
        


        </div>
        <div v-else>
            <div class= "row text-center justify-content-center other-players">
                <div class = "col-2" v-for = "player in players">
                    <players-component v-bind:player = player v-bind:currentPlayer = "player[0] === currentPlayer[0]"/>
                </div>
            </div>


            <div class= "row text-center">
                <div class="col-12">
                    <span><button   class="btn btn-secondary m-3"
                                    @click= "startMatch" 
                                    v-bind:disabled = "match.is_started || !match.all_ready || parseInt(currentPlayer[0].split('_')[1]) != game.dealer_index" >Start Match</button></span>
                    <span><button class="btn btn-secondary m-3" @click= "startGame" v-bind:disabled = "match.is_ended || !match.lives_updated  || parseInt(currentPlayer[0].split('_')[1]) != game.dealer_index"> Start Game </button></span>
                </div>
            </div>  

            <div class= "row text-center">
                <div class = "col-12" >
                    <player-hand v-bind:player = currentPlayer 
                                v-bind:players = players
                                v-bind:game = game
                                v-bind:turn = turn
                                v-bind:matchName = "inputMatch" 
                                v-on:ready="updateReady" 
                                v-on:setCall="setCall"
                                v-on:playedCard="playedCard"/>
                </div>
            </div>
        </div>


   </div>
  </div>
</template>

<script>
import PlayersComponent from "~/components/beta2/PlayersComponent.vue"
import PlayerHand from "~/components/beta2/PlayerHand.vue"
import OthersPlayersRow from "~/components/beta/OthersPlayersRow.vue"
import PlayerTableHead from "~/components/beta/PlayerTableHead.vue"
import DetailsRow from "~/components/beta/DetailsRow.vue"
import DetailsTableHead from "~/components/beta/DetailsTableHead.vue"

export default {

    components: {
        PlayersComponent,
        PlayerHand,
        DetailsRow,
        DetailsTableHead
    },

    data () {
        return {
            authorized: false,
            playerPsw: null,
            inputMatch: this.$route.params.match,
            inputPlayer: this.$route.params.player,
            showTable: false,
            match: null,
            currentPlayer : null,
            players: null,
            game: null,
            turn: null,
            names: ['A','B','C','D','E','F','G','H']
        }  
    },

    async mounted(){
        if(this.inputMatch && this.inputPlayer){
            this.$fireDb.ref(`players/${this.inputMatch}`).on('value', (snapshot) => {
                if(snapshot.val()) {
                    this.players = Object.entries(snapshot.val());
                    this.currentPlayer  = this.players.find(c => c[0] === this.inputPlayer)
                }
                
            })

            this.$fireDb.ref(`matches/${this.inputMatch}`).on('value', (snapshot) => {
                this.match = snapshot.val();
                this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`).on('value', (snapshot) => {
                    this.game = snapshot.val();
                    this.$fireDb.ref(`turns/${this.inputMatch}/game_${this.match.current_game}/turn_${this.match.current_turn}`).on('value', (snapshot) => {
                        this.turn = snapshot.val();
                    })
                })
            })
        }

    },

    methods:{

        submit(){
            if(this.currentPlayer[1].player_password === this.playerPsw){
                this.authorized = true
            }
        },

        back(){
            this.$router.push({
                path: `/beta2/${inputMatch}`
            })
        },

        async endTurn(turnRef) {
            await turnRef.update({
                is_ended: true
            })
        },

        async playedCard(payload){
            try {

                let currentPlayerIndex = parseInt(payload.player.split('_')[1])
                // let nextPlayerIndex = currentPlayerIndex + 1 == this.match.n_players ? 0 : currentPlayerIndex + 
                let nextPlayerIndex = this.players.find(c => c[0] === `player_${currentPlayerIndex}`)[1].next_index
                // let nextPlayerIndex = this.nextPlayerIndex(currentPlayerIndex, this.match.n_players)

                const gameRef = this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`)
                await gameRef.child(`hands/player_${currentPlayerIndex}/card_${payload.cardIndex}`).update({is_played : true})

                const turnRef= this.$fireDb.ref(`turns/${this.inputMatch}/game_${this.match.current_game}/turn_${this.match.current_turn}`)
                let obj = {}
                obj[payload.player] = payload.card
                await turnRef.child('cards').update(obj)            

                const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)

                if (nextPlayerIndex == this.turn.first_player_index){
                    let playerRef = this.$fireDb.ref(`players/${this.inputMatch}/player_${currentPlayerIndex}`)
                    await playerRef.update({
                        his_turn: false,
                    }) 
                    await matchRef.update({
                        current_player_index: null
                    })

                    setTimeout(this.endTurn, 2000, turnRef);
                }
                else{
                    await matchRef.update({
                        current_player_index: nextPlayerIndex
                    })
                    const nextPlayerRef = this.$fireDb.ref(`players/${this.inputMatch}/player_${nextPlayerIndex}`)
                    await nextPlayerRef.update({
                        his_turn: true
                    }) 
                }

            } catch (e) {
            console.log(e)
            return
            }  
        },

        async setCall(payload){
            try {

                let currentPlayerIndex = parseInt(payload.player.split('_')[1])
                // let nextPlayerIndex = currentPlayerIndex + 1 == this.match.n_players ? 0 : currentPlayerIndex + 1
                let nextPlayerIndex = this.players.find(c => c[0] === `player_${currentPlayerIndex}`)[1].next_index
                // let nextPlayerIndex = this.nextPlayerIndex(currentPlayerIndex, this.match.n_players)

                const gameRef = this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`)
                const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
                if(payload.oldCall != null){
                    await gameRef.update({
                        total_calls: this.match.current_total_calls - payload.oldCall
                    })
                    await matchRef.update({
                        current_total_calls: this.match.current_total_calls - payload.oldCall,
                        current_numbers_calls: this.match.current_numbers_calls - 1,
                    })
                }

                await matchRef.update({
                    current_total_calls: this.match.current_total_calls + payload.call,
                    current_numbers_calls: this.match.current_numbers_calls + 1,
                    current_player_index: nextPlayerIndex
                })

                await gameRef.update({
                    total_calls: this.game.total_calls + payload.call
                })
                let obj = {}
                obj[payload.player] = payload.call
                await gameRef.child('calls').update(obj)

                const nextPlayerRef = this.$fireDb.ref(`players/${this.inputMatch}/player_${nextPlayerIndex}`)
                await nextPlayerRef.update({
                    his_turn: true
                }) 

                if (nextPlayerIndex == this.game.dealer_index){

                    const turnRef= this.$fireDb.ref(`turns/${this.inputMatch}/game_${this.match.current_game}/turn_${this.match.current_turn}`)
                    await turnRef.update({
                        is_started: true,
                        first_player_index: this.game.dealer_index,
                    })

                }
                else{
                    let admittedCallsObj= {}
                    if(this.game.n_cards > 1){
                        for (let i = 0; i <= this.game.n_cards; i++){
                            admittedCallsObj[parseInt(i)] = (i > this.game.n_cards || this.game.n_cards == this.game.total_calls + i) ? false : true
                        }
                    }
                    else{
                        let nextAfterPlayerIndex = await nextPlayerRef.child(`next_index`).once('value',(snapshot) => {
                            snapshot
                        })  
                        admittedCallsObj= {
                            0: this.game.total_calls === 1 ? false : true,
                            1: (nextAfterPlayerIndex.val() === this.game.dealer_index && this.game.total_calls === 0) ? false : true,
                        }
                    }
                    await nextPlayerRef.update({
                        admitted_calls: admittedCallsObj
                    })
                }

            } catch (e) {
            console.log(e)
            return
            }  
        },

        async startGame(){
            try {

                const gameRef = this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`)
                await gameRef.update({
                    'is_started': true
                })
                const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
                await matchRef.update({
                    'lives_updated': false
                })
            } catch (e) {
            console.log(e)
            return
            }
        },

        async startMatch(){
            try {

                const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
                await matchRef.update({
                    is_started: true,
                    lives_updated: true,
                    start_date: (new Date()).toISOString(),
                })
            } catch (e) {
            console.log(e)
            return
            }  
        },

        async updateReady(){
            try {
                const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
                await matchRef.update({
                    'ready_players': this.match.ready_players + 1
                })
                if (this.match.ready_players === this.match.n_players){
                    await matchRef.update({
                        'all_ready': true
                    })                
                }
            } catch (e) {
            console.log(e)
            return
            }          
        }
    }  
}
</script>

<style>

.other-players{
    margin-top:50 px;
}

</style>