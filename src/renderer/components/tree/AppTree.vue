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
        background: rgb(33, 34, 33);
    }

    .list-item {
        height: 22px;
        line-height: 22px;
        cursor: default;
        padding-right: 5px;
        color: white;
        white-space:nowrap;
        text-overflow:ellipsis;
        -ms-text-overflow: ellipsis;
        box-sizing: border-box;
        moz-user-select: -moz-none; 
        -moz-user-select: none; 
        -o-user-select:none; 
        -webkit-user-select:none; 
        -ms-user-select:none; 
        user-select:none;
        overflow: hidden;
    }

    .list-item:hover {
        background: rgb(51, 53, 51);
    }

    .list-item-single-selected {
        background: rgb(121, 137, 209);
    }
    .list-item-single-selected:hover {
        background: rgb(121, 137, 209);
    }
    .list-item-opend {
        background: rgb(99, 104, 121);
    }
    .list-item-opend:hover {
        background: rgb(99, 104, 121);
    }    
</style>
