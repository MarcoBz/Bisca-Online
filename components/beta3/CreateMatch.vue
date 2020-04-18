<template>
  <div class="container-fluid">
      <div class="row text-center">
        <div class="col">
          <button class="btn btn-secondary" @click= "createMatch" v-bind:disabled= "!nLives || !nPlayers" >Create Match</button>
        </div>
      </div>
      <div class= "row text-center m-2">
        <div class = "col-4">
        </div>
        <div class = "col-4 border">
          <div class="form-group row">
            <label for="inputNplayers" class="col-sm-6 col-form-label text-right">N. Players</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" id="inputNplayers" placeholder="Players" v-model = "nPlayers">
            </div>
          </div>
            <div class="form-group row">
            <label for="inputNlives" class="col-sm-6 col-form-label text-right">N. Lives</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" id="inputNlives" placeholder="Lives" v-model = "nLives">
            </div>
          </div>
          <div class="form-group">
            <label for="inputPassword">Password</label>
            <input type="text" class="form-control" id="inputPassword" placeholder="Password">
          </div>
        </div>
        <div class = "col-4">
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: "CreateMatch",

    data () {
    return {
      nLives: null,
      nCards: 5,
      nPlayers: null,
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
              n_players : parseInt(this.nPlayers),
              joined_players: 0,
              ready_players: 0,
              n_lives : parseInt(this.nLives),
              defined_winner: false,
              reborn_action: false,  
              current_game: 0,
              current_turn: 0,
              current_total_calls: 0,
              current_numbers_calls: 0,
              lives_updated: false,
              winner_player_index: null,
              is_noWinner: false,   
              all_ready: false,
              egg_played: false    
          }

          await matchesRef.update(obj)
 
          const gamesRef = this.$fireDb.ref(`games`)
          let gameObj = {}
          gameObj["match_" + newMatchID] = {}
          gameObj["match_" + newMatchID]["game_0"] = {
              is_started: false,
              is_ended: false,
              n_cards: this.nCards,
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
              is_ended: false
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
