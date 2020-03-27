<template>
  <div class="container-fluid" v-if="match && game && turn">

    <div class= "row text-center">
    <div class = "col-12">
        <details-table-head />
    </div>
    </div>
    <div class= "row text-center">
    <div class = "col-12">
        <details-row v-bind:match = match v-bind:matchName = "$route.params.match" />
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
    <div class = "col-12">
        <player-table-head />
    </div>
    </div>
    <div class= "row text-center" >
    <div class = "col-12">
        <player-row v-bind:player = currentPlayer 
                    v-bind:match = match
                    v-bind:game = game
                    v-bind:turn = turn
                    v-bind:matchName = "$route.params.match" 
                    v-on:ready="updateReady" 
                    v-on:setCall="setCall"
                    v-on:playedCard="playedCard"/>
    </div>
    </div>

  </div>
</template>

<script>
import PlayerRow from "~/components/Test2/PlayerRow.vue"
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
            match: null,
            currentPlayer : null,
            players: null,
            game: null,
            turn: null,
            names: ['A','B','C','D','E','F','G','H']
        }  
    },

    async created(){

        this.$fireDb.ref(`players/${this.$route.params.match}`).on('value', (snapshot) => {
            if(snapshot.val()) {
                this.players = Object.entries(snapshot.val());
                this.currentPlayer  = this.players.find(c => c[0] === this.$route.params.player)
            }
            
        })

        this.$fireDb.ref(`matches/${this.$route.params.match}`).on('value', (snapshot) => {
            this.match = snapshot.val();
            this.$fireDb.ref(`games/${this.$route.params.match}/game_${this.match.current_game}`).on('value', (snapshot) => {
                this.game = snapshot.val();
                this.$fireDb.ref(`turns/${this.$route.params.match}/game_${this.match.current_game}/turn_${this.match.current_turn}`).on('value', (snapshot) => {
                    this.turn = snapshot.val();
                })
            })
        })
    },

  methods:{

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

            const gameRef = this.$fireDb.ref(`games/${this.$route.params.match}/game_${this.match.current_game}`)
            await gameRef.child(`hands/player_${currentPlayerIndex}/card_${payload.cardIndex}`).update({is_played : true})

            const turnRef= this.$fireDb.ref(`turns/${this.$route.params.match}/game_${this.match.current_game}/turn_${this.match.current_turn}`)
            let obj = {}
            obj[payload.player] = payload.card
            await turnRef.child('cards').update(obj)            

            const matchRef = this.$fireDb.ref(`matches/${this.$route.params.match}`)
            await matchRef.update({
                current_player_index: nextPlayerIndex
            })





            if (nextPlayerIndex == this.turn.first_player_index){
                await turnRef.update({
                    is_ended: true
                })
            }
            else{
                const nextPlayerRef = this.$fireDb.ref(`players/${this.$route.params.match}/player_${nextPlayerIndex}`)
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

            const matchRef = this.$fireDb.ref(`matches/${this.$route.params.match}`)
            await matchRef.update({
                current_total_calls: this.match.current_total_calls + payload.call,
                current_numbers_calls: this.match.current_numbers_calls + 1,
                current_player_index: nextPlayerIndex
            })

            const gameRef = this.$fireDb.ref(`games/${this.$route.params.match}/game_${this.match.current_game}`)
            await gameRef.update({
                total_calls: this.game.total_calls + payload.call
            })
            let obj = {}
            obj[payload.player] = payload.call
            await gameRef.child('calls').update(obj)

            const nextPlayerRef = this.$fireDb.ref(`players/${this.$route.params.match}/player_${nextPlayerIndex}`)
            await nextPlayerRef.update({
                his_turn: true
            }) 

            if (nextPlayerIndex == this.game.dealer_index){

                const turnRef= this.$fireDb.ref(`turns/${this.$route.params.match}/game_${this.match.current_game}/turn_${this.match.current_turn}`)
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

            const gameRef = this.$fireDb.ref(`games/${this.$route.params.match}/game_${this.match.current_game}`)
            await gameRef.update({
                'is_started': true
            })
            const matchRef = this.$fireDb.ref(`matches/${this.$route.params.match}`)
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

            const matchRef = this.$fireDb.ref(`matches/${this.$route.params.match}`)
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
          const matchRef = this.$fireDb.ref(`matches/${this.$route.params.match}`)
          await matchRef.update({
            'ready_players': this.match.ready_players + 1
          })
        } catch (e) {
          console.log(e)
          return
        }          
    },

    async addPlayer() {
        try {
            let newPlayerID = this.match.joined_players
            const matchRef = this.$fireDb.ref(`matches/${this.$route.params.match}`)
            await matchRef.update({
                'joined_players': this.match.joined_players + 1
            })

            const playersRef = this.$fireDb.ref(`players/${this.$route.params.match}`)
            let playerObj = {}
            playerObj["player_" + newPlayerID] = {
                is_ready: false,
                player_name: this.names[this.match.joined_players - 1 ],
                n_lives: this.match.n_lives,
                is_dead: false,
                is_reborn: false,
                is_winner: false,
                current_call: 0,
                called_current_game: false,
                his_turn: false            
            }
            await playersRef.update(playerObj)

            const gamesRef = this.$fireDb.ref(`games/${this.$route.params.match}/game_0`)
            if (newPlayerID == 0){
                await gamesRef.update({
                    calls: {
                        player_0: 0
                    },
                    totals: {
                        player_0: 0
                    }
                })

            }

            else {
                let obj = {}
                obj["player_" + newPlayerID] = 0
                await gamesRef.child("calls").update(obj)
                await gamesRef.child("totals").update(obj)
            }

            } catch (e) {
                console.log(e)
                return
            }
        }
    }

}
</script>