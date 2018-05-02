<template>
  <div id="app-title">
      <div id="title-text">
        {{ title }}
      </div>
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
    props: ['title'],
    components: {
      AppTitleButton
    },
    methods: {
    }
  }
</script>
    
<style lang="less">
    @import "../../../../static/style/header.less";
</style>
