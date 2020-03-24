<template>
  <div>
    <header>
      <nav class="navbar-expand-lg  fixed-top ">
        <div class="container-fluid">
          <div class= "row">
            <div class="col-md-3 col-1"></div>
            <div class="col-md-6 col-10 navbar-dark bg-dark">
              <div class= "row">
                <div class= "col-6">
                  <div class="row">
                    <div class="col nopadding text-left">
                      <div class="navbar-brand"><h5><u>Bisca Online</u></h5></div>
                    </div>                  
                  </div>
                </div>
               </div> 
            </div>
            <div class="col-md-3 col-1"></div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
}
</script>

<style>

    .nuxt-link-class {
      box-sizing: border-box;
      margin: 0 5px;
      color: lightgray;
      text-decoration: none;
    }

    nav.navbar {
      width: inherit;
          top: 0%;
      left: 50%;
      transform: translateX(-50%);
      
    }
  .row-eq-height {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display:         flex;
  }
</style>
