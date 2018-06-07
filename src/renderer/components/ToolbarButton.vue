<template>
    <div style="position: absolute; top: 4px; width: 43px; height: 43px; background-repeat:no-repeat; background-size:30px 30px;"
         :style="{
             'left': ((leftBias + index * (43 + 2)) + (leftSeparator || 0) * 20) + 'px',
             'background-image': 'url(\'' + imageUrl + '\')',
             'background-position': '6px 6px'
         }"
         :class="{'depress': isDepressed, 'over': isOver && !isDepressed}"
         @mousedown="pressBtn()"
         @mouseout="outBtn()"
         @mouseover="inBtn()"
         @click="onclickBtn()"
         class="toolbar-btn"></div>
</template>

<script>
  export default {
    name: 'ToolbarButton',
    props: ['imageUrl', 'action', 'index', 'leftSeparator'],
    data: function () {
      return {
        leftBias: 10,
        pressing: false,
        isDepressed: false,
        isOver: false
      }
    },
    methods: {
      onclickBtn () {
        console.log('click toolbar')
        this.isDepressed = false
        this.pressing = false
        if (this.action !== undefined) {
          this.action()
        }
      },
      pressBtn () {
        console.log('press btn!')
        this.pressing = true
        this.isDepressed = true
        let self = this
        document.onmouseup = function (event) {
          if (!self.isOver) {
            self.isDepressed = false
            self.pressing = false
          }
        }
      },
      outBtn () {
        this.isDepressed = false
        this.isOver = false
      },
      inBtn () {
        console.log('in btn')
        this.isOver = true
        if (this.pressing) {
          this.isDepressed = true
        }
      }
    }
  }
</script>

<style>

    .toolbar-btn {
        border: rgba(0, 0, 0, 0) 1px solid;
    }

    .toolbar-btn:hover {
        border-bottom: #909090 solid 1px;
        border-radius: 4px;
        border-left: #909090 solid 1px;
        border-right: #909090 solid 1px;
        border-top: #909090 solid 1px;
    }

    .over {
        background: #444444;
    }

    .depress {
        background: #626262;
    }

</style>