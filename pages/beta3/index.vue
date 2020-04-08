<template>

  <div class="container-fluid">
    <div>

      <div class="row text-center m-2">
        <div class="col">
          <create-match />
        </div>
      </div>

      <div class= "row text-center">
        <div class = "col-12">
          <match-table-head />
        </div>
      </div>

      <div class= "row text-center" v-for = "match in matches">
        <div class = "col-12">
          <match-row v-bind:match = match />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateMatch from '~/components/beta3/CreateMatch.vue'
import MatchRow from '~/components/beta3/MatchRow.vue'
import MatchTableHead from '~/components/beta/MatchTableHead.vue'
export default {
  components: {
    CreateMatch,
    MatchTableHead,
    MatchRow
  },
  data () {
    return {
      matches: null
    }
  },
  async created(){

      this.$fireDb.ref(`matches`).on('value', (snapshot) => {
        if(snapshot.val() ) this.matches = Object.entries(snapshot.val());
      })
  },

  methods: {

  }

}
</script>

<style>


.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
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
