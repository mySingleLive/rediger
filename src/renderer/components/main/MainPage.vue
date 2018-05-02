<template>
  <section id="container">
      <AppTitle title="Rediger"/>
      <section id="main">
        <section class="left">
            <div class="menu-box">
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
  
  import ServerNode from '../../../client/servernode'

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
        pageType: ''
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
      ])
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
