<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height font-weight-bold backgroundClass" >
        <div class="nopadding col-2 border" >
            Match
        </div>
        <div class="nopadding col-1 border" >
            Players
        </div>
        <div class="nopadding col-1 border" >
            Lives
        </div>
        <div class="nopadding col-2 border" >
            Status
        </div>
        <div class="nopadding col-2 border" >
            Your Name   
        </div>
        <div class="nopadding col-2 border" >
            Your Password
        </div>
        <div class="nopadding col-1 border" >
            
        </div>
        <div class="nopadding col-1 border" >
            
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "MatchTableHead",
    data () {
    return {
   
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
