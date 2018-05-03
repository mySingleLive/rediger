<template>
    <div class="rediger-panel"
         :panel="name"
        :style="{
            top: panelTop || 0,
            left: panelLeft || 0,
            width: width,
            height: height
        }">
        <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'Panel',
    props: ['name', 'panelTop', 'panelLeft', 'width', 'height'],
    methods: {
      resizePanel ({top, left, width, height}) {
        this.panelTop = top || this.panelTop
        this.panelLeft = left || this.panelLeft
        this.width = width || this.width
        this.height = height || this.height
        console.log('do resize panel:', left)
      }
    }
  }
</script>

<style>

</style>