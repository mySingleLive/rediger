'use strict'

import TreeNode from './treenode'
import KeyValuePage from './key_value_page'
import { IconUrl } from './constants'

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

export default class KeyNode extends TreeNode {
  constructor (name, {serverNode, keyType}) {
    super(name, 'key')
    this.serverNode = serverNode
    this.keyType = keyType
  }
  open (onopen) {
    if (this.opened) {
      return
    }
    let k = this.name
    console.log('query key:', k)
    let self = this
    let callback = onopen
    let redis = this.serverNode.redis
    redis.get(k, function (err, ret) {
      if (err !== undefined && err !== null) {
        console.log('error:', err)
      } else {
        console.log('query result:', ret)
        self.queryResult = new KeyValuePage({
          key: k,
          value: syntaxHighlight(ret)
        })
      }
      console.log('callback:', callback)
      if (callback !== undefined) {
        callback(self)
      }
    })
  }

  simpleInfo () {
    return ': <span style="color:lightblue;font-style:italic">' + this.keyType + '</span>'
  }

  getContent () {
    console.log('get key node content!')
    return this.queryResult
  }

  iconUrl () {
    switch (this.keyType) {
      case 'string':
        return IconUrl.STRING
      case 'list':
        return IconUrl.LIST
      case 'hash':
        return IconUrl.HASH
    }
    return IconUrl.KEY
  }
}
