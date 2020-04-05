<template>
  <div class="container-fluid" >
    <div class= "row text-center nopadding row-eq-height" >
      <div class="nopadding col-2 border" >
          {{match[0]}}
      </div>
      <div class="nopadding col-1 border" >
          {{match[1].joined_players}}/{{match[1].n_players}}
      </div>
      <div class="nopadding col-1 border" >
          {{match[1].n_lives}}
      </div>
      <div class="nopadding col-2 border" v-if= "match[1].is_started && !match[1].is_ended">
          Started
      </div>
      <div class="nopadding col-2 border" v-else-if= "match[1].is_ended">
          Ended
      </div>
      <div class="nopadding col-2 border" v-else>
          Waiting
      </div>
      <div class="nopadding col-2 border" >
        <div class="form-group row">
          <div class="col-sm-12 text-left">
            <input type="text" class="form-control" placeholder="Your Name" v-model = "playerName">
          </div>
        </div>
      </div>
      <div class="nopadding col-2 border" >
        <div class="form-group row">
          <div class="col-sm-12 text-left">
            <input type="text" class="form-control" placeholder="Your Password" v-model = "playerPsw">
          </div>
        </div>
      </div>
      <div class="nopadding col-1 border" >
          <button class = "btn btn-primary" @click= "join" v-bind:disabled = "!playerName || !playerPsw || match[1].joined_players === match[1].n_players">Join</button>
      </div>
      <div class="nopadding col-1 border" >
          <button class = "btn btn-primary" @click= "goToMatch">Go To</button>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "~/components/beta/Card.vue"
export default {
  components: {
    Card
  },
  name: "MatchRow",
  props: ['match'],
    data () {
    return {
      playerName : null,
      playerPsw: null
    }
  },

  methods: {

    goToMatch(){
      this.$router.push({
          path: `/beta2/${this.match[0]}`
      })
    },

    async join() {
        try {
            const playersRef = this.$fireDb.ref(`players/${this.match[0]}`)
            let playersName = await playersRef.once('value',(snapshot) => {
                snapshot
            })
            let playerExists = null
            if(playersName.val()){
              playersName = Object.entries(playersName.val())
              playerExists = playersName.map( player => {
                return player[1].player_name
              }).includes(this.playerName)
            }

            
            if (!playerExists && this.match[1].joined_players < this.match[1].n_players){
              
              let newPlayerID = this.match[1].joined_players
              const matchRef = this.$fireDb.ref(`matches/${this.match[0]}`)
              await matchRef.update({
                  'joined_players': this.match[1].joined_players + 1
              })

              const playersRef = this.$fireDb.ref(`players/${this.match[0]}`)
              let playerObj = {}
              let admittedCallsObj= {}
              const gameRef = this.$fireDb.ref(`games/${this.match[0]}/game_${this.match[1].current_game}`)
              let nCards = await gameRef.child('n_cards').once('value',(snapshot) => {
                  snapshot
              })
              for (let i = 0; i <= nCards.val(); i++){
                  admittedCallsObj[parseInt(i)] = false
              }

              playerObj["player_" + newPlayerID] = {
                  is_ready: false,
                  player_name: this.playerName,
                  player_password: this.playerPsw,
                  n_lives: this.match[1].n_lives,
                  is_dead: false,
                  is_reborn: false,
                  is_winner: false,
                  current_call: null,
                  called_current_game: false,
                  his_turn: false,
                  next_index: newPlayerID + 1 === this.match[1].n_players ? 0 : newPlayerID + 1,
                  admitted_calls: admittedCallsObj        
              }
              await playersRef.update(playerObj)
            }
            else{
              console.log('already exists')
            }

            } 
        catch (e) {
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
