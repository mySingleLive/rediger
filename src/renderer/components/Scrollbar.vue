<template>
    <div class="scroll-bar" style="position: absolute;
                   z-index: 100;"
         @mousedown="onScrollBarDragStart"
         @mousemove="onScrollBarDrag"
         :style="{
             top: scrollBarTop + 'px',
             left: scrollBarLeft + 'px',
             width: scrollBarWidth + 'px',
             height: scrollBarHeight + 'px',
             display: showScrollBar ? 'block' : 'none'
           }">
</template>

<script>
  export default {
    name: "Scrollbar",
    props: ['top', 'left', 'right', 'width', 'height'],
    data () {
      return {
        scrollBarYTop: 0,
        scrollBarYLeft: 0,
        scrollBarYHeight: 0,
        scrollBarWidth: 7,
        scrollBarYRight: 2,
        scrollBarYOffsetY: 0,
        scrollBarYDragging: false,
        showScrollBarY: false,
        scrollBarYAppeared: false
      }
    },
    watch: {
      top: function (val, oldVal) {
        this.scrollBarYTop = this.top
      },
      left: function (val, oldVal) {
        this.scrollBarYLeft = this.left
      }
    }
  }
</script>

<style scoped>

</style>