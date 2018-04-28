<template>
  <li class="list-item"
    @dblclick="openNode(node)"
    @click="selectNode"
    :class="{ 'list-item-single-selected': singleSelected, 'list-item-opend': doubleSelected }"
    :style="{ paddingLeft: leftSpace + (indent * indentSpace) + 'px' }"
   >
      <div class="list-item-expand-area" @click="switchExpand(node)">
        <div v-if="!node.leaf && node.opened" :class="{ 'list-item-expand': !node.expanded, 'list-item-unexpand': node.expanded }"></div>
      </div>
      <div v-if="node.iconUrl() !== undefined" class="list-item-icon"><img :src="node.iconUrl()" width="18px" height="18px" alt=""></div>
      <template v-if="node.type === 'server'"><ServerNode :node="node"/></template>
      <div v-else class="text"><span class="node-name">{{ node.name }} </span><span class="node-description" v-html="node.simpleInfo()"></span></div>
  </li>
</template>

<script>
  import { mapMutations } from 'vuex'
  import ServerNode from './ServerNode'

  const context = {
    lastSingleSelected: undefined,
    lastDoubleSelected: undefined,
    currentDbSelected: undefined
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
    components: {
      ServerNode
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
        if (context.currentDbSelected !== undefined && context.currentDbSelected !== this) {
          context.currentDbSelected.doubleSelected = true
        }
      },
      switchExpand: function (n) {
        if (!n.opened) {
          return
        }
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
        if (n.leaf) {
          let lastDoubleSelected = context.lastDoubleSelected
          if (lastDoubleSelected !== undefined) {
            lastDoubleSelected.doubleSelected = false
          }
          context.lastDoubleSelected = this
          this.singleSelected = false
          this.doubleSelected = true
          context.currentDbSelected = this
        }
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
      width: 16px;
      height: 100%;
      padding-left: 2px;
      float: left;
    }

    .list-item-expand {
      width: 0px;
      height: 0px;
      border-width: 4px;
      margin: 7px 0px 2px 0px;
      border-style:solid dashed dashed dashed;
      border-color: transparent transparent transparent white;
      float: left;
    }

    .list-item-unexpand {
      width: 0px;
      height: 0px;
      border-width: 3px;
      margin: 7px 0px 2px 0px;
      border-style:solid dashed dashed dashed;
      border-color: transparent white white transparent;
      float: left;
    }

    .list-item-icon {
      padding: 2px 9px 0px 0px;
      float: left;
    }

    .node-name {

    }
    
    .node-description {
      margin-left: 8px;
      line-height: 22px;
      color: rgb(196, 194, 194);
      font-size: 11px;
    }

</style>
