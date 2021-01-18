import { h } from './h'
import render from './render'

const elementVNode = h('input', {
    type: 'checkbox',
    checked: false,
    custom: 1,
    class: 'cls-a'
})

render(elementVNode, document.getElementById('app'))
