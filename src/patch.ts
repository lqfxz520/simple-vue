import { ChildrenFlags, VNodeFlags } from './flags'
import { mount } from './render'

const domPropsRE = /\W|^(?:value|checked|selected|muted)$/

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
    if (prevVNode.tag !== nextVNode.tag) {
        replaceVNode(prevVNode, nextVNode, container)
        return
    } else {
        // 引用现有的el
        const el = (nextVNode.el = prevVNode.el)
        const nextData = nextVNode.data
        const prevData = prevVNode.data
        if (nextData) {
            for (let key in nextData) {
                const prevValue = prevData[key]
                const nextValue = nextData[key]
                patchData(el, key, prevValue, nextValue)
            }
        }
        if (prevData) {
            for (let key in prevData) {
                const prevValue = prevData[key]
                if (prevValue && !nextData.hasOwnProperty(key)) {
                    patchData(el, key, prevValue, null)
                }
            }
        }
        patchChildren(
            prevVNode.childFlags,
            nextVNode.childFlags,
            prevVNode.children,
            nextVNode.children,
            el
        )
    }
}

function replaceVNode(prevVNode: VNode, nextVNode: VNode, container) {
    // todo...
    // 将旧的VNode所渲染的dom从容器中移除
    container.removeChild(prevVNode.el)
    mount(nextVNode, container)
}

export function patchData(el, key, prevValue, nextValue) {
    switch (key) {
        case 'style':
            // 循环设置新的style
            for (let k in nextValue) {
                el.style[k] = nextValue[k]
            }
            for (let k in prevValue) {
                if (!nextValue.hasOwnProperty(k)) {
                    el.style[k] = ''
                }
            }
            break
        case 'class':
            el.className = nextValue
            break
        default:
            if (key[0] === 'o' && key[1] === 'n') {
                if (prevValue) {
                    el.removeEventListener(key.slice(2), prevValue)
                }
                if (nextValue) {
                    el.addEventListener(key.slice(2), nextValue)
                }
            } else if (domPropsRE.test(key)) {
                el[key] = nextValue
            } else {
                el.setAttribute(key, nextValue)
            }
            break
    }
}

function patchChildren(
    prevChildFlags,
    nextChildFlags,
    prevChildren,
    nextChildren,
    container
) {
    switch (prevChildFlags) {
        // 旧的 children 中有单个子节点时，执行该 case 语句块
        case ChildrenFlags.SINGLE_VNODE:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的标签也是个单子节点时，执行该 case 语句块
                    patch(prevChildren, nextChildren, container)
                    break
                case ChildrenFlags.NO_CHILDREN:
                    // 新的标签没有子节点时，执行该 case 语句块
                    container.removeChild(prevChildren.el)
                    break
                default:
                    // 新的标签是个多子节点时，执行该 case 语句块
                    container.removeChild(prevChildren.el)
                    for (let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container)
                    }
                    break
            }
            break
        // 旧的 children 中没有子节点时，执行该 case 语句块
        case ChildrenFlags.NO_CHILDREN:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的标签也是个单子节点时，执行该 case 语句块
                    mount(nextChildren, container)
                    break
                case ChildrenFlags.NO_CHILDREN:
                    // 新的标签没有子节点时，执行该 case 语句块
                    break
                default:
                    // 新的标签是个多子节点时，执行该 case 语句块
                    for (let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container)
                    }
                    break
            }
            break
        // 旧的 children 中有多个子节点时，执行该 case 语句块
        default:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    // 新的标签也是个单子节点时，执行该 case 语句块
                    for (let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i].el)
                    }
                    mount(nextChildren, container)
                    break
                case ChildrenFlags.NO_CHILDREN:
                    // 新的标签没有子节点时，执行该 case 语句块
                    for (let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i].el)
                    }
                    break
                default:
                    // 新的标签是个多子节点时，执行该 case 语句块
                    // 遍历旧的子节点，将其全部移除
                    for (let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i].el)
                    }
                    // 遍历新的子节点，将其全部添加
                    for (let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container)
                    }
                break
            }
            break
    }
}

