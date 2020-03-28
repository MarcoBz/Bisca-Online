<template>
  <div class="container-fluid">

    <div class= "row text-center m-2">
        <div class = "col-4">
        </div>
        <div class = "col-4 border">
            <div class="form-group row">
            <label for="inputMatch" class="col-sm-6 col-form-label text-right">Match:</label>
            <div class="col-sm-6">
                <input type="text" class="form-control" placeholder="Match" v-model= "yourMatch" >
            </div>
            </div>
            <div class="row">
            <div class="col-sm-12">
                <button class="btn btn-primary m-2" @click= "goToMatch" >Go to match</button>
            </div>
            </div>
        </div>
        <div class = "col-4">
        </div>
    </div>

    <div v-if = "showMatch && match && game && turn">
        <div class= "row text-center">
        <div class = "col-12">
            <details-table-head />
        </div>
        </div>
        <div class= "row text-center">
        <div class = "col-12">
            <details-row v-bind:match = match v-bind:matchName = "inputMatch" />
        </div>
        </div>

        <div class= "row text-center">
            <div class="col-12">
                <span><button class="btn btn-secondary m-3" @click= "addPlayer" v-bind:disabled = "match.joined_players == match.n_players"> Join </button></span>
            </div>
        </div>  

        <div class= "row text-center">
        <div class = "col-12">
            <player-table-head />
        </div>
        </div>
        <div class= "row text-center" v-for = "player in players">
        <div class = "col-12">
            <player-row v-bind:player = player 
                        v-bind:totalCalls = game.total_calls 
                        v-bind:nCards = game.n_cards 
                        v-bind:matchName = "inputMatch" 
                        v-bind:nCalls = match.current_numbers_calls
                        v-bind:nPlayers = match.n_players
                        v-bind:turnIsStarted = turn.is_started
                        v-on:ready="updateReady" 
                        v-on:setCall="setCall"
                        v-on:playedCard="playedCard"/>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import PlayerRow from "~/components/Test/PlayerRow.vue"
import PlayerTableHead from "~/components/Test/PlayerTableHead.vue"
import DetailsRow from "~/components/Test/DetailsRow.vue"
import DetailsTableHead from "~/components/Test/DetailsTableHead.vue"

export default {
    components: {
        PlayerRow,
        PlayerTableHead,
        DetailsRow,
        DetailsTableHead
    },

    data () {
        return {
            yourMatch: null,
            inputMatch: null,
            showMatch: false,
            match: null,
            players: null,
            game: null,
            turn: null,
            names: ['A','B','C','D','E','F','G','H']
        }  
    },

  methods:{

    async goToMatch(){

        this.inputMatch = this.yourMatch
        this.showMatch = true
        this.match= null
        this.players= null
        this.game= null
        this.turn= null
        this.$fireDb.ref(`players/${this.inputMatch}`).on('value', (snapshot) => {
            if(snapshot.val()) this.players = Object.entries(snapshot.val());
            
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
    },

    nextPlayerIndex(currentPlayerIndex, nPlayers){

        let nextPlayerIndex = null
        let tempIndex = currentPlayerIndex

        while (nextPlayerIndex === null){
            tempIndex = tempIndex + 1 == nPlayers ? 0 : tempIndex + 1
            if (!this.players.find(c => c[0] === `player_${tempIndex}`)[1].is_dead){
                nextPlayerIndex = tempIndex
            }
        }
        return nextPlayerIndex
    },

    async playedCard(payload){
        try {
            let currentPlayerIndex = parseInt(payload.player.split('_')[1])
            // let nextPlayerIndex = currentPlayerIndex + 1 == this.match.n_players ? 0 : currentPlayerIndex + 1
            let nextPlayerIndex = this.nextPlayerIndex(currentPlayerIndex, this.match.n_players)

            const gameRef = this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`)
            await gameRef.child(`hands/player_${currentPlayerIndex}/card_${payload.cardIndex}`).update({is_played : true})

            const turnRef= this.$fireDb.ref(`turns/${this.inputMatch}/game_${this.match.current_game}/turn_${this.match.current_turn}`)
            let obj = {}
            obj[payload.player] = payload.card
            await turnRef.child('cards').update(obj)            

            const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
            await matchRef.update({
                current_player_index: nextPlayerIndex
            })





            if (nextPlayerIndex == this.turn.first_player_index){
                await turnRef.update({
                    is_ended: true
                })
            }
            else{
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
            let nextPlayerIndex = this.nextPlayerIndex(currentPlayerIndex, this.match.n_players)

            const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
            await matchRef.update({
                current_total_calls: this.match.current_total_calls + payload.call,
                current_numbers_calls: this.match.current_numbers_calls + 1,
                current_player_index: nextPlayerIndex
            })

            const gameRef = this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`)
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
                'is_started': true,
                'lives_updated': true
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
    },

    async addPlayer() {
        try {
            let newPlayerID = this.match.joined_players
            const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
            await matchRef.update({
                'joined_players': this.match.joined_players + 1
            })

            const playersRef = this.$fireDb.ref(`players/${this.inputMatch}`)
            let playerObj = {}
            playerObj["player_" + newPlayerID] = {
                is_ready: false,
                player_name: this.names[this.match.joined_players - 1 ],
                n_lives: this.match.n_lives,
                is_dead: false,
                is_reborn: false,
                is_winner: false,
                current_call: null,
                called_current_game: false,
                his_turn: false,
                next_index: newPlayerID + 1 === this.match.n_players ? 0 : newPlayerID + 1        
            }
            await playersRef.update(playerObj)
            let newPlayerObj = {}
            newPlayerObj[this.match.joined_players-1] = "player_" + [this.match.joined_players-1]
            await matchRef.child('all_players').update(newPlayerObj)
            } catch (e) {
                console.log(e)
                return
            }
        }
    }

}
</script>