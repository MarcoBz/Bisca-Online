<template>

    <div class = "container-fluid" v-if = "user">

        <div class= "row mt-2 mb-2">
            <div class = "col-2 "></div>
            <div class = "col-4  text-left">
                <h1>{{user.user_name}}</h1>
            </div>
            <div class = "col-4 text-right">
                <cv-button @click= "logout" kind="danger" size="field">Logout</cv-button>
            </div>
        </div>   
        <div class= "row mt-2 mb-1">
            <div class = "col-2 "></div>
            <div class = "col-4 text-left">
                <h5>{{user.email}}</h5>
            </div>
            <div class = "col-4 text-right">
                <cv-button @click= "visibleModal = true" size="field">Change Name</cv-button>
            </div>
        </div> 
        <div class= "row mt-2 mb-4">
            <div class = "col-2 "></div>
            <div class = "col-4 text-left">
                <h4>Record: {{user.record.w}}/{{user.record.t}}</h4>
            </div>
            <div class = "col-4 text-left">
            </div>
        </div> 

        <div class= "row mt-1 mb-1">
            <div class = "col-2"></div>
            <div class = "col-2 text-left">
                <cv-button @click= "modalRoom = true; actionRoom = 'create'" size="field" >Create Room</cv-button>
            </div>
            <div class = "col-8"></div>
        </div> 
        <div class= "row mt-1 mb-1">
            <div class = "col-2"></div>
            <div class = "col-2 text-left">
                <cv-button @click= "modalRoom = true; actionRoom = 'search'" kind="secondary" size="field">Search Room</cv-button>
            </div>
            <div class = "col-8"></div>
        </div> 
        <div class= "row mt-1 mb-1">
            <div class = "col-2"></div>
            <div class = "col-3 text-left">
                <cv-dropdown 
                    v-model = "chosenRoomName"
                    :placeholder= "'Choose a Room'"
                    @change = "goToRoom">
                        <cv-dropdown-item  v-for= "(room, roomName) in user.rooms" :value= "roomName" >
                            {{roomName}}
                        </cv-dropdown-item>
                </cv-dropdown>
            </div>               
            <div class = "col-7"></div>
        </div> 

        <!-- <div class= "row mt-5 mb-1">
            <div class = "col-2"></div>
            <div class = "col-8 text-left">
                <cv-data-table
                    :title= "title"
                    :columns= "columns" :data="filteredData"   ref="table">
                </cv-data-table>
            </div>
        </div>  -->

        <cv-modal
            :visible= "modalRoom"
            @modal-hidden= "modalRoom = false"
            :primary-button-disabled= "!inputRoom || !inputPassword"
            @primary-click= "functionRoom">
            <template slot="title" v-if = "actionRoom === 'create'">Create Room</template>
            <template slot="title" v-if = "actionRoom === 'search'">Join Room</template>
            <template slot="content">
                <div class="bx--form-item">
                    <input id="text-input-3h9mddk235a" type="text" class="bx--text-input" placeholder="Room Name" data-modal-primary-focus v-model = "inputRoom">
                </div>
                <div class="bx--form-item">
                    <input id="text-input-3h9mddk235a" type="text" class="bx--text-input" placeholder="Password" data-modal-primary-focus v-model = "inputPassword">
                </div>
                </template>
            <template slot="primary-button" >Submit</template>
        </cv-modal>

        <cv-modal
            :visible= "visibleModal"
            @modal-hidden= "visibleModal = false"
            
            @primary-click= "submitName">
            <template slot="title">Set your name</template>
            <template slot="content">
                <div class="bx--form-item">
                    <input id="text-input-3h9mddk235a" type="text" class="bx--text-input" placeholder="Your name" data-modal-primary-focus v-model = "inputName">
                </div>
                </template>
            <template slot="primary-button" >Submit</template>
        </cv-modal>


    </div>


</template>

<script>
import {auth} from '@/services/fireinit.js'
import { CvDropdown, CvDropdownItem, CvButton, CvForm, CvDataTable, CvModal } from '@carbon/vue';
import Search20 from "@carbon/icons-vue/es/search/20";
export default {
    name: "user",
  components: {
    CvButton,
    CvDropdown, 
    CvDropdownItem,
    CvForm, 
    CvDataTable, 
    CvModal
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

    visibleModal(newVisibileModal){
        if (newVisibileModal === false && (this.user.user_name === "" || !this.user.user_name)){
            let self = this
            setTimeout(() => {
                self.visibleModal = true
            }, 100);

        }
    },

  },

  data () {
    return {
        visibleModal: false,
        modalRoom: false,
        title: "Your Matches",
        columns: [
            "", "match", "room", "status"
        ],
        filteredData: [],
        user: null,
        inputName: null,
        inputPassword: null,
        inputRoom: null,
        chosenRoomName: null,
        actionRoom: null
    }
  },

    mounted(){

        if(this.authUser){
            this.$fireDb.ref(`users/${this.authUser.uid}`).on('value', (snapshot) => {
                this.user = snapshot.val()
                if(this.user){
                    if (!this.user.user_name) this.visibleModal = true

                }
               
            }) 
        }
    },

    methods:{

        goToRoom(){
            this.$router.push({
                path: `/v1/rooms/${this.chosenRoomName}`
            })
        },

        async submitName(){
            if(this.authUser){
                let ref = this.$fireDb.ref(`users/${this.authUser.uid}`)
                await ref.update({user_name : this.inputName})
                let rooms =await ref.child('rooms').once('value',(snapshot) => {
                    snapshot
                }) 
                for(let room in rooms.val()){
                    let roomRef = this.$fireDb.ref(`rooms/${room}/users/${this.authUser.uid}`)
                    await roomRef.update({user_name : this.inputName})
                }
                this.inputName = null
                this.visibleModal = false

            }
        },

        functionRoom(){
            if(this.actionRoom === "search") this.searchRoom()
            else if (this.actionRoom === "create") this.createRoom()
            this.actionRoom = null
        },

        async createRoom(){

            const ref = this.$fireDb.ref()
            let room = await ref.child(`rooms/${this.inputRoom}`).once('value',(snapshot) => {
                snapshot
            })
            room = room.val()
            if (room) {
                alert('Room already exists')
                this.inputRoom = null
                this.inputPassword = null
                this.modalRoom = false
            }
            else{
                let obj = {}
                obj[this.inputRoom] = {
                    creation_date : (new Date()).toISOString(),
                    password: this.inputPassword,
                    users:{},
                    is_creator: this.authUser.uid
                }
                obj[this.inputRoom].users[this.authUser.uid] = {
                    user_name: this.user.user_name,
                    email: this.user.email,
                    w: 0,
                    t: 0
                }
                let userObjRef = {}
                userObjRef[this.inputRoom] = {
                    w: 0,
                    t: 0,
                    is_creator: true
                }

                await ref.child('rooms').update(obj)
                await ref.child(`users/${this.authUser.uid}/rooms`).update(userObjRef)
                this.inputRoom = null
                this.inputPassword = null
                this.modalRoom = false
            }

        },

        async searchRoom(){
            const ref = this.$fireDb.ref()
            let room = await ref.child(`rooms/${this.inputRoom}`).once('value',(snapshot) => {
                snapshot
            })
            room = room.val()
            if (!room) {
                alert('Room does not exists')
                this.inputRoom = null
                this.inputPassword = null
                this.modalRoom = false
            }
            else {

                if (this.inputPassword != room.password){
                    alert('Wrong Password')
                    this.inputRoom = null
                    this.inputPassword = null
                    this.modalRoom = false
                }

                else if (room.users[this.authUser.uid]){
                    alert('Already joined this room')
                    this.inputRoom = null
                    this.inputPassword = null
                    this.modalRoom = false
                }

                else{
                    let obj = {}
                    obj[this.authUser.uid] = {
                        user_name: this.user.user_name,
                        email: this.user.email,
                        w: 0,
                        t: 0
                    }
                    await ref.child(`rooms/${this.inputRoom}/users`).update(obj)
                    let userObjRef = {}
                    userObjRef[this.inputRoom] = {
                        w: 0,
                        t: 0,
                        is_creator: false
                    }
                    await ref.child(`users/${this.authUser.uid}/rooms`).update(userObjRef)
                    this.inputRoom = null
                    this.inputPassword = null
                    this.modalRoom = false
                }

            }
        },

        logout() {
            this.$store.dispatch('signOut')
            .then(() => {
                this.$router.push({
                    path: `/v1/login`
                })
            })
            .catch((e) => {
                console.log(e.message);
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
