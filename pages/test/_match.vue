<template>
  <div class="container-fluid">

    <div class= "row text-center">
    <div class = "col-12">
        <details-table-head />
    </div>
    </div>
    <div class= "row text-center" v-if="match">
    <div class = "col-12">
        <details-row v-bind:match = match v-bind:matchName = "$route.params.match" />
    </div>
    </div>

    <div class= "row text-center">
      <div class="col-12">
          <span><button class="btn btn-secondary m-3" @click= "addPlayer" v-bind:disabled = "match.joined_players == match.n_players"> Join </button></span>
          <span><button class="btn btn-secondary m-3" @click= "addPlayer" v-bind:disabled = "match.ready_players != match.n_players"> Start </button></span>
      </div>
    </div>  

    <div class= "row text-center">
    <div class = "col-12">
        <player-table-head />
    </div>
    </div>
    <div class= "row text-center" v-for = "player in players">
    <div class = "col-12">
        <player-row v-bind:player = player v-bind:matchName = "$route.params.match" v-on:ready="updateReady" v-if="match" />
    </div>
    </div>

  </div>
</template>

<script>
import PlayerRow from "~/components/Test/PlayerRow.vue"
import PlayerTableHead from "~/components/Test/PlayerTableHead.vue"
import DetailsRow from "~/components/Test/DetailsRow.vue"
import DetailsTableHead from "~/components/Test/DetailsTableHead.vue"

export default {
    components: {
        PlayerRow,
        PlayerTableHead,
        DetailsRow,
        DetailsTableHead
    },

    data () {
        return {
            match: null,
            players: null,
            game: null,
            turn: null,
            names: ['A','B','C','D','E','F','G','H']
        }  
    },

    async created(){

        this.$fireDb.ref(`players/${this.$route.params.match}`).on('value', (snapshot) => {
            if(snapshot.val()) this.players = Object.entries(snapshot.val());
            
        })

        this.$fireDb.ref(`matches/${this.$route.params.match}`).on('value', (snapshot) => {
            this.match = snapshot.val();
            this.$fireDb.ref(`games/${this.$route.params.match}/game_${this.match.current_game}`).on('value', (snapshot) => {
                this.game = snapshot.val();
                this.$fireDb.ref(`turns/${this.$route.params.match}/game_${this.match.current_game}/turn_${this.match.current_turn}`).on('value', (snapshot) => {
                    this.turn = snapshot.val();
                    // console.log(this.match, this.game, this.turn)
                })
            })
        })
    },

  methods:{

    async updateReady(){
        try {
          const matchRef = this.$fireDb.ref(`matches/${this.$route.params.match}`)
          await matchRef.update({
            'ready_players': this.match.ready_players + 1
          })
        } catch (e) {
          console.log(e)
          return
        }          
    },

    async addPlayer() {
        try {
            let newPlayerID = this.match.joined_players
            const matchRef = this.$fireDb.ref(`matches/${this.$route.params.match}`)
            await matchRef.update({
                'joined_players': this.match.joined_players + 1
            })

            const playersRef = this.$fireDb.ref(`players/${this.$route.params.match}`)
            let playerObj = {}
            playerObj["player_" + newPlayerID] = {
                is_ready: false,
                player_name: this.names[this.match.joined_players - 1 ],
                n_lives: this.match.n_lives,
                is_dead: false,
                is_reborn: false            
            }
            console.log(playerObj)
            await playersRef.update(playerObj)

            const gamesRef = this.$fireDb.ref(`games/${this.$route.params.match}/game_0`)
            if (newPlayerID == 0){
                await gamesRef.update({
                    calls: {
                        player_0: 0
                    },
                    totals: {
                        player_0: 0
                    }
                })

            }

            else {
                let obj = {}
                obj["player_" + newPlayerID] = 0
                await gamesRef.child("calls").update(obj)
                await gamesRef.child("totals").update(obj)
            }

            } catch (e) {
                console.log(e)
                return
            }
        }
    }

}
</script>