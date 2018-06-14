'use strict'

export default class Page {
  constructor ({type, title, fullname}) {
    this.type = type
    this.title = title
    this.fullname = fullname
    this.active = false
    this.pageMode = 'none'
  }

  reload () {
  }

  iconUrl () {
    return ''
  }
}
