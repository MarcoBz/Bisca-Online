<template>
      <div class="row text-center">
        <div class="col">
          <button class="btn btn-secondary" @click= "createMatch" >Create Match</button>
        </div>
      </div>
</template>

<script>

export default {
  name: "CreateMatch",

    data () {
    return {
      nLives: 3,
      nCards: 5,
      nPlayers: 3,
      totalMatches: null
    }
  },

  async created(){
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
          await totalMatchesUpdate.update({
            'total_matches': newMatchID
          })

          const matchesRef = this.$fireDb.ref('matches')
          let obj = {}
          obj["match_" + newMatchID] = {
              creation_date : (new Date()).toISOString(),
              is_started: false,
              is_ended: false,
              n_players : this.nPlayers,
              joined_players: 0,
              ready_players: 0,
              n_lives : this.nLives,
              reborn_action: false,  
              current_game: 0,
              current_turn: 0,
              current_player_index: 0,
              current_total_calls: 0,
              current_numbers_calls: 0,
              lives_updated: false,
              winner_player_index: null,
              is_noWinner: false,   
              still_alive_players: this.nPlayers,
              all_ready: false    
          }

          await matchesRef.update(obj)
 
          const gamesRef = this.$fireDb.ref(`games`)
          let gameObj = {}
          gameObj["match_" + newMatchID] = {}
          gameObj["match_" + newMatchID]["game_0"] = {
              is_started: false,
              is_ended: false,
              n_cards: this.nCards,
              dealer_index: 0,
              current_turn: 0,
              total_calls: 0          
          }
          await gamesRef.update(gameObj)          

          const turnsRef = this.$fireDb.ref(`turns`)
          let turnObj = {}
          turnObj["match_" + newMatchID] = {}
          turnObj["match_" + newMatchID]["game_0"] = {}
          turnObj["match_" + newMatchID]["game_0"]["turn_0"] = {
              is_started: false,
              is_ended: false,
              first_player_index: 0,
              egg_played: false,
              player_with_egg_index: null,
              egg_notice: false
          }
          await turnsRef.update(turnObj)    

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
