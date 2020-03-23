<template>
      <div class="row text-center">
        <div class="col">
          <button class="btn btn-light" @click= "createMatch" >Create Match</button>
          total matches : {{totalMatches}}
        </div>
      </div>
</template>

<script>

export default {
  name: "CreateMatch",

    data () {
    return {
      nLives: 5,
      nPlayers: 6,
      totalMatches: null
    }
  },

  created(){
      this.$fireDb.ref('total_matches').on('value', (snapshot) => {
        this.totalMatches = snapshot.val();
      })
  },

  methods: {
    async createMatch() {
      try {
        let newMatchID = this.totalMatches + 1
        try {
          const totalMatchesUpdate = this.$fireDb.ref()
          const result = await totalMatchesUpdate.update({
            'total_matches': newMatchID
          })
        } catch (e) {
          console.log(e)
          return
        }
        
        const matchesRef = this.$fireDb.ref('matches')
        try {

          let obj = {}
          obj["match_" + newMatchID] = {
              creation_date : (new Date()).toISOString(),
              n_players : this.nPlayers,
              joined_players: 0,
              ready_players: 0,
              n_lives : this.nLives,
              reborn_action: false,            
          }

          await matchesRef.update(obj)
        } catch (e) {
          console.log(e)
          return
        }

      } catch (e) {
        console.log(e)
        return
      }
    },

  },

}
</script>
<style>

</style>
