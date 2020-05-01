<template>
  <div>
    <cv-header aria-label="Carbon header">
      <cv-header-name href="javascript:void(0)" @click ="backHome">
        Bisca Online
      </cv-header-name>
      <template slot="header-global">
        <cv-header-global-action aria-label="User avatar" aria-controls="user-panel"
          :disabled= "!authUser"
          @click= "goToUser">
          <UserAvatar32 />
        </cv-header-global-action>
        <cv-header-global-action
          aria-label="App switcher"
          aria-controls="switcher-panel">
          <ReportData32 />
        </cv-header-global-action>
      </template>
    </cv-header>
  </div>
</template>

<script>
import { CvHeader,CvHeaderName, CvHeaderGlobalAction} from '@carbon/vue';
import ReportData32 from "@carbon/icons-vue/es/report--data/32";
import UserAvatar32 from "@carbon/icons-vue/es/user--avatar/32";
export default {
  components: {
    CvHeader,
    UserAvatar32, 
    ReportData32,
    CvHeaderName,
    CvHeaderGlobalAction
  },
  data () {
    return {
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

  methods:{

    goToUser(){
      this.$router.push({
          path: `/user`
      })
    },

    backHome(){
      this.$router.push({
          path: `/`
      })
    }

  }

}
</script>

<style lang="scss">


</style>
