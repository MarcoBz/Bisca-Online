<template>
  <div class="container" >
    <div class= "row text-center nopadding border backgroundClass" >
      <div class="nopadding col-12" >
          {{player[1].player_name}}
      </div>
    </div>

    <div class= "row row-card text-center justify-content-center nopadding border backgroundClassHand" v-if = "player[1].current_hand">
      <div class="nopadding col-2" v-for = "card, index in player[1].current_hand">
        <div v-if = "game.n_cards === 1">
          <button class = "card-class" @click = "playedCard(card.card, index)" v-bind:disabled = "!player[1].his_turn || !turn.is_started" v-if = "!card.is_played" >
              <card v-bind:cardIndex = "53" />
          </button> 
        </div>        
        <div v-else-if = "!card.is_played">
          <button class = "card-class" @click = "playedCard(card.card, index)" v-bind:disabled = "!player[1].his_turn || !turn.is_started">
              <card v-bind:cardIndex = "card.card"  />
          </button> 
        </div>
      </div>
    </div>
    <div class= "row row-card text-center justify-content-center nopadding border backgroundClassHand" v-else-if = "!player[1].current_hand && player[1].is_ready">
      <div class="nopadding col-12">
      </div>
    </div>
    <div class= "row text-center justify-content-center nopadding border backgroundClass" v-else>
      <div class="nopadding col-12">
        <button class="btn btn-warning" @click = "playerIsReady"> Ready </button>
      </div>
    </div>

    <div v-if = "game.is_started && !player[1].is_dead && player[1].admitted_calls">
      <div class= "row text-center justify-content-center nopadding border" v-if = "game.n_cards === 1">
        <div class="nopadding col-12">
            <button class = "btn"
                          @click = "setCall(1);"
                          v-bind:class = "player[1].current_call === 1 ? 'btn-secondary' : 'btn-light'"
                          v-bind:disabled= "!player[1].admitted_calls[1] || !player[1].his_turn && !player[1].called_current_game || ( player[1].called_current_game && players.find(c => c[0] === `player_${player[1].next_index}`)[1].called_current_game)"
            >Win</button>
            <button class = "btn"
                          @click = "setCall(0);"
                          v-bind:class = "player[1].current_call === 0 ? 'btn-secondary' : 'btn-light'"
                          v-bind:disabled= "!player[1].admitted_calls[0] || !player[1].his_turn && !player[1].called_current_game || ( player[1].called_current_game && players.find(c => c[0] === `player_${player[1].next_index}`)[1].called_current_game)"
            >Lose</button>          
        </div>
      </div>
      <div class= "row text-center justify-content-center nopadding border" v-else>
        <div class="nopadding col-12">
          <button class = "btn" 
                          @click = "setCall(i-1)" 
                          v-for = "i in 6" 
                          v-bind:class = "player[1].current_call === i-1 ? 'btn-secondary' : 'btn-light'"
                          v-bind:disabled= "!player[1].admitted_calls[i-1] ||  !player[1].his_turn && !player[1].called_current_game || ( player[1].called_current_game && players.find(c => c[0] === `player_${player[1].next_index}`)[1].called_current_game)" >
                          {{ i-1 }}
          </button>        
        </div>
      </div>
    </div>

    <div class= "row text-center nopadding" v-if="eggNotice">
      <div class="nopadding col-4 border" >
      </div>
      <div class="nopadding col-4 border" >
        <span><button class = "btn btn-light"
                      @click="playedCard(0)" >Max</button></span>
        <span><button class = "btn btn-light"
                      @click="playedCard(100)" >Min</button></span>
      </div>
      <div class="nopadding col-4 border" >
      </div>
    </div>




  </div>
</template>

<script>

import Card from "~/components/beta2/Card.vue"
export default {
  components: {
    Card
  },
  name: "PlayerRow",
  props: ['player', 'game', 'matchName', 'players', 'turn'],
    data () {
    return {
      eggNotice: false,
      eggIndex: null,

    }
  },


  methods: {

    async playedCard(card, index){

          if (card === 13){
            this.eggNotice = true 
            this.eggIndex = index 
          }
          else{

            if (card === 0 || card === 100){
              this.eggNotice = false
              index = this.eggIndex
              this.eggIndex = null
            }
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

    async setCall(call){
        try {
          if (this.isClicked) this.isClicked = false
          const playerRef = this.$fireDb.ref(`players/${this.matchName}/${this.player[0]}`)
          let payload = {}
          let alreadyCalled = await playerRef.child('called_current_game').once('value',(snapshot) => {
              snapshot
          })
          let oldCall = await playerRef.child('current_call').once('value',(snapshot) => {
              snapshot
          })

          if(alreadyCalled.val()) payload.oldCall = oldCall.val()
          else payload.oldCall = null

          await playerRef.update({
            current_call: call,
            called_current_game : true,
            his_turn: false
          })
          payload.call = call
          payload.player =this.player[0]
          this.$emit('setCall', payload)

        } catch (e) {
          console.log(e)
          return
        }  
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
    }

  },

}
</script>
<style>

  .vertical{
    margin-top:50%;
  }

  .row-card{
      height:150px;
      overflow: hidden;
  }

  svg {
    display: block;
    margin: 0 auto;
  }

  .backgroundClassHand{
    background-color: lightgreen
  }

  .nopadding {
    padding: 0 !important;
    margin: 0 !important;
  }
  .border-2 {
      border-width:2px !important;
  }
  .row-eq-height {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display:         flex;
  }
  .card-class {
    padding: 0;
    display: inline-block;
  }
</style>
