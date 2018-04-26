<template>
  <div id="app-title">
      <div id="app-title-btn-group">
          <AppTitleButton type="min"/>
          <AppTitleButton type="close"/>
      </div>
  </div>
</template>

<script>
  import AppTitleButton from './AppTitleButton'

  export default {
    name: 'AppTitle',
    components: {
      AppTitleButton
    },
    methods: {
    }
  }
</script>
    
<style>
#app-title {
    width: 100%;
    height: 30px;
    background: rgb(102, 102, 102);
    -webkit-app-region: drag;
    border-bottom: 1px solid rgb(43, 43, 43);
    box-sizing: border-box;
    overflow: hidden;
}

#app-title-btn-group {
    float: right;
}
</style>
