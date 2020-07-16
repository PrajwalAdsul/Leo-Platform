import Search from 'react-search'
import ReactDOM from 'react-dom'
import React, { Component, PropTypes } from 'react'
 
export default class Searchh extends Component {
  HiItems(items) {
    console.log(items)
  }
 funn(items){
  console.log(items);
 }
  render () {
    let items = [
      { id: 0, value: 'ruby' },
      { id: 1, value: 'javascript' },
      { id: 2, value: 'lua' },
      { id: 3, value: 'go' },
      { id: 4, value: 'julia' }
    ]
 
    return (
      <div>
        <Search items={items} />
 
        <Search items={items}
                placeholder='Pick your language'
                maxSelected={3}
                multiple={true}
                onItemsChanged={this.funn()} />
      </div>
    )
  }
}
 