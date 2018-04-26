<template>
  <div id="app">
    <AppTitle/>
    <router-view></router-view>
  </div>
</template>

<script>
  import AppTitle from './components/title/AppTitle'

  export default {
    name: 'rediger',
    components: {
      AppTitle
    }
  }
</script>

<style>
  /* CSS */
  body {
    overflow: hidden;
  }
</style>
