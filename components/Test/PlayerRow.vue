<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height" >
      <div class="nopadding col-2 border" v-if= "player[1].is_ready">
          Ready 
      </div>
      <div class="nopadding col-2 border" v-else>
          <button class="btn btn-warning" v-bind:disabled = "player[1].is_ready" @click = "playerIsReady"> Ready </button>
      </div>
      <div class="nopadding col-2 border" v-bind:class = "{'text-success': player[1].his_turn}" >
          {{player[1].player_name}}
      </div>
      <div class="nopadding col-3 border" >
          <span v-if="player[1].current_hand"><button class = "btn btn-light" 
                                                      v-for = "card, index in player[1].current_hand" 
                                                      @click = "playedCard(card.card, index)" 
                                                      v-bind:class = "{'text-success': player[1].played_card === card.card }"
                                                      v-bind:disabled = "card.is_played || nCalls != nPlayers || !player[1].his_turn || !turnIsStarted" > {{card.card}} </button></span>
      </div>
      <div class="nopadding col-3 border" >
          <span><button class = "btn btn-light" 
                        @click = "setCall(i-1)" 
                        v-for = "i in 6" 
                        v-bind:disabled= "i-1 > nCards || nCards+1-i == totalCalls || player[1].called_current_game || !player[1].his_turn" >{{i-1}}</button></span>
      </div>
      <div class="nopadding col-1 border" >
          calls
      </div>
      <div class="nopadding col-1 border" >
          {{player[1].n_lives}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "PlayerRow",
  props: ['player', 'matchName', 'totalCalls', 'nCards', 'nCalls', 'nPlayers', 'turnIsStarted'],
    data () {
    return {
   
    }

  },


  methods: {

    async playedCard(card, index){
        try {
          let cardIndex = parseInt(index.split('_')[1])
          const playerRef = this.$fireDb.ref(`players/${this.matchName}/${this.player[0]}`)
          await playerRef.child(`current_hand/card_${cardIndex}`).update({is_played: true})
          await playerRef.update({
            'his_turn': false,
            'played_card': card
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

    async setCall(call){
        try {
          const playerRef = this.$fireDb.ref(`players/${this.matchName}/${this.player[0]}`)
          await playerRef.update({
            'current_call': call,
            'called_current_game' : true,
            'his_turn': false
          })
          let payload = {
            call: call,
            player: this.player[0]
          }
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

  svg {
    display: block;
    margin: 0 auto;
  }

  .backgroundClass{
    background-color: lightgrey
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
</style>
