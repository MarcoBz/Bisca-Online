<template>

    <div class = "container-fluid">
        <div class = "row">
            <div class = "col-4"></div>   
            <div class = "col-4">
                <cv-form>
                    <div class = "row">
                        <div class = "col-12">
                            <cv-text-input
                                label="Email"
                                placeholder="Your Email"
                                v-model= "email">
                            </cv-text-input>                    
                        </div>   
                    </div> 
                    <div class = "row">
                        <div class = "col-12">
                            <cv-text-input
                                label="Password"
                                placeholder="Your Password"
                                v-model= "password">
                            </cv-text-input>             
                        </div>   
                    </div> 
                    <div class = "row text-left mt-1">
                        <div class = "col-12">
                                <cv-button @click= "login" :disabled= "!email && !password"  size="field">Login</cv-button>
                                <cv-button @click= "register" :disabled= "!email && !password" kind = "secondary"  size="field">Register</cv-button>
                        </div>   
                    </div> 
                </cv-form>            
            </div> 
            <div class = "col-4"></div>                    
        </div>

    </div>


</template>

<script>
import { CvButton, CvForm, CvTextInput, CvButtonSet } from '@carbon/vue';
import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    CvButton, 
    CvForm, 
    CvTextInput, 
    CvButtonSet
  },
  data () {
    return {
        email: null,
        password: null
    }
  },

  computed: {
    authUser() {
      return this.$store.state.authUser
    }
  },

  watch: {
    authUser(newAuthUser) {
      if (newAuthUser){
          this.$router.push({
              name: "user"
          })        
      }
    }
  },

  methods: {

    login() {
      this.$store.dispatch('signIn', {
        email: this.email,
        password: this.password
      })
      .then((data) => {
        this.email = null
        this.password = null
      })
      .catch((e) => {
        console.log(e.message);
      })
    },

    register() {
      this.$store.dispatch('signUp', {
        email: this.email,
        password: this.password
      })
      .then(async () => {
        this.email = null
        this.password = null
      })
      .catch((e) => {
        alert(e.message);
      })
    }

  }

}
</script>

<style>
</style>
