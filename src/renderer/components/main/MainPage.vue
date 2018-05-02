<template>
  <section id="container">
      <AppTitle title="Rediger"/>
      <section id="main">
        <section class="left">
            <div class="menu-box" tabindex="-1" @mouseover="scrollBarAppear" @mouseout="scrollBarDisappear"
                 @mousewheel="onScroll" @resize="onScroll">
                <div class="scroll-bar" style="position: absolute;
                 z-index: 100;
                 left: 280px;"
                 @mousedown="onScrollBarDragStart"
                 @mousemove="onScrollBarDrag"
                :style="{
                   top: scrollBarTop + 'px',
                   left: scrollBarLeft + 'px',
                   height: scrollBarHeight + 'px',
                   display: showScrollBar ? 'block' : 'none'
                 }"></div>
                <AppTree v-bind:nodes="nodes" :indent="0" v-bind:options="treeOptions"/>
            </div>
        </section>
        <section class="right">
            <component v-bind:is="pageType" v-bind:page="page"></component>
        </section>
      </section>
  </section>
</template>

<script>
  import AppTitle from '../title/AppTitle'
  import AppTree from '../tree/AppTree'
  import AppKeyValuePage from '../page/AppKeyValuePage'
  import AppServerPage from '../page/AppServerPage'
  import { mapMutations } from 'vuex'
  
  import ServerNode from '../../../client/node/servernode'

  let serverNode = new ServerNode('test db', {
    port: 6379,
    host: '120.27.240.62',
    family: 4,
    password: 'Beastredis',
    db: 0
  })

  export default {
    name: 'MainPage',
    data () {
      return {
        value: '',
        page: {
          key: 'Unknown',
          value: 'Unknown',
          type: ''
        },
        nodes: [
          serverNode
        ],
        pageType: '',
        scrollBarTop: 0,
        scrollBarLeft: 0,
        scrollBarHeight: 0,
        scrollBarOpacity: 0.8,
        scrollBarOffsetY: 0,
        scrollBarDragging: false,
        showScrollBar: false,
        scrollBarAppeared: false
      }
    },
    computed: {
      indentSpace () {
        return this.$store.state.Content.menu.indentSpace
      },
      treeOptions () {
        let self = this
        return {
          onSelect: function (node) {
            self.SELECT_NODE(node)
            self.page = node.getPage()
            if (self.page === undefined || self.page.type === undefined) {
              self.pageType = ''
            } else {
              self.pageType = 'App' + self.page.type + 'Page'
            }
          }
        }
      }
    },
    methods: {
      ...mapMutations([
        'SELECT_NODE'
      ]),
      getScrollLeft () {
        let box = document.querySelector('.menu-box')
        if (box === undefined || box === null) {
          return 0
        }
        let boxWidth = box.style.width
        return boxWidth - 5
      },
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
          menuBox.scrollTop = (this.scrollBarTop / (boxClientHeight - this.scrollBarHeight)) * (boxScrollHeight - boxClientHeight)
          // this.refreshScrollBar(newClienY)
        } else {
          this.scrollBarDragging = false
          document.onmousemove = undefined
        }
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
        let boxClientWidth = menuBox.clientWidth
        let rate = boxClientHeight / boxScrollHeight
        if (rate === 1) {
          this.showScrollBar = false
        } else {
          this.showScrollBar = true
          this.scrollBarHeight = Math.max(8, boxClientHeight * rate)
          this.scrollBarLeft = boxClientWidth - scrollBar.clientWidth
        }
        menuBox.scrollTop = newScrollTop
        this.scrollBarTop = (menuBox.scrollTop / (boxScrollHeight - boxClientHeight)) * (boxClientHeight - this.scrollBarHeight)
        // console.log('on scroll: scrollTop:', scrollBarTop, 'scrollHeight:', boxScrollHeight, 'clientHeight:', boxClientHeight,
        //   'scrollTop + clientHeight:', scrollBarTop + menuBox.clientHeight)
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

    },
    components: {
      AppTitle,
      AppTree,
      AppKeyValuePage,
      AppServerPage
    }
  }
</script>

<style lang="less">
    @import "../../../../static/style/main.less";

    @scroll-bar-opacity: 0.78;
    @scolor-croll-bar-background: #676a69;

    @keyframes scroll-bar-fadein-animation {
        from { opacity: 0 }
        to { opacity: @scroll-bar-opacity }
    }


    @keyframes scroll-bar-fadeout-animation {
        from { opacity: @scroll-bar-opacity }
        to { opacity: 0 }
    }

    .scroll-bar {
        border: 1px solid @scolor-croll-bar-background;
        border-radius: 2px;
        opacity: @scroll-bar-opacity;
        width: 10px;
        background: @scolor-croll-bar-background;
    }

    .scroll-bar-fadeout {
        -webkit-animation-name: scroll-bar-fadeout-animation;
        -webkit-animation-duration: 0.6s;
        -webkit-animation-timing-function: linear;
        -webkit-animation-delay: 0.3s;
        -webkit-animation-iteration-count: initial;
        -webkit-animation-direction: normal;
        -webkit-animation-play-state: running;
        -webkit-animation-fill-mode: forwards;
    }


</style>
