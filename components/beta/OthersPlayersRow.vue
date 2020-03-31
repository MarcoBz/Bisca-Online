<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height backgroundClass" >
      <div class="nopadding col-1 border" v-bind:class = "{'bg-success': match.current_player_index === parseInt(player[0].split('_')[1])}" >
          {{player[1].player_name}}
      </div>
      <div class="nopadding col-1 border" v-if= "player[1].is_ready && !player[1].is_reborn && !player[1].is_dead && !player[1].is_winner">
          Ready 
      </div>
      <div class="nopadding col-1 border" v-else-if= "player[1].is_reborn && !player[1].is_dead">
          Reborn
      </div>
      <div class="nopadding col-1 border" v-else-if= "player[1].is_dead">
          Dead
      </div>
      <div class="nopadding col-1 border" v-else-if= "player[1].is_winner">
          Winner
      </div>
      <div class="nopadding col-1 border" v-else>
           Joined 
      </div>

      <div class="nopadding col-4 border" v-if = "player[1].played_card">
        <card class = "card-class" v-bind:cardIndex = "player[1].played_card" />       
      </div>
      <div class="nopadding col-4 border" v-else-if = "!game.is_started">
        <card class = "card-class" v-bind:cardIndex = "53" v-for = "card, index in game.n_cards"/>       
      </div>
      <div class="nopadding col-4 border" v-else-if= "game.n_cards === 1">
        <card class = "card-class" v-bind:cardIndex = "player[1].current_hand['card_0'].card"/>       
      </div>
      <div class="nopadding col-4 border" v-else>
        <card class = "card-class" v-bind:cardIndex = "53" v-for = "card, index in (game.n_cards - game.current_turn)"/>   
      </div>
      <div class="nopadding col-4 border" v-if="game.n_cards === 1">
          <span><button class = "btn"
                        v-bind:class = "player[1].current_call === 1 ? 'btn-secondary' : 'btn-light'"
                        disabled
          >Win</button></span>
          <span><button class = "btn"
                        v-bind:class = "player[1].current_call === 0 ? 'btn-secondary' : 'btn-light'"
                        disabled
          >Lose</button></span>          
      </div>
      <div class="nopadding col-4 border"  v-else>
          <span><button class = "btn"  
                        v-for = "i in 6" 
                        v-bind:class = "player[1].current_call === i-1 ? 'btn-secondary' : 'btn-light'"
                        disabled>
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
  </div>
</template>

<script>
import Card from "~/components/beta/Card.vue"
export default {
  components: {
    Card
  },
  name: "OthersPlayersRow",
  props: ['player', 'players', 'match', 'game', 'turn', 'matchName'],
    data () {
    return {

    }

  },


  methods: {

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
