<template>
  <div class="container component nopadding border border-2" >
    <div class= "row row-data text-center nopadding border " >
        <div class="col-12 nopadding">{{player[1].player_name}}</div>
    </div>
    <div class= "row row-data nopadding border " >
        <div class="col-5 text-right nopadding">Lives:</div>
        <div class="col-2 text-center nopadding">{{player[1].n_lives}}</div>
        <div class="col-5 nopadding"></div>
    </div>
    <div class= "row row-data nopadding border " >
        <div class="col-4 text-right nopadding">Call:</div>
        <div class="col-2 text-center nopadding" v-if = "(!player[1].current_call && player[1].current_call != 0) || !player[1].current_hand">-</div>
        <div class="col-2 text-center nopadding" v-else-if = "(player[1].current_call || player[1].current_call === 0) && player[1].current_hand['card_1']">{{player[1].current_call}}</div>
        <div class="col-2 text-center nopadding" v-else-if = "player[1].current_call === 1">Win</div>
        <div class="col-2 text-center nopadding" v-else-if = "player[1].current_call === 0">Lose</div>

        <div class="col-4 text-right nopadding">Points:</div>
        <div class="col-2 text-center nopadding" v-if = "player[1].current_total">{{player[1].current_total}}</div> 
        <div class="col-2 text-center nopadding" v-else>0</div>
    </div>
    <div class= "row row-card text-center nopadding" >
        <div class="col-12 text-center nopadding" v-bind:class = "{'bg-success': player[1].his_turn}" v-if = "!player[1].is_dead">
            <card class = "card-class" v-bind:cardIndex = "53"  v-if = "!player[1].current_hand" />     
            <card class = "card-class" v-bind:cardIndex = "player[1].played_card"  v-else-if = "player[1].played_card || player[1].played_card === 0"/>  
            <card class = "card-class" v-bind:cardIndex = "player[1].current_hand['card_0'].card"  v-else-if = "!currentPlayer && !player[1].current_hand['card_1']"/> 
            <card class = "card-class" v-bind:cardIndex = "53"  v-else />     
        </div>
        
    </div>
    <div class= "row row-data text-center nopadding border " >
      <div class="nopadding col-12" v-if= "player[1].is_ready && !player[1].is_reborn && !player[1].is_dead && !player[1].is_winner">
          Ready 
      </div>
      <div class="nopadding col-12" v-else-if= "player[1].is_reborn && !player[1].is_dead && !player[1].is_winner">
          Reborn
      </div>
      <div class="nopadding col-12" v-else-if= "player[1].is_dead">
          Dead
      </div>
      <div class="nopadding col-12" v-else-if= "player[1].is_winner">
          Winner
      </div>
      <div class="nopadding col-12" v-else>
           Joined 
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
  name: "PlayersComponent",
  props: ['player', 'currentPlayer'],
    data () {
    return {

    }

  },


  methods: {

  },

}
</script>
<style>

    .component{

        height: 250px;

    }

    .row-data{
        height:10%;
        overflow: hidden;
    }

    .row-card{
        height:60%;
        overflow: hidden;
    }

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
