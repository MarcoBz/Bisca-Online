<template>
  <div class="container-fluid">
        <div class="row justify-content-center">
          <div class= "col-12">
            <nav-bar/>
          </div>
        </div>
          <div class= "row">
            <div class="col-md-1"></div>
            <div class="col-md-10 col-12 text-muted text-center">
              <nuxt class="main" />
            </div>
            <div class="col-md-1"></div>
          </div>
        <!-- <div class="row justify-content-center">
          <div class= "col-12">
            <footer-component/>
          </div>
        </div>         -->
  </div>
</template>
<script>
  import NavBar from "~/components/NavBar.vue";
  import FooterComponent from "~/components/FooterComponent.vue";

  export default {
    components: {
      NavBar,
      FooterComponent
    }
  };
</script>
<style>

.main{
  margin-top: 100px;
  margin-bottom: 120px;
}

.flex-fill {
    flex:1;
}

body{
  height: 100%
}

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
