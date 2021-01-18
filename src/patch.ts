import { VNodeFlags } from './flags'
import { mount } from './render'

export function patch(prevVNode, nextVNode, container) {
    const nextFlags = nextVNode.flags
    const prevFlags = prevVNode.flags

    if (prevFlags !== nextFlags) {
        replaceVNode(prevVNode, nextVNode, container)
    } else if (nextFlags & VNodeFlags.ELEMENT) {
        patchElement(prevVNode, nextVNode, container)
    }
}

function patchElement(prevVNode: VNode, nextVNode: VNode, container) {
    // todo....
}

function replaceVNode(prevVNode: VNode, nextVNode: VNode, container) {
    // todo...
    // 将旧的VNode所渲染的dom从容器中移除
    container.removeChild(prevVNode.el)
    mount(nextVNode, container)
}
