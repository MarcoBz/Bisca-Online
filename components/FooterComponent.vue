<template>
  <div>
    <footer class="fixed-bottom">
      <div class="container-fluid footer">
        <div class= "row">
          <div class="col-md-3 col-1"></div>
          <div class="col-md-6 col-10 text-muted text-center footer-col">
            <span>Powered by MarcoBz</span>
          </div>
          <div class="col-md-3 col-1"></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

export default {

    data () {
      return {
        paths : {
          "Tv Shows" : "/TvShows/tvShows",
          "Movies" : "/Movies/movies",
        }
      }
    },

  components: {

  },

  methods: {
    goToRoom(room) {
      this.$router.push({
          path: this.paths[room]
      })        
    }
  }

}
</script>

<style>
  .footer {
      position: absolute;
      bottom: 0;
      width: 100%; 
      height: 60px;
      line-height: 60px;
  }
  .footer-col{
    
      background-color: #f5f5f5;
  }
</style>
