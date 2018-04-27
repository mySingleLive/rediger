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
    
<style>
#app-title {
    width: 100%;
    height: 30px;
    background: rgb(102, 102, 102);
    -webkit-app-region: drag;
    border-bottom: 1px solid rgb(43, 43, 43);
    box-sizing: border-box;
    overflow: hidden;
    moz-user-select: -moz-none; 
    -moz-user-select: none; 
    -o-user-select:none; 
    -webkit-user-select:none; 
    -ms-user-select:none; 
}

#title-text {
  color: rgb(233, 231, 231);
  margin-left: 20px;
  height: 100%;
  line-height: 30px;
  float: left;
  -webkit-app-region: drag;
}

#app-title-btn-group {
    float: right;
}
</style>
