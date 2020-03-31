<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height" >
      <div class="nopadding col-1 border" v-bind:class = "{'bg-success': match.current_player_index === parseInt(player[0].split('_')[1])}" >
          {{player[1].player_name}}
      </div>
      <div class="nopadding col-1 border" v-if= "player[1].is_ready && !player[1].is_reborn && !player[1].is_dead && !player[1].is_winner">
          Ready
      </div>
      <div class="nopadding col-1 border" v-else-if= "player[1].is_reborn && !player[1].is_dead && !player[1].is_winner">
          Reborn
      </div>
      <div class="nopadding col-1 border" v-else-if= "player[1].is_dead">
          Dead
      </div>
      <div class="nopadding col-1 border" v-else-if= "player[1].is_winner">
          Winner
      </div>
      <div class="nopadding col-1 border" v-else>
          <button class="btn btn-warning" @click = "playerIsReady"> Ready </button>
      </div>

      <div class="nopadding col-4 border" v-if = "player[1].played_card">
        <card class = "card-class" v-bind:cardIndex = "player[1].played_card" />       
      </div>
      <div class="nopadding col-4 border" v-else-if = "!game.is_started">
        <card class = "card-class" v-bind:cardIndex = "53" v-for = "card, index in game.n_cards"/>       
      </div>
      <div class="nopadding col-4 border" v-else-if= "game.n_cards === 1">
        <span><button class = "card-class" 
                      v-for = "card, index in player[1].current_hand"
                      v-bind:disabled = "player[1].played_card != null || !player[1].his_turn || !turn.is_started" 
                      @click = "playedCard(card.card, index)">
                        <card v-bind:cardIndex = 53 />               
                      </button></span>
      </div>
      <div class="nopadding col-4 border" v-else>
          <span v-if="player[1].current_hand"><button class = "card-class" 
                                                      v-for = "card, index in player[1].current_hand" 
                                                      @click = "playedCard(card.card, index)" 
                                                      v-bind:class = "player[1].played_card === card.card ? 'btn-primary' : 'btn-light'"
                                                      v-bind:disabled = "card.is_played || match.current_numbers_calls != match.still_alive_players || !player[1].his_turn || !turn.is_started" > 
                                                        <div v-if = "!card.is_played">
                                                          <card v-bind:cardIndex = "card.card" />
                                                        </div>                                                        
                                                      </button></span>
      </div>

      <div class="nopadding col-4 border" v-if="game.n_cards === 1">
          <span><button class = "btn"
                        @click = "setCall(1);"
                        v-bind:class = "player[1].current_call === 1 ? 'btn-secondary' : 'btn-light'"
                        v-bind:disabled= "!player[1].admitted_calls[1] || !player[1].his_turn && !player[1].called_current_game || ( player[1].called_current_game && players.find(c => c[0] === `player_${player[1].next_index}`)[1].called_current_game)"
          >Win</button></span>
          <span><button class = "btn"
                        @click = "setCall(0);"
                        v-bind:class = "player[1].current_call === 0 ? 'btn-secondary' : 'btn-light'"
                        v-bind:disabled= "!player[1].admitted_calls[0] || !player[1].his_turn && !player[1].called_current_game || ( player[1].called_current_game && players.find(c => c[0] === `player_${player[1].next_index}`)[1].called_current_game)"
          >Lose</button></span>           
      </div>
      <div class="nopadding col-4 border" v-else>
                  <span><button class = "btn" 
                        @click = "setCall(i-1)" 
                        v-for = "i in 6" 
                        v-bind:class = "player[1].current_call === i-1 ? 'btn-secondary' : 'btn-light'"
                        v-bind:disabled= "!player[1].admitted_calls[i-1] ||  !player[1].his_turn && !player[1].called_current_game || ( player[1].called_current_game && players.find(c => c[0] === `player_${player[1].next_index}`)[1].called_current_game)" >
                        {{ i-1 }}
                        </button></span>
      </div>
      <div class="nopadding col-1 border" >
          {{player[1].n_lives}}
      </div>
      <div class="nopadding col-1 border" v-if="game.totals">
          {{game.totals[player[0]]}}
      </div>
      <div class="nopadding col-1 border" v-else>
          0
      </div>
    </div>
    <div class= "row text-center nopadding row-eq-height" v-if="player[1].his_turn && turn.egg_notice && turn.player_with_egg_index === parseInt(player[0].split('_')[1])">
      <div class="nopadding col-4 border" >
      </div>
      <div class="nopadding col-4 border" >
        <span><button class = "btn"
                      @click="eggChanged(true)" 
                      v-bind:class = "isClicked ? 'btn-secondary' : 'btn-light'"
                      v-bind:disabled = "isClicked">0</button></span>
        <span><button class = "btn"
                      @click="eggChanged(false)" 
                      v-bind:class = "isClicked ? 'btn-secondary' : 'btn-light'"
                      v-bind:disabled = "isClicked">13</button></span>
      </div>
      <div class="nopadding col-4 border" >
      </div>
    </div>
  </div>
</template>

<script>

import Card from "~/components/beta/Card.vue"
export default {
  components: {
    Card
  },
  name: "PlayerRow",
  props: ['player', 'players', 'match', 'game', 'turn', 'matchName'],
    data () {
    return {
      isClicked: false,
    }
  },


  methods: {

    async eggChanged(choose){

      if(choose){
          try {
            const playerRef = this.$fireDb.ref(`players/${this.matchName}/${this.player[0]}`)
            await playerRef.update({
              his_turn: false,
              played_card: 0
            })
            let payload = {
              changed: true,
              card: 0,
              player: this.player[0]
            }
            this.$emit('eggChanged', payload)

          } catch (e) {
            console.log(e)
            return
          } 
      }

      else{
        const playerRef = this.$fireDb.ref(`players/${this.matchName}/${this.player[0]}`)
        await playerRef.update({
          his_turn: false
        })   
        let payload = {
          changed: false
        }
        this.$emit('eggChanged', payload)     
      }

    },

    async playedCard(card, index){
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
  .card-class {
    padding: 0;
    display: inline-block;
  }
</style>
