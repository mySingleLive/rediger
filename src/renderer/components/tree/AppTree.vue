<template>
  <ul class="list-tree">
    <template v-for="n in nodes">
        <AppTreeNode
          :node="n"
          :indent="indent"
          :options="nodeOptions"/>
        <template v-if="n.expanded && n.children && n.children.length > 0">
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
