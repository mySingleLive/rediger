'use strict'

import Page from './page'

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

export default class KeyValuePage extends Page {
  constructor ({keyNode, key, keyType, value, fullname}) {
    super({
      type: 'KeyValue',
      title: key,
      fullname: fullname
    })
    this.reload = () => {
      keyNode.reload()
    }
    this.getKeyNode = () => {
      return keyNode
    }
    this.pageMode = 'add'
    this.key = key
    this.keyType = keyType
    this.value = value
    this.jsonViewValue = syntaxHighlight(value)
  }

  iconUrl () {
    return this.getKeyNode().iconUrl()
  }
}
