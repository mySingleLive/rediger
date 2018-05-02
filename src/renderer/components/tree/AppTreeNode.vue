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

