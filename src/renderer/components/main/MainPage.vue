<template>
  <div id="main">
      <div>
        <button v-on:click="click">
            Redis
        </button>
      </div>
      <div>
        <div class="left">
            <ul>
                <template v-for="n in nodes">
                    <li class="list-item" v-on:click="openNode(n)">
                        <div class="text">{{ n.name }}</div>
                    </li>
                    <template v-if="n.children && n.children.length > 0">
                        <template v-for="item in n.children">
                            <li class="list-item" v-on:click="queryKey(item)"
                               v-bind:style="{ paddingLeft: (item.indent * indentSpace) + 'px' }">
                                <div class="text">{{ item.name }}</div>
                            </li>
                        </template>
                    </template>
                </template>
            </ul>
        </div>
        <div class="right">
            <div>
                Key: <span class="result-key"> {{ queryResult.key }} </span>
            </div>
            <div>
                Value:
                <div class="value-area" v-html="queryResult.value">
                </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
  function syntaxHighlight (json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
            match += '&nbsp;&nbsp;&nbsp;&nbsp;'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    json = json
      .replace(/\{/g, '<span class="left-brace">{</span><div class="block">')
      .replace(/\}/g, '</div><span class="right-brace">}</span>')
      .replace(/\[/g, '<span class="left-bracket">[</span><div class="block">')
      .replace(/\]/g, '</div><span class="right-bracket">]</span>')
      .replace(/,/g, ',<br/>')
    return json
  }

  let dbroot = {
    name: 'test db',
    data: {
      port: 6379,
      host: '120.27.240.62',
      family: 4,
      password: 'Beastredis',
      db: 0
    },
    redis: undefined,
    loaded: false,
    indent: 0,
    children: [],
    connection: function () {
      if (this.redis !== undefined) {
        return
      }
      let Redis = require('ioredis')
      this.redis = new Redis(dbroot.data)
      this.redis.defineCommand('top', {
        numberOfKeys: 1,
        lua: 'return redis.call("SCAN", 0, "COUNT", tonumber(KEYS[1]))'
      })
    },
    open: function () {
      if (this.loaded) {
        return
      }
      this.connection()
      let self = this
      this.redis.top(30, function (err, ret) {
        if (err !== undefined && err !== null) {
          console.log('error:', err)
        } else {
          if (ret && ret.length > 1) {
            if (self.children === undefined) {
              self.children = []
            }
            let vals = ret[1]
            for (let i in vals) {
              self.children.push({
                name: vals[i],
                type: 'key',
                indent: self.indent + 1
              })
            }
            console.log('nodes:', self.nodes)
          }
        }
      })
    }
  }

  export default {
    name: 'MainPage',
    data () {
      return {
        value: '',
        nodes: [
          dbroot
        ],
        queryResult: {
          key: '',
          value: ''
        }
      }
    },
    computed: {
      indentSpace () {
        console.log('store:', this.$store)
        return this.$store.state.Counter.menu.indentSpace
      }
    },
    methods: {
      click: function () {
        console.log('redis!!!')
      },
      openNode: function (n) {
        n.open()
      },
      queryKey: function (n) {
        console.log('node:', n)
        syntaxHighlight('xxxx')
        /*
        let k = n.name
        console.log('query key:', k)
        let self = this
        redis.get(k, function (err, ret) {
          if (err !== undefined && err !== null) {
            console.log('error:', err)
          } else {
            console.log('query result:', ret)
            self.queryResult = {
              key: k,
              value: syntaxHighlight(ret)
            }
          }
        })
        */
      }
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
        background: rgb(46, 46, 46);
        color: white;
        line-height: 30px;
        overflow: auto;
        font-size: 14px;
        font-weight: bolder
    }

    .right li, ul {
        list-style-type: none;
    }

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

    .list-indent {
        padding-left: 50px;
    }

    .right .result-key {
        margin-left: 12px;
        color: rgb(5, 192, 255);
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
