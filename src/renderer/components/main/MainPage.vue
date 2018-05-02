<template>
  <section id="container">
      <AppTitle title="Rediger"/>
      <section id="main">
        <section class="left">
            <div class="menu-box" @mousewheel="onScroll">
                <div class="scroll-bar" style="position: absolute;
                 width: 8px; z-index: 100;
                 left: 280px; background: #9b9b9b;
                 opacity: 0.5"
                :style="{
                   top: scrollTop + 'px',
                   left: scrollLeft + 'px',
                   height: scrollHeight + 'px',
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
        scrollTop: 0,
        scrollLeft: 0,
        scrollHeight: 0,
        showScrollBar: false
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
      onScroll (event) {
        let menuBox = document.querySelector('.menu-box')
        if (menuBox === undefined || menuBox === null) {
          return
        }
        let scrollBar = document.querySelector('.menu-box .scroll-bar')
        if (scrollBar === undefined || scrollBar === null) {
          return
        }
        console.log('wheel event:', event)
        let scrollTop = menuBox.scrollTop
        let scrollHeight = menuBox.scrollHeight
        let clientHeight = menuBox.clientHeight
        let clientWidth = menuBox.clientWidth
        console.log('on scroll: scrollTop:', scrollTop, 'scrollHeight:', scrollHeight, 'clientHeight:', clientHeight)
        let rate = clientHeight / scrollHeight
        if (rate === 1) {
          this.showScrollBar = false
        } else {
          this.showScrollBar = true
          this.scrollHeight = Math.max(8, clientHeight * rate)
          this.scrollLeft = clientWidth - scrollBar.clientWidth
        }
        let speed = 0.67
        let dy = (event.deltaY || 0) * speed
        menuBox.scrollTop += dy
        this.scrollTop = (menuBox.scrollTop / (scrollHeight - this.scrollHeight)) * clientHeight
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
</style>
