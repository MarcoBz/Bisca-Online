<template>
  <div class="container-fluid">

    <div v-if = "show">

            <div class= "row text-center justify-content-center other-players">
                <div class = "col-2" v-for = "player in players">
                    <players-component v-bind:player = player   v-bind:game = game 
                                                                v-bind:currentPlayer = "player[0] === currentPlayer[0]"
                                                                v-bind:explosions = explosions
                                                                v-bind:aftermath = aftermath />
                </div>
            </div>

            <div class= "row text-center justify-content-center m-2">
                <div class="col-12">
                    <notice-board   v-bind:player = currentPlayer 
                                    v-bind:players = players
                                    v-bind:game = game
                                    v-bind:turn = turn
                                    v-bind:match = match
                                    v-bind:matchName = "inputMatch" 
                                    v-on:playedCard="playedCard"  />
                                    <!-- v-on:ready="updateReady" -->
                </div>
            </div> 

            <div class= "row text-center" v-if = "!match.is_ended"> 
                <div class = "col-12" >
                    <player-hand v-bind:player = currentPlayer 
                                v-bind:players = players
                                v-bind:game = game
                                v-bind:turn = turn
                                v-bind:matchName = "inputMatch" 
                                v-on:setCall="setCall"
                                v-on:playedCard="playedCard"/>
                </div>
            </div>

    </div>
  </div>
</template>

<script>
import PlayersComponent from "~/components/v1/PlayersComponent.vue"
import PlayerHand from "~/components/v1/PlayerHand.vue"
import NoticeBoard from "~/components/v1/NoticeBoard.vue"
export default {

    components: {
        PlayersComponent,
        PlayerHand,
        NoticeBoard
    },

    data () {
        return {
            show: null,
            inputMatch: this.$route.params.match,
            showTable: false,
            match: null,
            currentPlayer : null,
            players: null,
            game: null,
            turn: null,
            explosions: null,
            aftermath: null,
            names: ['A','B','C','D','E','F','G','H']
        }  
    },

    computed: {
        authUser() {
        return this.$store.state.authUser
        }
    },

    watch: {
        authUser(newAuthUser) {      
            if (newAuthUser === null){
                this.$router.push({
                    name: "login"
                })        
            }
        },

    },
    
    async mounted(){
        if(this.inputMatch){
            this.$fireDb.ref(`players/${this.inputMatch}`).on('value', (snapshot) => {
                if(snapshot.val()) {
                    this.players = Object.entries(snapshot.val());
                    this.currentPlayer  = this.players.find(c => c[1].player_uid === this.authUser.uid)
                }
                
            })

            this.$fireDb.ref(`matches/${this.inputMatch}`).on('value', (snapshot) => {
                this.match = snapshot.val();
                this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`).on('value', (snapshot) => {
                    this.game = snapshot.val();
                    this.$fireDb.ref(`turns/${this.inputMatch}/game_${this.match.current_game}/turn_${this.match.current_turn}`).on('value', (snapshot) => {
                        this.turn = snapshot.val();

                        if (this.match.current_game > 0){
                            this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game - 1}`).on('value', (snapshot) => { 
                                let oldGame = snapshot.val()
                                this.explosions = oldGame.explosions
                                this.aftermath = oldGame.final_lives
                            })                          
                        }
                        this.show = true
                    })
                })
            })
        }

    },

    methods:{

        async endTurn(turnRef) {
            await turnRef.update({
                is_ended: true
            })
        },

        async playedCard(payload){
            try {

                let currentPlayerIndex = parseInt(payload.player.split('_')[1])
                // let nextPlayerIndex = currentPlayerIndex + 1 == this.match.n_players ? 0 : currentPlayerIndex + 
                let nextPlayerIndex = this.players.find(c => c[0] === `player_${currentPlayerIndex}`)[1].next_index
                // let nextPlayerIndex = this.nextPlayerIndex(currentPlayerIndex, this.match.n_players)

                const gameRef = this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`)
                await gameRef.child(`hands/player_${currentPlayerIndex}/card_${payload.cardIndex}`).update({is_played : true})

                const turnRef= this.$fireDb.ref(`turns/${this.inputMatch}/game_${this.match.current_game}/turn_${this.match.current_turn}`)
                let obj = {}
                obj[payload.player] = payload.card           

                const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)

                if (nextPlayerIndex == this.turn.first_player_index){
                    // let playerRef = this.$fireDb.ref(`players/${this.inputMatch}/player_${currentPlayerIndex}`)
                    // await playerRef.update({
                    //     his_turn: false,
                    // }) 
                    await matchRef.update({
                        current_player_index: null
                    })

                    // setTimeout(this.endTurn, 2000, turnRef);
                    await turnRef.child('cards').update(obj)    
                    this.endTurn(turnRef)
                }
                else{
                    await matchRef.update({
                        current_player_index: nextPlayerIndex
                    })
                    const nextPlayerRef = this.$fireDb.ref(`players/${this.inputMatch}/player_${nextPlayerIndex}`)
                    await nextPlayerRef.update({
                        his_turn: true
                    }) 
                    await turnRef.child('cards').update(obj)    
                }

            } catch (e) {
            console.log(e)
            return
            }  
        },

        async setCall(payload){
            try {

                let currentPlayerIndex = parseInt(payload.player.split('_')[1])
                // let nextPlayerIndex = currentPlayerIndex + 1 == this.match.n_players ? 0 : currentPlayerIndex + 1
                let nextPlayerIndex = this.players.find(c => c[0] === `player_${currentPlayerIndex}`)[1].next_index
                // let nextPlayerIndex = this.nextPlayerIndex(currentPlayerIndex, this.match.n_players)

                const gameRef = this.$fireDb.ref(`games/${this.inputMatch}/game_${this.match.current_game}`)
                const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
                if(payload.oldCall != null){
                    await gameRef.update({
                        total_calls: this.match.current_total_calls - payload.oldCall
                    })
                    await matchRef.update({
                        current_total_calls: this.match.current_total_calls - payload.oldCall,
                        current_numbers_calls: this.match.current_numbers_calls - 1,
                    })
                }

                await matchRef.update({
                    current_total_calls: this.match.current_total_calls + payload.call,
                    current_numbers_calls: this.match.current_numbers_calls + 1,
                    current_player_index: nextPlayerIndex
                })

                await gameRef.update({
                    total_calls: this.game.total_calls + payload.call
                })
                let obj = {}
                obj[payload.player] = payload.call
                await gameRef.child('calls').update(obj)

                const nextPlayerRef = this.$fireDb.ref(`players/${this.inputMatch}/player_${nextPlayerIndex}`)
                await nextPlayerRef.update({
                    his_turn: true
                }) 

                if (nextPlayerIndex == this.game.dealer_index){

                    const turnRef= this.$fireDb.ref(`turns/${this.inputMatch}/game_${this.match.current_game}/turn_${this.match.current_turn}`)
                    await turnRef.update({
                        is_started: true,
                        first_player_index: this.game.dealer_index,
                    })

                }
                else{
                    let admittedCallsObj= {}
                    if(this.game.n_cards > 1){
                        for (let i = 0; i <= this.game.n_cards; i++){
                            admittedCallsObj[parseInt(i)] = (i > this.game.n_cards || this.game.n_cards == this.game.total_calls + i) ? false : true
                        }
                    }
                    else{
                        let nextAfterPlayerIndex = await nextPlayerRef.child(`next_index`).once('value',(snapshot) => {
                            snapshot
                        })  
                        admittedCallsObj= {
                            0: this.game.total_calls === 1 ? false : true,
                            1: (nextAfterPlayerIndex.val() === this.game.dealer_index && this.game.total_calls === 0) ? false : true,
                        }
                    }
                    await nextPlayerRef.update({
                        admitted_calls: admittedCallsObj
                    })
                }

            } catch (e) {
            console.log(e)
            return
            }  
        },

        // async updateReady(){
        //     try {
        //         const matchRef = this.$fireDb.ref(`matches/${this.inputMatch}`)
        //         await matchRef.update({
        //             'ready_players': this.match.ready_players + 1
        //         })
        //         if (this.match.ready_players === this.match.n_players){
        //             await matchRef.update({
        //                 'all_ready': true
        //             })                
        //         }
        //     } catch (e) {
        //     console.log(e)
        //     return
        //     }          
        // }
    }  
}
</script>

<style>

.other-players{
    margin-top:50 px;
}

</style>