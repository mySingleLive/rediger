<template>
  <ul>
    <template v-for="n in nodes">
        <AppTreeNode
          v-bind:node="n"
          v-bind:indent="indent"
          v-bind:options="nodeOptions" :singleSelected="false" :doubleSelected="false" />
        <template v-if="n.children && n.children.length > 0">
          <li v-bind:key="n.name">
            <AppTree
              v-bind:nodes="n.children"
              v-bind:indent="indent + 1"
              v-bind:options="options"/>
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
        height: 22px;
        line-height: 22px;
        cursor: default;
        padding-right: 5px;
        background: rgb(71, 71, 71);
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
        font-size: 14px;
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
