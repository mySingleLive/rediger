<template>
  <li class="list-item"
    v-on:dblclick="openNode(node)"
    v-on:click="selectNode"
    v-bind:class="{ 'list-item-single-selected': singleSelected, 'list-item-opend': doubleSelected }"
    v-bind:style="{ paddingLeft: leftSpace + (indent * indentSpace) + 'px' }"
   >
      <template v-if="!node.leaf">
        <div class="list-item-expand-area" @click="switchExpand(node)">
          <div :class="{ 'list-item-expand': !node.expanded, 'list-item-unexpand': node.expanded }"></div>
        </div>
        <div class="list-item-icon"><img :src="nodeIcon(node)" width="18px" height="18px" alt=""></div>
      </template>
      <div class="text">{{ node.name }}</div>
  </li>
</template>

<script>
  import { mapMutations } from 'vuex'

  const context = {
    lastSingleSelected: undefined,
    lastDoubleSelected: undefined,
    nodeIconMap: {
      'server': '/static/img/redis-icon.png'
    }
  }

  export default {
    name: 'AppTreeNode',
    props: ['node', 'indent', 'options'],
    computed: {
      leftSpace () {
        return this.$store.state.Content.menu.leftSpace
      },
      indentSpace () {
        return this.$store.state.Content.menu.indentSpace
      }
    },
    data () {
      return {
        singleSelected: false,
        doubleSelected: false
      }
    },
    methods: {
      ...mapMutations([
        'SELECT_NODE',
        'SINGLE_SELECT_NODE'
      ]),
      selectNode: function () {
        let lastSingleSelected = context.lastSingleSelected
        if (lastSingleSelected !== undefined) {
          lastSingleSelected.singleSelected = false
        }
        context.lastSingleSelected = this
        this.singleSelected = true
        this.doubleSelected = false
      },
      nodeIcon: function (n) {
        if (n.type === undefined) {
          return ''
        }
        return context.nodeIconMap[n.type] || ''
      },
      switchExpand: function (n) {
        if (!n.expanded) {
          n.expand()
        } else {
          n.unexpand()
        }
      },
      openNode: function (n) {
        let opt = this.options || {}
        if (!n.opened) {
          n.open(function (node) {
            if (opt.onSelect !== undefined) {
              opt.onSelect(node)
            }
            node.expand()
          })
        } else {
          this.switchExpand(n)
        }

        let lastDoubleSelected = context.lastDoubleSelected
        if (lastDoubleSelected !== undefined) {
          lastDoubleSelected.doubleSelected = false
        }
        context.lastDoubleSelected = this
        this.singleSelected = false
        this.doubleSelected = true
      }
    }
  }
</script>

<style>
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

    .list-item-expand-area {
      padding-left: 2px;
      float: left;
    }

    .list-item-expand {
      width: 0px;
      height: 0px;
      border-width: 4px;
      margin: 7px 5px 2px 0px;
      border-style:solid dashed dashed dashed;
      border-color: transparent transparent transparent white;
      float: left;
    }

    .list-item-unexpand {
      width: 0px;
      height: 0px;
      border-width: 3px;
      margin: 7px 7px 2px 0px;
      border-style:solid dashed dashed dashed;
      border-color: transparent white white transparent;
      float: left;
    }

    .list-item-icon {
      padding: 2px 9px 0px 0px;
      float: left;
    }
    
</style>
