<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height" >
      <div class="nopadding col-3 border">
          {{matchName}}
      </div>
      <div class="nopadding col-3 border">
          {{match.joined_players}}/{{match.n_players}}
      </div>
      <div class="nopadding col-1 border">
          {{match.ready_players}}
      </div>
      <div class="nopadding col-1 border" >
          {{match.n_lives}}
      </div>
      <div class="nopadding col-1 border" >
          {{match.current_game}}
      </div>
      <div class="nopadding col-1 border" >
          {{match.current_turn}}
      </div>
      <div class="nopadding col-1 border" >
          {{match.current_player_index}}
      </div>
      <div class="nopadding col-1 border" >
          {{match.current_total_calls}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "DetailsRow",
  props: ['match', 'matchName'],
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
</style>
