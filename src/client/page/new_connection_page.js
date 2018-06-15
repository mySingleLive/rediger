'use strict'

import Page from './page'
import { IconUrl } from '../constants'

export default class NewConnectionPage extends Page {
  constructor () {
    super({
      type: 'NewConnection',
      title: 'Add New Connection',
      fullname: 'Add New Connection'
    })
    this.name = 'Add New Connection'
    this.pageMode = 'first'
  }

  iconUrl () {
    return IconUrl.CONNECTION_ADD
  }
}
