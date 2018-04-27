<template>
  <div id="main">
      <div>
        <div class="left">
          <AppTree v-bind:nodes="nodes" indent="0" v-bind:options="treeOptions"/>
        </div>
        <div class="right">
            <component v-bind:is="pageType" v-bind:page="page"></component>
        </div>
      </div>
  </div>
</template>

<script>
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
            self.page = node.getContent()
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
      AppTree,
      AppKeyValuePage,
      AppServerPage
    }
  }
</script>

<style>
    * {
        margin: 0px;
        padding: 0px;
    }

    #main {
        overflow: hidden;
        background: rgb(102, 102, 102);
        border-top: 1px solid rgb(155, 155, 155);
        margin: 0px;
        padding: 0px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
        -webkit-app-region: no-drag;
    }

    .left {
        float: left;
        width: 300px;
        height: 100%;
        background: rgb(102, 102, 102);
        overflow: hidden;
    }


    .right {
        margin-left: 300px;
        height: 100%;
        background: rgb(26, 25, 25);
        color: white;
        line-height: 30px;
        overflow: auto;
        font-size: 14px;
        font-weight: bolder
    }
    
    .value-area {
        cursor: text;
    }

    .value-area .block {
        padding-left: 30px;
        box-sizing: border-box;
    }

    .value-area .left-brace {
    }

    .value-area .left-bracket {
    }

    .value-area .key {
        color: rgb(157, 211, 230);
    }

    .value-area .string {
        color: rgb(228, 198, 115);
    }

    .value-area .number {
        color: rgb(169, 216, 138);
    }

    .value-area .boolean {
        color: rgb(12, 104, 209);
    }

</style>
