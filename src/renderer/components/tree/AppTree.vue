<template>
  <ul>
    <template v-for="n in nodes">
        <AppTreeNode
          v-bind:node="n"
          v-bind:indent="indent"
          v-bind:options="nodeOptions" v-bind:singleSelected="false" />
        <template v-if="n.children && n.children.length > 0">
          <li v-bind:key="n.name">
            <AppTree
              v-bind:nodes="n.children"
              v-bind:indent="indent + 1"
              v-bind:options="options" :singleSelected="false" />
          </li>
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
    computed: {
      nodeOptions: function () {
        return {
          onSelect: this.options.onSelect
        }
      }
    },
    components: {
      AppTreeNode
    }
  }
</script>

<style>
    .list-item {
        height: 30px;
        line-height: 30px;
        cursor: default;
        padding-right: 5px;
        background: rgb(71, 71, 71);
        color: white;
        white-space:nowrap;
        text-overflow:ellipsis;
        -ms-text-overflow: ellipsis;
        box-sizing: border-box;
    }

    .list-item:hover {
        background: rgb(81, 81, 81);
    }

    .list-item .text {
        margin-right: 10px;
        text-overflow:ellipsis;
        white-space:nowrap;
        display: inline-block;
        overflow: hidden;
    }

    .list-item-single-selected {
        background: rgb(112, 122, 168);
    }
    
</style>
