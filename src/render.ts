import { createTextVNode } from './h'
import { VNodeFlags, ChildrenFlags } from './flags'
import { patch, patchData } from './patch'

export default function render (vnode: any, container: any) {
    const prevVNode = container.vnode
    if (prevVNode == null) {
        if (vnode) {
            mount(vnode, container)
            container.vnode = vnode
        }
    } else {
        if (vnode) {
            patch(prevVNode, vnode, container)
            container.vnode = vnode
        } else {
            container.removeChild(prevVNode.el)
            container.vnode = null
        }
    }
}

export function mount(vnode, container, isSVG?) {
    const { flags } = vnode
    if (flags & VNodeFlags.ELEMENT) {
        // 挂在普通标签
        mountElement(vnode, container)
    } else if (flags & VNodeFlags.COMPONENT) {
        // 挂载组件
        mountComponent(vnode, container)
    } else if (flags & VNodeFlags.TEXT) {
        // 挂载纯文本
        mountText(vnode, container)
    } else if (flags & VNodeFlags.FRAGMENT) {
        mountFragment(vnode, container)
    } else if (flags & VNodeFlags.PORTAL) {
        //qualifiedName
        mountPortal(vnode, container)
    }
}

function mountElement(vnode, container, isSVG?) {
    isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
    const el = isSVG
        ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag)
    vnode.el = el

    const data = vnode.data
    if (data) {
        for (let key in data) {
            patchData(el, key, null, data[key])
        }
    }

    // 递归挂载子节点
    const { children, childFlags } = vnode
    if (childFlags !== ChildrenFlags.NO_CHILDREN) {
        if (childFlags & ChildrenFlags.SINGLE_VNODE) {
            // 单个节点直接调用mount
            mount(children, el, isSVG)
        } else if (childFlags & ChildrenFlags.KEYED_VNODES) {
            // 多个节点循环调用
            for(let i = 0; i < children.length; i++) {
                mount(children[i], el, isSVG)
            }
        }
    }

    container.appendChild(el)
}

function mountText(vnode, container) {
    const el = document.createTextNode(vnode.children)
    vnode.el = el
    container.appendChild(el)
}

function mountFragment(vnode, container, isSVG) {
    const { children, childFlags } = vnode
    switch(childFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            mount(children, container, isSVG)
            break
        case ChildrenFlags.NO_CHILDREN:
            // 为了有个节点可以引用
            const placeholder = createTextVNode('')
            mountText(placeholder, container)
            break
        default:
            for (let i = 0; i < children.length; i++) {
                mount(children[i], container, isSVG)
            }
            // 多个子节点指向第一个
            vnode.el = children[0].el
    }
}

function mountPortal(vnode, container) {
    const { tag, children, childFlags } = vnode

    // 获取挂载点
    const target = typeof tag === 'string' ? document.querySelector(tag) : tag

    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
        mount(children, target)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODE) {
        for (let i = 0; i < children.length; i++) {
            mount(children[i], target)
        }
    }

    // 占位的空节点
    const placeholder = createTextVNode('')
    mountText(placeholder, container)
    // el属性的引用点
    vnode.el = placeholder.el
}

function mountComponent(vnode, container, isSVG?) {
    if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
            mountStatefulComponent(vnode, container, isSVG)
    } else {
            mountFunctionalComponent(vnode, container, isSVG)
    }
}

function mountStatefulComponent(vnode, container, isSVG) {
    // create instance
    const instance = new vnode.tag()
    // render VNode
    instance.$vnode = instance.render()
    // mount
    mount(instance.$vnode, container, isSVG)
    // el 属性值 和 组件实例的 $el 属性都引用组件的根元素
    instance.$el = vnode.el = instance.$vnode.el
}

function mountFunctionalComponent(vnode, container, isSVG) {
    const $vnode = vnode.tag()
    mount($vnode, container, isSVG)
    vnode.el = $vnode.el
}

