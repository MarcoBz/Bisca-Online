<template>
  <div class="container">
    <h1 v-if="error.message || error.statusCode === 403">{{error.message}}</h1>
    <h1 v-else>An error occurred</h1>
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>


<script>
export default {
  props: ['error']
}
</script>