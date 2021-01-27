import { h, Fragment, Portal } from './h'
import render from './render'

const prevVNode = h(
    Portal,
    {
        target: '#portal-box'
    },
    [
        h('p', null, 'old node 1'),
        h('p', null, 'old node 2'),
    ]
)

const nextVNode = h(
    Portal,
    {
        target: '#portal-box-1'
    },
    [
        h('p', null, 'new node 1'),
        h('p', null, 'new node 2')
    ]
)

render(prevVNode, document.getElementById('app'))
setTimeout(() => {
    render(nextVNode, document.getElementById('app'))
}, 2000)

