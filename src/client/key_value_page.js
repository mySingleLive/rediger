'use strict'

import Page from './page'

export default class KeyValuePage extends Page {
  constructor ({key, value}) {
    super({
      type: 'KeyValue',
      title: key
    })
    this.key = key
    this.value = value
  }
}
