<template>
  <section id="container">
      <!--<AppTitle title="Rediger"/>-->
      <section id="toolbar">
          <!--<div style="position: absolute; top: 1px; left: 5px; width: 28px; height: 28px; background-image: url('/static/img/connection_add.svg'); background-repeat:no-repeat; background-size:26px 26px;" class="toolbar-btn"></div>-->
          <ToolbarButton :index="0" image-url="/static/img/connection_add.svg" :action="onOpenConnectionAddition"></ToolbarButton>
          <ToolbarSeparator :index="1"></ToolbarSeparator>
          <ToolbarButton :index="1" image-url="/static/img/keys_2.svg" :action="onOpenKeysPage" :left-separator="1"></ToolbarButton>
          <ToolbarButton :index="2" image-url="/static/img/lua.svg" :action="onOpenLuaPage" :left-separator="1"></ToolbarButton>
      </section>
      <section id="main">
          <HSeparatorBox>
              <Box slot-scope="{leftWidth}"
                     name="left"
                     :width="leftWidth"
                     height="100%"
                     slot="left">
                <div class="menu-box" @mouseover="scrollBarAppear" @mouseout="scrollBarDisappear"
                     @mousewheel="onScroll" ref="menuBox">
                    <AppTree v-bind:nodes="nodes" :indent="0" v-bind:options="treeOptions"/>
                    <div class="scroll-bar" style="position: absolute;
                   z-index: 100;"
                         @mousedown="onScrollBarDragStart"
                         @mousemove="onScrollBarDrag"
                         :style="{
                     top: scrollBarYTop + 'px',
                     right: 2 + 'px',
                     width: scrollBarWidth + 'px',
                     height: scrollBarYHeight + 'px',
                     display: showScrollBarY ? 'block' : 'none'
                   }" ref="scollbarY"></div>
                </div>
              </Box>
              <Box slot-scope="{centerLeft, centerWidth}"
                   :left="centerLeft"
                   :width="centerWidth + 'px'"
                   height="100%" slot="center">
                  <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%">
                      <TabList/>
                      <Box id="page-body"
                           :left="'0px'"
                           :width="centerWidth + 'px'"
                           :top="tabHeight"
                           height="100%" slot="center">
                        <component v-bind:is="pageType" v-bind:page="page"></component>
                      </Box>
                  </div>
                <!--</section>-->
              </Box>
          </HSeparatorBox>
      </section>
  </section>
</template>

<script>
  import AppTitle from '../title/AppTitle'
  import AppTree from '../tree/AppTree'
  import AppKeyValuePage from '../page/AppKeyValuePage'
  import AppServerPage from '../page/AppServerPage'
  import AppNewConnectionPage from '../page/AppNewConnectionPage'
  import TabList from '../TabList'
  import Box from '../Box'
  import ToolbarButton from '../ToolbarButton'
  import ToolbarSeparator from '../ToolbarSeparator'
  import HSeparatorBox from '../HSeparatorBox'
  import ColSeparator from '../ColSeparator'

  import { mapMutations } from 'vuex'

  import { Sizes } from '../../../client/constants'
  import NewConnectionPage from '../../../client/page/new_connection_page'
  import ServerNode from '../../../client/node/servernode'
  import ConnectionStore from '../../../client/db/connection_store'

  let serverNode = ServerNode.addServer('test db', {
    port: 6379,
    host: '120.27.240.62',
    family: 4,
    password: 'Beastredis',
    db: 0
  })

  let connStore = new ConnectionStore()
  connStore.findAllConnections((err, ret) => {
    if (err !== undefined && err !== null) {
      console.log('error:', err)
    } else {
      console.log('connections:', ret)
    }
  })

  export default {
    name: 'MainPage',
    data () {
      return {
        value: '',
        nodes: [
          serverNode
        ],
        pageType: '',
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
    computed: {
      tabHeight () {
        return Sizes.TAB_HEIGHT
      },
      page () {
        let page = this.$store.state.Content.selectedPage
        if (page === undefined || page.type === undefined) {
          this.pageType = ''
        } else {
          this.pageType = 'App' + page.type + 'Page'
        }
        return page || {
          key: 'Unknown',
          value: 'Unknown',
          type: ''
        }
      },
      treeOptions () {
        let self = this
        return {
          onSelect: function (node) {
            self.ADD_PAGE(node.getPage())
          },
          onExpand: function () {
            console.log('onExpand')
            self.onScrollBarResize()
          },
          onUnexpand: function () {
            console.log('onUnexpand')
            self.onScrollBarResize()
          }
        }
      }
    },
    methods: {
      ...mapMutations([
        'ADD_PAGE',
        'SELECT_PAGE'
      ]),
      getInnerBox () {
        return this.$refs.menuBox
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
        console.log('do onScroll')
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
      },

      onOpenConnectionAddition () {
        console.log('do onOpenConnectionAddition')
        let newPage = new NewConnectionPage()
        console.log(newPage)
        this.ADD_PAGE(newPage)
      },

      onOpenKeysPage () {
        console.log('do onOpenKeysPage')
      },

      onOpenLuaPage () {
        console.log('do onOpenLuaPage')
      }
    },
    components: {
      AppTitle,
      AppTree,
      AppKeyValuePage,
      AppServerPage,
      AppNewConnectionPage,
      TabList,
      Box,
      ToolbarButton,
      ToolbarSeparator,
      HSeparatorBox,
      ColSeparator
    }
  }
</script>

<style lang="less">
    @import "../../../../static/style/main.less";
</style>
