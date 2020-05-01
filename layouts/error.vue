<template>
  <div class="container">
    <h1 v-if="!error.authorized || error.statusCode === 403">You aren't authorized</h1>
    <h1 v-else>An error occurred</h1>
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>


<script>
export default {
  props: ['error']
}
</script>