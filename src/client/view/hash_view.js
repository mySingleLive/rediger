'use strict'

import ValueView from './value_view'

export default class HashView extends ValueView {
  constructor ({data, node, pageSize}) {
    super(data, node)
    this.pageSize = pageSize
    this.nextCursor = 0
  }
}