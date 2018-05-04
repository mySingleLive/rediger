<template>
    <div :panel="name"
         :class="['box', boxClass]"
        :style="{
            top: (boxTop || 0) + 'px',
            left: (boxLeft || 0) + 'px',
            width: boxWidth || '100%',
            height: boxHeight || '100%'
        }"
        ref="box">
        <template v-if="scrollX === true || scrollY === true">
            <div class="box-inner" @mouseover="scrollBarAppear" @mouseout="scrollBarDisappear"
                 @mousewheel="onScroll" ref="innerBox">
                <slot></slot>

                <div class="scroll-bar" style="position: absolute;
                   z-index: 100;"
                     @mousedown="onScrollBarDragStart"
                     @mousemove="onScrollBarDrag"
                     :style="{
                     top: scrollBarYTop + 'px',
                     left: scrollBarYLeft + 'px',
                     width: scrollBarWidth + 'px',
                     height: scrollBarYHeight + 'px',
                     display: showScrollBarY ? 'block' : 'none'
                   }" ref="scollbarY"></div>

            </div>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script>
  export default {
    name: 'Box',
    props: ['name', 'top', 'left', 'width', 'height', 'boxClass', 'scrollX', 'scrollY'],
    data () {
      return {
        boxTop: this.top,
        boxLeft: this.left,
        boxWidth: this.width,
        boxHeight: this.height,

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
      left: function () {
        this.boxLeft = this.left
        this.resizeScrollBarY()
      },
      width: function () {
        this.boxWidth = this.width
        this.resizeScrollBarY()
      },
      height: function () {
        this.boxHeight = this.height
        this.resizeScrollBarY()
      }
    },
    mounted () {
      this.boxTop = this.top
      this.boxLeft = this.left
      this.boxWidth = this.width
      this.boxHeight = this.height
    },
    methods: {
      getInnerBox () {
        return this.$refs.innerBox
      },
      getScrollBarY () {
        return this.$refs.scollbarY
      },

      onScrollBarDragStart (event) {
        this.scrollBarYOffsetY = this.scrollBarYTop - event.clientY
        let self = this
        document.onmousemove = function (event) {
          self.onScrollBarDrag(event)
        }
        document.onmouseup = function (event) {
          console.log('document.onmouseup !!')
          self.scrollBarYDragging = false
          self.scrollBarDisappear()
          document.onmouseup = undefined
        }
      },
      onScrollBarDrag (event) {
        if (this.showScrollBarY && event.buttons === 1) {
          this.scrollBarYDragging = true
          this.scrollBarYTop = this.scrollBarYOffsetY + event.clientY
          if (this.scrollBarYTop < 0) {
            this.scrollBarYTop = 0
          }

          let box = this.getInnerBox()
          if (box === undefined || box === null) {
            return
          }
          if (this.scrollBarYTop + this.scrollBarYHeight > box.clientHeight) {
            this.scrollBarYTop = box.clientHeight - this.scrollBarYHeight
          }

          let scrollBar = this.getScrollBarY()
          if (scrollBar === undefined || scrollBar === null) {
            return
          }
          let boxScrollHeight = box.scrollHeight
          let boxClientHeight = box.clientHeight
          this.resizeScrollBarY()
          box.scrollTop = (this.scrollBarYTop / (boxClientHeight - this.scrollBarYHeight)) * (boxScrollHeight - boxClientHeight)
          // this.refreshScrollBar(newClienY)
        } else {
          this.scrollBarYDragging = false
          document.onmousemove = undefined
        }
      },
      resizeScrollBarY () {
        let box = this.getInnerBox()
        if (box === undefined || box === null) {
          return
        }
        let scrollBar = this.getScrollBarY()
        if (scrollBar === undefined || scrollBar === null) {
          return
        }
        let boxScrollHeight = box.scrollHeight
        let boxClientHeight = box.clientHeight
        let rate = boxClientHeight / boxScrollHeight
        if (rate >= 1) {
          this.showScrollBarY = false
        } else {
          this.showScrollBarY = true
        }
        this.scrollBarYTop = this.scrollBarYTop || 0
        this.scrollBarYHeight = Math.max(8, boxClientHeight * rate)
        this.scrollBarYLeft = box.clientWidth - this.scrollBarWidth - this.scrollBarYRight
      },
      refreshScrollBar (newScrollTop) {
        let box = this.getInnerBox()
        if (box === undefined || box === null) {
          return
        }
        let scrollBar = this.getScrollBarY()
        if (scrollBar === undefined || scrollBar === null) {
          return
        }
        // let scrollBarTop = menuBox.scrollTop
        let boxScrollHeight = box.scrollHeight
        let boxClientHeight = box.clientHeight
        this.resizeScrollBarY()
        box.scrollTop = newScrollTop
        this.scrollBarYTop = (box.scrollTop / (boxScrollHeight - boxClientHeight)) * (boxClientHeight - this.scrollBarYHeight)
        // console.log('on scroll: scrollTop:', scrollBarTop, 'scrollHeight:', boxScrollHeight, 'clientHeight:', boxClientHeight,
        //   'scrollTop + clientHeight:', scrollBarTop + menuBox.clientHeight)
      },
      onScrollBarResize () {
        let self = this
        setTimeout(function () {
          self.resizeScrollBarY()
          setTimeout(function () {
            self.resizeScrollBarY()
          }, 50)
        }, 50)
      },
      onScroll (event) {
        let box = this.getInnerBox()
        if (box === undefined || box === null) {
          return
        }
        let speed = 0.67
        let dy = (event.deltaY || 0) * speed
        this.refreshScrollBar(box.scrollTop + dy)
      },
      scrollBarAppear (event) {
        if (this.showScrollBarY && !this.scrollBarYAppeared) {
          let scrollBar = this.getScrollBarY()
          scrollBar.classList.remove('scroll-bar-fadeout')
          this.scrollBarYAppeared = true
        }
      },
      scrollBarDisappear (event) {
        if (this.showScrollBarY && !this.scrollBarYDragging && this.scrollBarYAppeared) {
          let scrollBar = this.getScrollBarY()
          scrollBar.classList.add('scroll-bar-fadeout')
          scrollBar.classList.remove('scroll-bar-fadein')
          this.scrollBarYAppeared = false
        }
      }

    }
  }
</script>

<style>

</style>