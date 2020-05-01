<template>
  <div class="container" >
    <div class= "row text-center justify-content-center nopadding justify-content-center border backgroundClassNotice" >
      <div class="nopadding col-12" >

        <div v-if = "match.is_ended">
            <div class = "row text-center justify-content-center board-div" >
                <div class= "col-12 board-vertical" v-if = "match.is_noWinner">
                    <h3>No winner</h3>
                </div> 
                <div class= "col-12 board-vertical" v-else>
                    <h3>The winner is : <u> {{players.find(c => parseInt(c[0].split('_')[1]) === this.match.winner_player_index)[1].player_name}} </u></h3>
                </div> 
            </div>
        </div>

        <div v-else-if = "!match.all_ready || (match.all_ready && !(game.dealer_index || game.dealer_index === 0))">
            <div class = "row text-center justify-content-center board-div" >
                <div class= "col-12 board-vertical">
                   <h3> Waiting ...</h3>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div m-1" v-if = "!player[1].is_ready">
                <div class= "col-12 board-vertical">
                    <button class="btn btn-warning" @click = "playerIsReady"> Ready </button>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div" v-else>
                <div class= "col-12 board-vertical">
                </div> 
            </div>
        </div>

        <div v-else-if = "!match.is_started">
            <div class = "row text-center justify-content-center board-div" >
                <div class= "col-12 board-vertical" >
                    <h3>First player is : <u> {{players.find(c => parseInt(c[0].split('_')[1]) === game.dealer_index)[1].player_name}} </u></h3>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div m-1" v-if = "parseInt(player[0].split('_')[1]) === game.dealer_index">
                <div class= "col-12 board-vertical">
                    <button     class="btn btn-secondary"
                                @click= "startMatch"> Start Match 
                    </button>  
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div m-1" v-else>
                <div class= "col-12 board-vertical">
                    <h3>Starting the match... </h3>
                </div> 
            </div>
        </div>

        <div v-else-if = "!game.is_started">
            <div class = "row text-center justify-content-center board-div" >
                <div class= "col-12 board-vertical" >
                    <h3>First player is : <u> {{players.find(c => parseInt(c[0].split('_')[1]) === game.dealer_index)[1].player_name}} </u></h3>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div m-1" v-if = "parseInt(player[0].split('_')[1]) === game.dealer_index">
                <div class= "col-12 board-vertical" v-if = "startGameShow">
                    <button     class="btn btn-secondary"
                                @click= "startGame"> Start Game 
                    </button>
                </div> 
                <div class= "col-12 board-vertical" v-else-if = "match.current_game != 0" >
                    <div class= "col board-vertical">
                    </div> 
                    <div class= "col-10 board-vertical">
                        <div class = "row text-center justify-content-center">
                            <div class = "col-4"  v-for = "player in players"> 
                                <div class = "row text-center justify-content-center border">
                                    <div class = "col-3"> {{player[1].player_name}} </div>
                                    <div class = "col-9 text-danger" v-if = "player[1].is_dead"> Dead</div>
                                    <div class = "col-9 text-warning" v-else-if = "player[1].is_reborn">Reborn</div>
                                    <div class = "col-9" v-else> {{player[1].n_lives}} </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <div class= "col board-vertical">
                    </div> 
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div m-1" v-else-if = "match.current_game === 0">
                <div class= "col-12 board-vertical">
                    <h3>Starting the game...</h3>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div m-1" v-else>
                <div class= "col board-vertical">
                </div> 
                <div class= "col-10 board-vertical">
                    <div class = "row text-center justify-content-center">
                        <div class = "col-4"  v-for = "player in players"> 
                            <div class = "row text-center justify-content-center border">
                                <div class = "col-3"> {{player[1].player_name}} </div>
                                <div class = "col-9 text-danger" v-if = "player[1].is_dead"> Dead</div>
                                <div class = "col-9 text-warning" v-else-if = "player[1].is_reborn">Reborn</div>
                                <div class = "col-9" v-else> {{player[1].n_lives}} </div>
                            </div>
                        </div>
                    </div>
                </div> 
                <div class= "col board-vertical">
                </div> 
            </div>
        </div>

        <div v-else-if = "game.is_started && !game.hands">
            <div class = "row text-center justify-content-center board-div" >
                <div class= "col-12 board-vertical" >
                    <h3>Shuffling cards</h3>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div" >
                <div class= "col-12 board-vertical">
                </div> 
            </div>
        </div>

        <div v-else-if = "game.is_started && !player[1].called_current_game">
            <div class = "row text-center justify-content-center board-div" v-if = "player[1].his_turn">
                <div class= "col-12 board-vertical" >
                    <h3>Your turn to call</h3>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div" v-else>
                <div class= "col-12 board-vertical" >
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div">
                <div class= "col-12 board-vertical">
                </div> 
            </div>
        </div>

        <div v-else-if = "turn.is_started ">  
            <div class = "row text-center justify-content-center board-div" v-if = "game.n_cards === 1 && !turn.is_ended">
                <div class= "col-12 board-vertical">
                    <h3>Show down</h3>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div" v-else-if = "game.n_cards != 1 && player[1].his_turn">
                <div class= "col-12 board-vertical">
                    <h3>Your turn to play</h3>
                </div> 
            </div>
            <!-- <div class = "row text-center justify-content-center board-div" v-else-if = "(player[1].played_card || player[1].played_card === 0) && !match.current_player_index && !turn.is_ended && !match.defined_winner">
                <div class= "col-12">
                    <h3>Defining turn winner ...</h3>
                </div>                
            </div> -->
            <div class = "row text-center justify-content-center board-div" v-else-if = "turn.is_ended && match.defined_winner">
                <div class= "col-12 board-vertical">
                    <h3>Turn winner is : <u> {{players.find(c => parseInt(c[0].split('_')[1]) === turn.winner_index)[1].player_name}} </u></h3>
                </div>                
            </div>
            <div class = "row text-center justify-content-center board-div" v-else>
                <div class= "col-12 board-vertical"  >
                </div> 
            </div>

            <div class = "row text-center justify-content-center board-div" v-if = "((game.n_cards === 1 && !match.egg_played && !turn.is_ended) || (turn.is_ended && match.defined_winner)) && count != 0">
                <div class= "col-12 board-vertical">
                    <h3>{{count}}</h3>
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div" v-else-if = "((game.n_cards === 1 && !match.egg_played && !turn.is_ended) || (turn.is_ended && match.defined_winner)) && count === null">
                <div class= "col-12 board-vertical">
                    <h3>Waiting..</h3>
                </div> 
            </div>
            <div class = "row justify-content-center board-div" v-else-if = "match.egg_played.player_index === parseInt(player[0].split('_')[1]) && player[1].his_turn && !match.egg_played.defined">
                <div class="nopadding col-2 text-right" >
                    <card-notice v-bind:cardIndex = "13" />
                </div>
                <div class="nopadding col-2 board-button text-left" >
                    <div><button class = "btn btn-light"
                                @click="playedEgg(0)" >Max</button></div>
                    <div><button class = "btn btn-light"
                                @click="playedEgg(100)" >Min</button></div>
                </div>
            </div>
            <div class = "row text-center justify-content-center board-div" v-else-if = "match.egg_played.defined" >
                <div class="nopadding col-2 text-right" >
                    <card-notice v-bind:cardIndex = "13" />
                </div>
                <div class= "col-2 board-vertical text-left" v-if = "match.egg_played.value === 0">
                    <h3>Max</h3> 
                </div> 
                <div class= "col-2 board-vertical text-left" v-if = "match.egg_played.value === 100"> 
                    <h3>Min</h3> 
                </div>
            </div>
            <div class = "row text-center justify-content-center board-div" v-else>
                <div class= "col-12 board-vertical" >
                </div> 
            </div>
        </div>
        <div v-else>
            <div class = "row text-center justify-content-center board-div">
                <div class= "col-12 board-vertical" >
                </div> 
            </div>
            <div class = "row text-center justify-content-center board-div" >
                <div class= "col-12 board-vertical" >
                </div> 
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import CardNotice from "~/components/v1/CardNotice.vue"
export default {
  components: {
    CardNotice
  },
  name: "NoticeBoard",
  props: ['player', 'game', 'matchName', 'players', 'turn', 'match'],
    data () {
    return {
        count: null,
        interval: 1000,
        startGameShow: true
    }
  },

    async mounted(){
        if(this.game && this.turn){
            if (this.game.n_cards === 1 && this.turn.is_started && !this.turn.is_ended && (!this.player[1].played_card && this.player[1].played_card != 0) && this.player[1].his_turn) {
                this.playedCard( this.player[1].current_hand['card_0'].card, 'card_0')
            }
            
            else if (this.turn.is_ended && !this.game.is_ended && parseInt(this.player[0].split('_')[1]) === this.turn.winner_index){
                if(this.game.current_turn === (this.game.n_cards - 1)){
                    this.beforeEndGame()
                    this.endGame()
                }
                else this.startTurn()
            }
        }

    },

  watch: {

    'match.current_game': function(newGame){

        if (newGame && this.match.current_player_index === parseInt(this.player[0].split('_')[1])){
            this.count = 5
            let endGameCountDown = setInterval(() => {
                this.count -= 1
                if (this.count === 0) {
                    this.count = null
                    this.startGameShow = true
                    clearInterval(endGameCountDown)
                }
            }, this.interval)
        }

    },

    'turn.is_started': function(newTurn, oldTurn) {

        if (this.game.n_cards === 1 && !oldTurn && newTurn ){
            this.count = 3
            let turnCountDown = setInterval(() => {
                this.count -= 1   
                if (this.count === 0) {
                    this.count = null
                    clearInterval(turnCountDown)  
                    if ( this.turn.first_player_index === parseInt(this.player[0].split('_')[1]) ) this.playedCard( this.player[1].current_hand['card_0'].card, 'card_0')   
                }      
            }, this.interval)
        }

    },

    'turn.cards': function(newTurn, oldTurn) {

        if (this.game.n_cards === 1 && this.player[1].his_turn) {
            this.playedCard( this.player[1].current_hand['card_0'].card, 'card_0')
        }

    },

    'match.defined_winner': function (newDefinedWinner) {
        if (newDefinedWinner) {
            this.count = 3
            let countDown = setInterval(() => {
                this.count -= 1
                if (this.count === 0) {
                    this.count = null
                    clearInterval(countDown)
                    if ( this.turn.winner_index === parseInt(this.player[0].split('_')[1]) ) {
                        if (this.game.current_turn === (this.game.n_cards - 1)) {
                            this.beforeEndGame()
                            this.endGame()
                        }
                        else this.startTurn()
                    }
                }
            }, this.interval);

        }

    }
  },

  methods: {

    async playedCard(card, index){


          if (card === 13){
              const matchRef = this.$fireDb.ref(`matches/${this.matchName}`)
              await matchRef.child(`egg_played`).update({
                defined: false,
                player_index: parseInt(this.player[0].split('_')[1]),
                value: null,
                card_index: index
              })
          }
          else{
            try {
              let cardIndex = parseInt(index.split('_')[1])
              const playerRef = this.$fireDb.ref(`players/${this.matchName}/${this.player[0]}`)
              await playerRef.child(`current_hand/card_${cardIndex}`).update({is_played: true})
              await playerRef.update({
                his_turn: false,
                played_card: card
              })
              let payload = {
                card: card,
                cardIndex: cardIndex,
                player: this.player[0]
              }
              this.$emit('playedCard', payload)

            } catch (e) {
              console.log(e)
              return
            } 
          }
    },

    async playedEgg(card){

            let index = this.match.egg_played.card_index
            const matchRef = this.$fireDb.ref(`matches/${this.matchName}`)
              await matchRef.child(`egg_played`).update({
                defined: true,
                player_index: parseInt(this.player[0].split('_')[1]),
                value: card,
                card_index: index
            })        

            try {
              let cardIndex = parseInt(index.split('_')[1])
              const playerRef = this.$fireDb.ref(`players/${this.matchName}/${this.player[0]}`)
              await playerRef.child(`current_hand/card_${cardIndex}`).update({is_played: true})
              await playerRef.update({
                his_turn: false,
                played_card: card
              })
              let payload = {
                card: card,
                cardIndex: cardIndex,
                player: this.player[0]
              }
              this.$emit('playedCard', payload)

            } catch (e) {
              console.log(e)
              return
            } 

    },

    async endGame(){
        const gameRef = this.$fireDb.ref(`games/${this.matchName}/game_${this.match.current_game}`)
        const matchRef = this.$fireDb.ref(`matches/${this.matchName}`) 
        await gameRef.update({
            is_ended: true
        })  
    },

    async beforeEndGame(){
        const matchRef = this.$fireDb.ref(`matches/${this.matchName}`)
        await matchRef.update({
            defined_winner: false
        })                
    },

    async startTurn(){

        let nextTurnIndex = this.match.current_turn + 1
        const turnsRef = this.$fireDb.ref(`turns/${this.matchName}/game_${this.match.current_game}`)
        const gameRef = this.$fireDb.ref(`games/${this.matchName}/game_${this.match.current_game}`)
        const matchRef = this.$fireDb.ref(`matches/${this.matchName}`)
        let playersRef = this.$fireDb.ref(`players/${this.matchName}`)  
        for(let i = 0; i < this.match.n_players; i++){
            await playersRef.child(`player_${i}`).update({
                played_card: null
            }) 
        } 

        let turnObj = {}
        turnObj["turn_"  +  nextTurnIndex] = {
            is_started: true,
            is_ended: false,
            first_player_index: this.turn.winner_index
        }
        await turnsRef.update(turnObj)
        await gameRef.update({
            current_turn: nextTurnIndex
        }) 
        await matchRef.update({
            current_turn: nextTurnIndex,
            current_player_index: this.turn.winner_index,
            defined_winner: false
        }) 
        let playerRef = this.$fireDb.ref(`players/${this.matchName}/player_${this.match.current_player_index}`)
        await playerRef.update({
            his_turn: true,
        }) 

    },

    async playerIsReady(){
        try {
          const playerRef = this.$fireDb.ref(`players/${this.matchName}/${this.player[0]}`)
          await playerRef.update({
            'is_ready': true
          })
          this.$emit('ready')

        } catch (e) {
          console.log(e)
          return
        }  
    },

    async startMatch(){
        try {

            const matchRef = this.$fireDb.ref(`matches/${this.matchName}`)
            await matchRef.update({
                is_started: true,
                lives_updated: true,
                start_date: (new Date()).toISOString(),
            })
        } catch (e) {
        console.log(e)
        return
        }
        this.startGameShow = true  
    },

    async startGame(){
        this.startGameShow = false
        try {

            const gameRef = this.$fireDb.ref(`games/${this.matchName}/game_${this.match.current_game}`)
            await gameRef.update({
                is_started: true
            })
            const matchRef = this.$fireDb.ref(`matches/${this.matchName}`)
            await matchRef.update({
                lives_updated: false
            })
        } catch (e) {
        console.log(e)
        return
        }
    },

  }
}
</script>

<style>

    .board-button{
        margin-top: 5px
    }

    .board-vertical{
        margin-top: 20px
    }

  .board-div{
      height:75px;
      overflow: hidden;
  }

  svg {
    display: block;
    margin: 0 auto;
  }

  .backgroundClassNotice{
    background-color: Ivory;
  }

  .nopadding {
    padding: 0 !important;
    margin: 0 !important;
  }
  .border-2 {
      border-width:2px !important;
  }

</style>
