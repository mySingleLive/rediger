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
                 }"></div>
</template>

<script>
  export default {
    name: "AppScrollBar",
    props: [],
    data () {
      return {
        scrollBarTop: 0,
        scrollBarLeft: 0,
        scrollBarHeight: 0,
        scrollBarWidth: 6,
        scrollBarSeparatorWidth: 2,
        scrollBarOffsetY: 0,
        scrollBarDragging: false,
        showScrollBar: false,
        scrollBarAppeared: false
      }
    },
    created: function () {
      console.log('created!!!')
    }
    methods: {
      onScrollBarDragStart (event) {
        this.scrollBarOffsetY = this.scrollBarTop - event.clientY
        let self = this
        document.onmousemove = function (event) {
          self.onScrollBarDrag(event)
        }
        document.onmouseup = function (event) {
          console.log('document.onmouseup !!')
          self.scrollBarDragging = false
          self.scrollBarDisappear()
          document.onmouseup = undefined
        }
      },
      onScrollBarDrag (event) {
        if (this.showScrollBar && event.buttons === 1) {
          this.scrollBarDragging = true
          this.scrollBarTop = this.scrollBarOffsetY + event.clientY
          if (this.scrollBarTop < 0) {
            this.scrollBarTop = 0
          }

          let menuBox = document.querySelector('.menu-box')
          if (menuBox === undefined || menuBox === null) {
            return
          }
          if (this.scrollBarTop + this.scrollBarHeight > menuBox.clientHeight) {
            this.scrollBarTop = menuBox.clientHeight - this.scrollBarHeight
          }

          let scrollBar = document.querySelector('.menu-box .scroll-bar')
          if (scrollBar === undefined || scrollBar === null) {
            return
          }
          // let scrollBarTop = menuBox.scrollTop
          let boxScrollHeight = menuBox.scrollHeight
          let boxClientHeight = menuBox.clientHeight
          this.resizeScrollBar()
          menuBox.scrollTop = (this.scrollBarTop / (boxClientHeight - this.scrollBarHeight)) * (boxScrollHeight - boxClientHeight)
          // this.refreshScrollBar(newClienY)
        } else {
          this.scrollBarDragging = false
          document.onmousemove = undefined
        }
      },
      resizeScrollBar () {
        let menuBox = document.querySelector('.menu-box')
        if (menuBox === undefined || menuBox === null) {
          return
        }
        let scrollBar = document.querySelector('.menu-box .scroll-bar')
        if (scrollBar === undefined || scrollBar === null) {
          return
        }
        let boxScrollHeight = menuBox.scrollHeight
        let boxClientHeight = menuBox.clientHeight
        let rate = boxClientHeight / boxScrollHeight
        if (rate >= 1) {
          this.showScrollBar = false
        } else {
          this.showScrollBar = true
        }
        this.scrollBarTop = this.scrollBarTop || 0
        this.scrollBarHeight = Math.max(8, boxClientHeight * rate)
        this.scrollBarLeft = menuBox.clientWidth - this.scrollBarWidth - this.scrollBarSeparatorWidth
      },
      refreshScrollBar (newScrollTop) {
        let menuBox = document.querySelector('.menu-box')
        if (menuBox === undefined || menuBox === null) {
          return
        }
        let scrollBar = document.querySelector('.menu-box .scroll-bar')
        if (scrollBar === undefined || scrollBar === null) {
          return
        }
        // let scrollBarTop = menuBox.scrollTop
        let boxScrollHeight = menuBox.scrollHeight
        let boxClientHeight = menuBox.clientHeight
        this.resizeScrollBar()
        menuBox.scrollTop = newScrollTop
        this.scrollBarTop = (menuBox.scrollTop / (boxScrollHeight - boxClientHeight)) * (boxClientHeight - this.scrollBarHeight)
        // console.log('on scroll: scrollTop:', scrollBarTop, 'scrollHeight:', boxScrollHeight, 'clientHeight:', boxClientHeight,
        //   'scrollTop + clientHeight:', scrollBarTop + menuBox.clientHeight)
      },
      onScrollBarResize () {
        let self = this
        setTimeout(function () {
          self.resizeScrollBar()
          setTimeout(function () {
            self.resizeScrollBar()
          }, 50)
        }, 50)
      },
      onScroll (event) {
        let menuBox = document.querySelector('.menu-box')
        if (menuBox === undefined || menuBox === null) {
          return
        }
        let speed = 0.67
        let dy = (event.deltaY || 0) * speed
        this.refreshScrollBar(menuBox.scrollTop + dy)
      },
      scrollBarAppear (event) {
        if (this.showScrollBar && !this.scrollBarAppeared) {
          let scrollBar = document.querySelector('.menu-box .scroll-bar')
          scrollBar.classList.remove('scroll-bar-fadeout')
          this.scrollBarAppeared = true
        }
      },
      scrollBarDisappear (event) {
        if (this.showScrollBar && !this.scrollBarDragging && this.scrollBarAppeared) {
          let scrollBar = document.querySelector('.menu-box .scroll-bar')
          scrollBar.classList.add('scroll-bar-fadeout')
          scrollBar.classList.remove('scroll-bar-fadein')
          this.scrollBarAppeared = false
        }
      }
    }
  }
</script>

<style lang="less">

</style>