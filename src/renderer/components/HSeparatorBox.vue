<template>
    <div class="h-separator-box" ref="box">
        <slot name="left" :leftWidth="leftWidth + 'px'"></slot>
        <ColSeparator :offset="separators.left.offset" :ondrag="separators.left.onDrag"></ColSeparator>
        <slot name="center" :centerLeft="centerLeft"></slot>
        <slot name="right" left="300"></slot>
    </div>
</template>

<script>
  import ColSeparator from './ColSeparator'

  export default {
    name: 'HSeparatorBox',
    data () {
      let self = this
      return {
        separators: {
          left: {
            offset: 40,
            onDrag (event) {
              self.leftWidth = event.offset
              self.centerLeft = event.offset
            }
          }
        },
        leftWidth: 0,
        centerWidth: 0,
        centerLeft: 0
      }
    },
    mounted () {
      let self = this
      this.$nextTick(function () {
        self.init()
      })
    },
    watch: {
      'separators.left.offset': function (val, oldVal) {
        console.log('sep first left change:', val, 'old:', val)
        this.centerLeft = val
        this.calcCenterWidth()
      }
    },
    methods: {
      getBox () {
        return this.$refs.box
      },
      init () {
        // let leftWidth = parseInt(this.$slots.left[0].componentInstance.panelWidth)
        this.leftWidth = 300
        console.log('left-panel width:', this.leftWidth)
        this.separators.left.offset = this.leftWidth
      },
      onDragStart () {
        this.separators.left.dragging = true
      },
      calcCenterWidth () {
        let box = this.getBox()
        let boxWidth = box.clientWidth
        this.centerWidth = boxWidth - this.leftWidth
      }
    },
    components: {
      ColSeparator
    }
  }
</script>

<style scoped>

</style>