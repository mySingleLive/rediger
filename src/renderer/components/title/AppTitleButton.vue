<template>
    <div class="app-title-btn" 
        v-on:click="click">
      <img v-if="type == 'min'" src="../../assets/btn-min.png" width="20" height="20">
      <img v-if="type == 'close'" src="../../assets/btn-close.png" width="20" height="20">
    </div>
</template>

<script>
  const {ipcRenderer: ipc} = require('electron')

  export default {
    name: 'AppTitleButton',
    props: ['type'],
    methods: {
      click: function () {
        console.log('click xxx')
        ipc.send(this.type)
      }
    }
  }
</script>

