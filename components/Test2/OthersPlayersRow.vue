<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height backgroundClass" >
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
          <button class="btn btn-warning" > Joined </button>
      </div>
      <div class="nopadding col-2 border" v-bind:class = "{'bg-success': player[1].his_turn}" >
          {{player[1].player_name}}
      </div>
      <div class="nopadding col-3 border" v-if="game.n_cards === 1">
          <span v-for = "card in player[1].current_hand"><button class = "btn btn-primary" disabled>                        
            <svg
                width="170"
                height="245"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                <use v-bind= "{ 'xlink:href': require('../../assets/svg-cards-indented.svg') + `#${cardsReference[card.card]}`}" x="0" y="0"/>
            </svg>  
          </button></span>
      </div>
      <div class="nopadding col-3 border" v-else>
          <span   v-if = "player[1].played_card"><button class = "btn btn-primary" disabled>
            <svg
                width="170"
                height="245"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                <use v-bind= "{ 'xlink:href': require('../../assets/svg-cards-indented.svg') + `#${cardsReference[player[1].played_card]}`}" x="0" y="0"/>
            </svg>
          </button></span>
      </div>
      <div class="nopadding col-3 border" v-if="game.n_cards === 1">
          <span><button class = "btn"
                        v-bind:class = "player[1].current_call === 1 ? 'btn-secondary' : 'btn-light'"
                        disabled
          >Win</button></span>
          <span><button class = "btn"
                        v-bind:class = "player[1].current_call === 0 ? 'btn-secondary' : 'btn-light'"
                        disabled
          >Lose</button></span>          
      </div>
      <div class="nopadding col-3 border"  v-else>
          <span><button class = "btn"  
                        v-for = "i in 6" 
                        v-bind:class = "player[1].current_call === i-1 ? 'btn-secondary' : 'btn-light'"
                        disabled>
                        {{ i-1 }}
                        </button></span>
      </div>
      <div class="nopadding col-1 border" >
          {{player[1].current_call}}
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
export default {
  name: "PlayerRow",
  props: ['player', 'players', 'match', 'game', 'turn', 'matchName'],
    data () {
    return {
      cardsReference: {
        1: 'heart_1',
        2: 'heart_2',
        3: 'heart_3',
        4: 'heart_4',
        5: 'heart_5',
        6: 'heart_6',
        7: 'heart_7',
        8: 'heart_8',
        9: 'heart_9',
        10: 'heart_10',
        11: 'heart_jack',
        12: 'heart_queen',
        13: 'heart_king',
        14: 'diamond_1',
        15: 'diamond_2',
        16: 'diamond_3',
        17: 'diamond_4',
        18: 'diamond_5',
        19: 'diamond_6',
        10: 'diamond_7',
        21: 'diamond_8',
        22: 'diamond_9',
        23: 'diamond_10',
        24: 'diamond_jack',
        25: 'diamond_queen',
        26: 'diamond_king',
        27: 'club_1',
        28: 'club_2',
        29: 'club_3',
        30: 'club_4',
        31: 'club_5',
        32: 'club_6',
        33: 'club_7',
        34: 'club_8',
        35: 'club_9',
        36: 'club_10',
        37: 'club_jack',
        38: 'club_queen',
        39: 'club_king',
        40: 'spade_1',
        41: 'spade_2',
        42: 'spade_3', 
        43: 'spade_4', 
        44: 'spade_5',
        45: 'spade_6', 
        46: 'spade_7', 
        47: 'spade_8', 
        48: 'spade_9', 
        49: 'spade_10', 
        50: 'spade_jack', 
        51: 'spade_queen', 
        52: 'spade_king', 
      }
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
</style>
