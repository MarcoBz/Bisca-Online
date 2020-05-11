<template>

    <div class = "container-fluid" v-if = "user">

        <div class= "row mt-2 mb-2">
            <div class = "col-2 "></div>
            <div class = "col-4  text-left">
                <h1>{{$route.params.room}}</h1>
            </div>
            <div class = "col-3 text-right" v-if = "showPassword">
                <h3>{{room.password}}</h3>
            </div>
            <div class = "col-3 text-right" v-else>
                <h3>Password</h3>
            </div>
            <div class = "col-1 text-right" @mouseenter = "showPassword = true" @mouseleave = "showPassword = false">
               <locked32  />
            </div>
        </div>   
        <div class= "row mt-1 mb-1">
            <div class = "col-2"></div>
            <div class = "col-2 text-left">
                <cv-button @click= "visibleModal = true;" size="field" >Create Match</cv-button>
            </div>
            <div class = "col-6 text-right">
                <cv-button @click= "sortChart(); chartModal = true;" kind="secondary" size="field" >See Chart</cv-button>
            </div>
        </div> 
        <div class= "row mt-1 mb-1">
            <div class = "col-2"></div>
            <div class = "col-8 text-left">
                <cv-data-table
                        :title= "matchesTable.title"
                        :columns= "matchesTable.columns"
                        v-if = "room">
                    <template slot="data">
                        <cv-data-table-row v-for= "(match, matchName) in matchesTable.filteredData">
                            <cv-button @click= "joinMatch(matchName)" v-if = "!room.matches[matchName].users" type="button" style="width: 100%;">Join</cv-button>
                            <cv-button @click= "joinMatch(matchName)" v-else-if = "!room.matches[matchName].users[authUser.uid] && !matchesTable.data.find(c=>c.match === matchName).all_joined" type="button" style="width: 100%;">Join</cv-button>
                            <cv-button @click= "goToMatch(matchName)" v-else-if = "!room.matches[matchName].users[authUser.uid] && matchesTable.data.find(c=>c.match === matchName).all_joined" type="button" style="width: 100%;" >Go as Guest</cv-button>
                            <cv-button @click= "goToMatch(matchName)" v-else-if = "room.matches[matchName].users[authUser.uid]" type="button" style="width: 100%;">Go</cv-button>
                            <cv-data-table-cell>{{matchName}}</cv-data-table-cell>
                            <cv-data-table-cell>{{match[2]}}</cv-data-table-cell>
                            <cv-data-table-cell>{{match[3]}}</cv-data-table-cell>
                            <cv-data-table-cell>{{match[4]}}</cv-data-table-cell>
                            <cv-data-table-cell>{{match[5]}}</cv-data-table-cell>
                            <cv-data-table-cell>{{match[6]}}</cv-data-table-cell>
                            <cv-button v-if = "!room.matches[match[1]].users || matchesTable.data.find(c=>c.match === match[1]).is_ended" kind="danger" :disabled= true type="button" style="width: 100%;">Report Error</cv-button>
                            <cv-button @click= "reportError(match[1])" v-else-if = "!error_reported[match[1]] && room.matches[match[1]].users[authUser.uid]" kind="danger" type="button" style="width: 100%;">Report Error</cv-button>
                            <cv-button v-else-if = "!room.matches[match[1]].users[authUser.uid]" kind="danger" :disabled= true type="button" style="width: 100%;">Report Error</cv-button>
                            <cv-button v-else kind="danger" type="button" :disabled= true style="width: 100%;">Error</cv-button>
                        </cv-data-table-row>
                    </template>
                </cv-data-table>
            </div>
        </div> 
        <cv-modal
            :visible= "visibleModal"
            @modal-hidden= "visibleModal = false; matchData.nPlayers = null; matchData.nLives = null"
            :primary-button-disabled= "!matchData.nPlayers || !matchData.nLives || parseInt(matchData.nPlayers) <= 0 || parseInt(matchData.nLives) <= 0"
            @primary-click= "submitMatch">
            <template slot="title">Create Match</template>
            <template slot="content">
                <div class="bx--form-item">
                    <label for="text-input-nPlayers" class="bx--label">Number of Players</label>
                    <input id="text-input-nPlayers" type="text" class="bx--text-input" placeholder="N. Players" data-modal-primary-focus v-model = "matchData.nPlayers">
                </div>
                <div class="bx--form-item">
                    <label for="text-input-nLives" class="bx--label">Number of Lives</label>      
                    <input id="text-input-nLives" type="text" class="bx--text-input" placeholder="N. Lives" data-modal-primary-focus v-model = "matchData.nLives">
                </div>
                </template>
            <template slot="primary-button" >Submit</template>
        </cv-modal>

        <cv-modal
            :visible="createdModal"
            @modal-hidden="createdModal = false">
            <template slot="title">Match_{{totalMatches}} Created</template>
        </cv-modal>

        <cv-modal
            :visible= "chartModal"
            @modal-hidden= "chartModal = false">
            <template slot="title">Chart</template>
            <template slot="content">
                <cv-data-table
                    :columns= "chart.columns" 
                    :data= "chart.filteredData"   ref="tableChart">
                    {{chart}}
                </cv-data-table>
            </template>
        </cv-modal>
    </div>


</template>

<script>
import {auth} from '@/services/fireinit.js'
import { CvDropdown, CvDropdownItem, CvButton, CvForm, CvDataTable, CvModal, CvDataTableRow, CvDataTableCell } from '@carbon/vue';
import Locked32 from "@carbon/icons-vue/es/locked/32";
export default {
    name: "user",
    components: {
        CvButton,
        CvDropdown, 
        CvDropdownItem,
        CvForm, 
        CvDataTable, 
        CvModal,
        CvDataTableRow, 
        CvDataTableCell,
        Locked32
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

    data () {
        return {
            chartModal: false,
            chart:{
                title: "Chart",
                columns: [
                    "Position", "Name", "Email", "Record"
                ],
                filteredData: [],
                record:[],
            },
            showPassword: false,
            matchData: {
                nLives: null,
                nCards: 5,
                nPlayers: null
            },
            createdModal: false,
            totalMatches: null,
            visibleModal: false,
            matchesTable: {
                title: "Matches",
                columns: [
                    "", "match", "status", "Lives", "Joined", "Ready", "Winner", "Report Error"
                ],
                filteredData: {},
                data:[]
            },
            user: null,
            room: null,
            error_reported: {},
            tempFilteredData: {},
            tempData: []
        }
    },

    async mounted(){
             this.$fireDb.ref(`users/${this.authUser.uid}`).on('value', (snapshot) => {
                this.user = snapshot.val()
                if(this.user){
                    if (!this.user.user_name) this.visibleModal = true
                }
                this.$fireDb.ref(`rooms/${this.$route.params.room}`).on('value', (snapshot) => {
                    this.room = snapshot.val() 
                    this.$fireDb.ref('total_matches').on('value', (snapshot) => {
                        this.totalMatches = snapshot.val();
                    })

                    this.chart.filteredData = []
                    this.chart.record = []
                    if (this.room.users){
                        let users = Object.entries(this.room.users).forEach((user) => {
                            let obj = {
                                email: user[1].email,
                                user_name: user[1].user_name,
                                w: this.room.users[user[0]].w,
                                t: this.room.users[user[0]].t,
                                rank: null
                            }
                            this.chart.record.push(obj)
                        })
                    }



                    this.matchesTable.filteredData = []
                    this.matchesTable.data = []
                    if(this.room){
                        if (this.room.users){
                            let users = Object.entries(this.room.users).forEach((user) => {
                                let obj = {
                                    email: user[1].email,
                                    user_name: user[1].user_name,
                                    w: this.room.users[user[0]].w,
                                    t: this.room.users[user[0]].t,
                                    rank: null
                                }

                            this.chart.record.push(obj)

                            })

                        }
                        // this.matchesTable.filteredData = []
                        this.tempData = []
                        if(this.room.matches) {
                            let matches = Object.entries(this.room.matches).map((match) => {
                                return new Promise((resolve) => {
                                    this.$fireDb.ref(`matches/${match[0]}`).on('value', (snapshot) => {
                                        let matchRef = snapshot.val()
                                        let array = ['', match[0], null, matchRef.n_lives, `${matchRef.joined_players}/${matchRef.n_players}`, matchRef.ready_players, null]
                                        if (matchRef.is_noWinner)  array[6] = "No Winner"
                                        else {
                                            if (matchRef.winner_player_index || matchRef.winner_player_index === 0){
                                                this.$fireDb.ref(`players/${match[0]}/player_${matchRef.winner_player_index}`).on('value', (snapshot) => {
                                                    let player = snapshot.val()
                                                    array[6] = player.player_name
                                                })
                                            }
                                        }
                                        this.tempFilteredData[match[0]] = array
                                        this.tempData.push({
                                            match: match[0],
                                            is_started: matchRef.is_started,
                                            is_ended: matchRef.is_ended,
                                            n_players: matchRef.n_players,
                                            joined_players: matchRef.joined_players,
                                            all_joined: matchRef.all_joined,
                                            creationDate: matchRef.creation_date
                                        })
                                        resolve()
                                    })
                                });
                            })
                            Promise.all(matches).then(() => {
                                this.matchesTable.filteredData = this.tempFilteredData
                                this.matchesTable.data = this.tempData
                            });
                        }
                    }


                })       
            }) 
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

    methods:{

        async reportError(match) {
            try{
                const playersRef = this.$fireDb.ref(`players/${match}`)
                let playersName = await playersRef.once('value',(snapshot) => {
                    snapshot
                })
                playersName = Object.entries(playersName.val())
                let player = playersName.find( c => c[1].player_uid === this.authUser.uid)
                const playerRef = this.$fireDb.ref(`players/${match}/${player[0]}`)
                await playerRef.update({
                    report_error: true
                })
                // this.errorReported = true
            }
            catch (e) {
                    console.log(e)
                    return
            }
        },

        async joinMatch(match) {
            try {
                const playersRef = this.$fireDb.ref(`players/${match}`)
                let playersName = await playersRef.once('value',(snapshot) => {
                    snapshot
                })
                let playerExists = null
                if(playersName.val()){
                    playersName = Object.entries(playersName.val())
                    playerExists = playersName.map( player => {
                        return player[1].player_uid
                    }).includes(this.authUser.uid)
                }
                const matchRef = this.$fireDb.ref(`matches/${match}`)
                let matchJoined = await matchRef.once('value',(snapshot) => {
                    snapshot
                })
                matchJoined = matchJoined.val()
                if (!playerExists && !matchJoined.all_joined){
                    let newPlayerID = matchJoined.joined_players
                    const playersRef = this.$fireDb.ref(`players/${match}`)
                    let playerObj = {}
                    let admittedCallsObj= {}
                    const gameRef = this.$fireDb.ref(`games/${match}/game_${matchJoined.current_game}`)
                    let nCards = await gameRef.child('n_cards').once('value',(snapshot) => {
                        snapshot
                    })
                    for (let i = 0; i <= nCards.val(); i++){
                        admittedCallsObj[parseInt(i)] = false
                    }
                    newPlayerID += 1
                    playerObj["player_" + newPlayerID] = {
                        is_ready: false,
                        player_uid: this.authUser.uid,
                        player_name: this.user.user_name,
                        n_lives: matchJoined.n_lives,
                        is_dead: false,
                        is_reborn: false,
                        is_winner: false,
                        current_call: null,
                        called_current_game: false,
                        his_turn: false,
                        next_index: newPlayerID + 1 === matchJoined.n_players ? 0 : newPlayerID + 1,
                        admitted_calls: admittedCallsObj        
                    }
                    await playersRef.update(playerObj)
                    
                    const roomRef = this.$fireDb.ref(`rooms/${this.$route.params.room}`)
                    let obj = {}
                    obj[`${this.authUser.uid}`] = true
                    await roomRef.child(`matches/${match}/users`).update(obj)                    
                    await roomRef.child(`users/${this.authUser.uid}`).update({
                        t: this.room.users[this.authUser.uid].t + 1
                    })  

                    const userRef = this.$fireDb.ref(`users/${this.authUser.uid}`)
                    await userRef.child(`rooms/${this.$route.params.room}`).update({
                        t: this.user.rooms[this.$route.params.room].t + 1
                    })                    
                    await userRef.child(`record`).update({
                        t: this.user.record.t + 1
                    }) 
                }
                else{
                    console.log('already exists')
                }

                } 
            catch (e) {
                    console.log(e)
                    return
            }
        },

        sortChart(){
            let count = 0
            this.chart.record = this.chart.record.sort(function (a, b) {   
                return b.w - a.w || a.t - b.t;
            })
            this.chart.record.forEach(user => {
                this.chart.filteredData[count] = [count+1, user.user_name, user.email, `${user.w}/${user.t}`]
                count += 1
            });

        },

        async submitMatch(){
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
                    creator: this.authUser.uid,
                    room: this.$route.params.room,
                    creation_date : (new Date()).toISOString(),
                    is_started: false,
                    is_ended: false,
                    n_players : parseInt(this.matchData.nPlayers),
                    joined_players: 0,
                    ready_players: 0,
                    n_lives : parseInt(this.matchData.nLives),
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
                    all_joined: false,
                    egg_played: false    
                }

                await matchesRef.update(obj)
        
                const gamesRef = this.$fireDb.ref(`games`)
                let gameObj = {}
                gameObj["match_" + newMatchID] = {}
                gameObj["match_" + newMatchID]["game_0"] = {
                    is_started: false,
                    is_ended: false,
                    n_cards: this.matchData.nCards,
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

                const roomRef = this.$fireDb.ref(`rooms/${this.$route.params.room}`)
                let roomObj = {
                    matches:{}
                }
                roomObj["match_" + newMatchID] = {
                    creator: this.authUser.uid,
                    creation_date : (new Date()).toISOString(),
                    n_players : parseInt(this.matchData.nPlayers),
                    n_lives : parseInt(this.matchData.nLives),
                }
                await roomRef.child('matches').update(roomObj)  
                
                    
                this.visibleModal = false  
                this.createdModal = true

                } catch (e) {
                console.log(e)
                return
                }

            } catch (e) {
                console.log(e)
                return
            }
        },

        goToMatch(match){
            this.$router.push({
                path: `/v1/matches/${match}`
            })            
        }

    }
}
</script>

<style>

.colHeight{
    height: 50px
}

</style>
