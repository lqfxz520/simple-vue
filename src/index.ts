import { h, Fragment, Portal } from './h'
import render from './render'

const nextVNode = h(
    'div',
    null,
    'xbjpdm'
)
class MyClassComponent {
    render() {
        return h(
            'div',
            null,
            '看ejfeifjeifjeifjeifj'
        )
    }
}
const prevVNode = h(
    MyClassComponent
)

render(prevVNode, document.getElementById('app'))
render(nextVNode, document.getElementById('app'))
