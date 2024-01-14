// react -> vdom -> js 对象 -> 真实 dom

// 一个dom节点用js描述

const el = {
  type: 'div',
  props:{
    id: 'app',
    children:[
      {
        type: 'TEXT_ELEMENT',
        props:{
          nodeValue: 'hello world',
          children: []
        }
      }
    ]
  }
}