<template>
  <ul class="list-tree">
    <template v-for="n in nodes">
        <AppTreeNode
          v-bind:node="n"
          v-bind:indent="indent"
          v-bind:options="nodeOptions"/>
        <template v-if="n.expanded && n.children && n.children.length > 0">
            <AppTree
              v-bind:nodes="n.children"
              v-bind:indent="indent + 1"
              v-bind:options="options"/>
        </template>
        <template v-else>
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
          onSelect: self.options.onSelect
        }
      }
    },
    components: {
      AppTreeNode
    }
  }
</script>

<style>

    .list-tree {
        list-style-type:none;
        background: rgb(33, 34, 33);
    }

</style>
