<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height" >
      <div class="nopadding col-2 border" v-if= "player[1].is_ready">
          Ready
      </div>
      <div class="nopadding col-2 border" v-else>
          <button class="btn btn-warning" v-bind:disabled = "player[1].is_ready" @click = "playerIsReady"> Ready </button>
      </div>
      <div class="nopadding col-2 border" >
          {{player[1].player_name}}
      </div>
      <div class="nopadding col-3 border" >
          HANDS
      </div>
      <div class="nopadding col-3 border" >
          <span><button class = "btn btn-light" v-for = "i in 5" > {{i}} </button></span>
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
  props: ['player', 'matchName'],
    data () {
    return {
   
    }

  },


  methods: {

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
