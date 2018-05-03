<template>
    <div class="layout-separator-col"
        @click="onStartResize"></div>
</template>

<script>
  export default {
    name: 'ColSeparator',
    created: function () {
      console.log('Col Separator Init')
    },
    methods: {
      onStartResize () {
        console.log('start resize !!')
      }
    }
  }
</script>

<style>

</style>