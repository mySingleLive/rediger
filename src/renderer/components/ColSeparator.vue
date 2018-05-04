<template>
    <div class="layout-separator-col"
         :style="{
             left: left + 'px'
         }"
         @mousedown="onResizeStart"
         ref="sep"></div>
</template>

<script>
  export default {
    name: 'ColSeparator',
    props: ['offset', 'ondrag'],
    data () {
      return {
        left: 0,
        resizing: false
      }
    },
    watch: {
      offset: function (val, oldVal) {
        this.left = this.offset
      }
    },
    created: function () {
      console.log('Col Separator Init')
    },
    methods: {
      onResizeStart () {
        if (this.resizing) {
          return
        }
        console.log('start resize !!')
        let self = this
        this.resizing = true
        document.onmousemove = function (event) {
          self.onResize(event)
          // if (event.buttons === 0) {
          //   self.resizing = false
          //   document.onmousemove = undefined
          // }
        }
        document.onmouseup = function (event) {
          console.log('document.onmouseup !!')
          self.resizing = false
          document.onmousemove = undefined
        }
      },
      onResize (event) {
        let left = event.clientX
        if (left < 0) {
          left = 0
        }
        this.left = left
        console.log('resize x:', this.left, 'y:', event.clientY, 'event:', event)
        if (this.ondrag !== undefined) {
          this.ondrag({
            offset: left
          })
        }
      }
    }
  }
</script>

<style>

</style>