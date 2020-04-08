<template>
  <div class="container component nopadding border border-2" >
    <div class= "row row-data text-center nopadding border " >
        <div class="col-12 nopadding" v-bind:class = "{'backGroundClassCurrent': currentPlayer}"><h6>{{player[1].player_name}}</h6></div>
    </div>
    <div class= "row row-data justify-content-center nopadding border" >
        <div class="col-6 text-right nopadding"><h6>Lives:</h6></div>
        <div class="col-6 text-center nopadding"><h6>{{player[1].n_lives}}</h6></div>
    </div>
    <div class= "row row-data justify-content-center nopadding border " >
        <div class="col-6 text-right nopadding">Call:</div>
        <div class="col-6 text-center nopadding" v-if = "!player[1].called_current_game">-</div>
        <div class="col-6 text-center nopadding" v-else-if = "player[1].called_current_game && game.n_cards != 1">{{player[1].current_call}}</div>
        <div class="col-6 text-center nopadding" v-else-if = "player[1].current_call === 1 && game.n_cards === 1">Win</div>
        <div class="col-6 text-center nopadding" v-else-if = "player[1].current_call === 0 && game.n_cards === 1">Lose</div>
    </div>
    <div class= "row row-data justify-content-center nopadding border " >
        <div class="col-6 text-right nopadding">Points:</div>
        <div class="col-6 text-center nopadding" v-if = "player[1].current_total">{{player[1].current_total}}</div> 
        <div class="col-6 text-center nopadding" v-else>0</div>
    </div>
    <div class= "row row-card text-center nopadding" >

        <div class="col-12 text-center nopadding" v-if = "player[1].is_winner">
            <div class= "row justify-content-center text-center nopadding" >    
              <div class="col-12 nopadding" >
                  <trophy class = "card-class" />     
              </div>              
            </div>
        </div>
        <div class="col-12 text-center nopadding" v-else-if = "player[1].is_dead">
            <nuke class = "card-class" />     
        </div>


        <div class="col-12 text-center nopadding" v-else-if = "(!game || !game.is_started) && explosions && aftermath">
            <div class= "row justify-content-center text-center nopadding" >
              <div class="col-2 nopadding" v-for = "i in explosions[player[0]]">    
                  <explosion-notice class = "card-class" />     
              </div>              
            </div>
            <div class= "row justify-content-center text-center nopadding" v-if = "aftermath[player[0]].is_dead">    
              <div class="col-12 nopadding" >
                  <nuke-notice class = "card-class" />     
              </div>              
            </div>
            <div class= "row justify-content-center text-center nopadding" v-else-if = "aftermath[player[0]].is_reborn">    
              <div class="col-12 nopadding" >
                  <zombie-notice class = "card-class" />     
              </div>              
            </div>
        </div>


        <div class="col-12 text-center nopadding" v-bind:class = "{'bg-success': player[1].his_turn}" v-else-if = "!player[1].is_dead">
            <card class = "card-class" v-bind:cardIndex = "53"  v-if = "!player[1].current_hand" />     
            <card class = "card-class" v-bind:cardIndex = "player[1].played_card"  v-else-if = "player[1].played_card || player[1].played_card === 0"/>  
            <card class = "card-class" v-bind:cardIndex = "player[1].current_hand['card_0'].card"  v-else-if = "!currentPlayer && game.n_cards === 1"/> 
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
import Card from "~/components/beta3/Card.vue"
import Nuke from "~/components/beta3/Nuke.vue"
import NukeNotice from "~/components/beta3/NukeNotice.vue"
import ZombieNotice from "~/components/beta3/ZombieNotice.vue"
import ExplosionNotice from "~/components/beta3/ExplosionNotice.vue"
import Trophy from "~/components/beta3/Trophy.vue"
export default {
  components: {
    Trophy,
    Nuke,
    Card,
    NukeNotice,
    ZombieNotice,
    ExplosionNotice
  },
  name: "PlayersComponent",
  props: ['player', 'currentPlayer', 'game', 'explosions', 'aftermath'],
    data () {
    return {

    }

  },


  methods: {

  },

}
</script>
<style>

    .notice-dimension{
      height: 30px;
      width: 30px
    }

    .component{
        height: 275px;
    }

    .row-data{
        height:25px;
        overflow: hidden;
    }

    .row-card{
        height:150px;
        overflow: hidden;
    }

  .vertical{
    margin-top:50%;
  }

  svg {
    display: block;
    margin: 0 auto;
  }

  .backGroundClassCurrent{
    background-color: gold

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
