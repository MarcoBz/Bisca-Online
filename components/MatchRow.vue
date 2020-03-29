<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height" >
      <div class="nopadding col-4 border" >
          {{match[0]}}
      </div>
      <div class="nopadding col-2 border" >
          {{match[1].joined_players}}/{{match[1].n_players}}
      </div>
      <div class="nopadding col-1 border" >
          {{match[1].n_lives}}
      </div>
      <div class="nopadding col-2 border" >
          Status
      </div>
      <div class="nopadding col-3 border" >
          <button class = "btn btn-primary" @click= "goToMatch(match[0])"> Go To </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "MatchRow",
  props: ['match'],
    data () {
    return {
   
    }
  },

  methods: {

    goToMatch(match){
      this.$router.push({
          path: '/' + this.match
      })
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
