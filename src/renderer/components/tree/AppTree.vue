<template>
  <ul class="list-tree">
    <template v-for="n in nodes">
        <AppTreeNode
          :node="n"
          :indent="indent"
          :options="nodeOptions"/>
        <template v-if="n.isLoading()">
            <li class="list-loading-item">
                <div class="loading-content" :style="{ paddingLeft: leftSpace + ((indent + 1) * indentSpace) + 20 + 'px' }">
                    <div class="loading-icon"><img style="margin-top: 2px" src="/static/img/loading.svg" width="18px" height="18px"/></div>
                    <div>loading...</div>
                </div>
            </li>
        </template>
        <template v-else-if="n.expanded && n.children && n.children.length > 0">
            <AppTree
              :nodes="n.getChildren()"
              :indent="indent + 1"
              :options="options"/>
        </template>
    </template>
  </ul>
</template>

<script>
  import AppTreeNode from './AppTreeNode'

  export default {
    name: 'AppTree',
    props: ['nodes', 'indent', 'options'],
    data () {
      return {
        expanded: false
      }
    },
    computed: {
      nodeOptions: function () {
        let self = this
        return {
          onSelect: self.options.onSelect,
          onExpand: self.options.onExpand,
          onUnexpand: self.options.onUnexpand
        }
      },
      leftSpace () {
        return this.$store.state.Content.menu.leftSpace
      },
      indentSpace () {
        return this.$store.state.Content.menu.indentSpace
      }
    },
    components: {
      AppTreeNode
    }
  }
</script>

<style lang="less">
    @import "../../../../static/style/menu.less";
</style>
