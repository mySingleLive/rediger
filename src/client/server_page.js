'use strict'

import Page from './page'

export default class ServerPage extends Page {
  constructor ({name, port, host}) {
    super({
      type: 'Server',
      title: name
    })
    this.name = name
    this.port = port
    this.host = host
  }
}
