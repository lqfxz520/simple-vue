import { h, Fragment, Portal } from './h'
import render from './render'

const prevVNode = h(
    'div',
    {
        style: {
            width: '100px',
            height: '100px',
            background: 'red',
        },
        class: {
            aaa: false,
            bbb: true,
        },
        onclick () {
            console.log(34)
        },
        custom: 1
    },
)

const nextVNode = h(
    'div',
    {
        style: {
            width: '100px',
            height: '100px',
            background: 'black',
            borderRadius: '10px',
        },
        class: {
            aaa: true,
            bbb: false
        }
    }
)

render(prevVNode, document.getElementById('app'))
render(nextVNode, document.getElementById('app'))

