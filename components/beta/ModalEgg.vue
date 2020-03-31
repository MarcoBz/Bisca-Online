<template>
    <div>
      <div v-if="showModal">
        <transition name="modal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <div class="container-fluid">
                      <div class="row justify-content-sm-center">
                        <div class="col-sm-12"><h3 class="modal-title">{{tvSeriesDetails.title}}</h3> </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-body">
                    <div class="container-fluid">
                      <div class="row justify-content-sm-center">
                        <div class="col-sm-12">
                          <span v-for= "genre in tvSeriesDetails.genres">{{genre}} </span> 
                        </div>
                      </div>
                      <hr>
                      <div class="row justify-content-sm-center">
                        <div class="col-sm-12">
                          <span v-for= "network in tvSeriesDetails.networks">{{network}} </span> 
                        </div>
                      </div>
                      <hr>
                      <div class="row justify-content-sm-center" v-for= "season in tvSeriesDetails.seasons" >
                        <div class="col-sm-12">
                          Season {{season.seasonNumber}} : {{season.numEpisodes}} Episodes
                        </div>
                      </div>   
                      <hr>
                      <div class="row justify-content-sm-center" v-if="tvSeriesDetails.lastEpAired.airDate">
                        <div class="col-sm-12">
                          Last Episode : S{{tvSeriesDetails.lastEpAired.seasonNumber}}E{{tvSeriesDetails.lastEpAired.episodeNumber}} - {{tvSeriesDetails.lastEpAired.airDate}}
                        </div>
                      </div>
                      <div class="row justify-content-sm-center" v-else>
                        <div class="col-sm-12">
                          Last Episode : --
                        </div>
                      </div>
                      <hr>
                      <div class="row justify-content-sm-center" v-if="tvSeriesDetails.nextEpAired.airDate">
                        <div class="col-sm-12">
                          Next Episode : S{{tvSeriesDetails.nextEpAired.seasonNumber}}E{{tvSeriesDetails.nextEpAired.episodeNumber}} - {{tvSeriesDetails.nextEpAired.airDate}}
                        </div>
                      </div>    
                      <div class="row justify-content-sm-center" v-else>
                        <div class="col-sm-12">
                          Next Episode : --
                        </div>
                      </div>                 
                    </div>
                  </div>
                  <div class="modal-footer">
                    <div class="container-fluid">
                      <div class="row">
                        <div class="col-sm-4 text-center">
                          <button type="button" class="close" @click="showModal=false">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">Close</span> 
                          </button>                          
                        </div>
                        <div class="col-sm-4 text-center">
                          <button type="button" class="close" v-on:click= "changeTvSeriesStatus(tvSeriesDetails.tmdbID)">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">Start</span> 
                          </button> 
                        </div>
                        <div class="col-sm-4 text-center">
                          <button type="button" class="close"@click="deletingTvSeries=true">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">Delete</span> 
                          </button> 
                        </div>
                      </div>
                      <div v-if="deletingTvSeries" class="row">
                        <div class="col-sm-12"><h4 class="modal-title">Are You Sure?</h4> </div>
                      </div>
                      <div v-if="deletingTvSeries" class="row">
                        <div class="col-sm-6 text-center">
                          <button type="button" class="close" v-on:click="deleteTvSeries(tvSeriesDetails.tmdbID)">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">Yes</span> 
                          </button> 
                        </div>
                        <div class="col-sm-6 text-center">
                          <button type="button" class="close" @click="deletingTvSeries=false">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">No</span> 
                          </button> 
                        </div>
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>          
    </div>
</template>

<script>
export default {
    name: "ModalEgg",
    props: ['card'],
    data () {
        return {
            
        }
    }
}
</script>