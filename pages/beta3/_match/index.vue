<template>
  <div class="container-fluid">

    <div v-if = "match && game && turn">
        <div class= "row text-center">
            <div class = "col-12">
                <details-table-head />
            </div>
        </div>
        <div class= "row text-center">
            <div class = "col-12">
                <details-row v-bind:match = match v-bind:matchName = "inputMatch" />
            </div>
        </div>
        <div class= "row m-1">

        </div>
        <div class= "row text-center  nopadding ">
            <div class = "col-12  nopadding">
                <match-players-head />
            </div>
        </div>
        <div class= "row text-center nopadding row-eq-height" v-for = "player in players">
            <div class = "col-12  nopadding" >
                <match-players-row v-bind:player = player 
                            v-bind:players = players
                            v-bind:match = match
                            v-bind:game = game
                            v-bind:turn = turn
                            v-bind:matchName = "inputMatch"/>
                
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import MatchPlayersRow from "~/components/beta3/MatchPlayersRow.vue"
import MatchPlayersHead from "~/components/beta/MatchPlayersHead.vue"
import DetailsRow from "~/components/beta/DetailsRow.vue"
import DetailsTableHead from "~/components/beta/DetailsTableHead.vue"

export default {
    components: {
        MatchPlayersRow,
        MatchPlayersHead,
        DetailsRow,
        DetailsTableHead
    },

    data () {
        return {
            inputMatch: this.$route.params.match,
            match: null,
            players: null,
            game: null,
            turn: null,
            names: ['A','B','C','D','E','F','G','H']
        }  
    },

    async mounted(){
        if(this.inputMatch){
            this.showMatch = true
            this.$fireDb.ref(`players/${this.inputMatch}`).on('value', (snapshot) => {
                if(snapshot.val()) this.players = Object.entries(snapshot.val());
                
            })

            this.$fireDb.ref(`matches/${this.inputMatch}`).on('value', (snapshot) => {
                this.match = snapshot.val();
                this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`).on('value', (snapshot) => {
                    this.game = snapshot.val();
                    this.$fireDb.ref(`turns/${this.inputMatch}/game_${this.match.current_game}/turn_${this.match.current_turn}`).on('value', (snapshot) => {
                        this.turn = snapshot.val();
                    })
                })
            })
        }

    },

    methods:{
        goToTable(player){
            this.$router.push({
                path: `/${this.$route.params.match}/${player}`
            })
        },
    }

}
</script>
<style>
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