import { VNodeFlags, ChildrenFlags } from './flags'

export const Fragment = Symbol()
export const Portal = Symbol()
export function h (tag: any, data = null, children: null | String = null) {

    let flags = null
    if (typeof tag === 'string') {
        flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
        // 序列化class
        if (data) {
            data.class = normalizeClass(data.class)
        }
    } else if (tag === Fragment) {
        flags = VNodeFlags.FRAGMENT
    } else if (tag === Portal) {
        flags = VNodeFlags.PORTAL
        tag = data && data.target
    } else {
        // vue2
        if (tag !== null && typeof tag === 'object') {
            flags = tag.functional
                ? VNodeFlags.COMPONENT_FUNCTIONAL
                : VNodeFlags.COMPONENT_STATEFUL_NORMAL
        } else if (typeof tag === 'function') {
            // vue3
            flags = tag.prototype && tag.prototype.render
                ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
                : VNodeFlags.COMPONENT_FUNCTIONAL
        }
    }

    let childFlags = null
    if (Array.isArray(children)) {
        const { length } = children
        if (length === 0) {
            // 没节点
            childFlags = ChildrenFlags.NO_CHILDREN
        } else if (length === 1) {
            // 单个节点
            childFlags = ChildrenFlags.SINGLE_VNODE
            children = children[0]
        } else {
            // 确认包含key的子节点
            childFlags = ChildrenFlags.KEYED_VNODES
            children = normalizeVNodes(children)
        }
    } else if (children == null) {
        childFlags = ChildrenFlags.NO_CHILDREN
    } else if (children._isVnode) {
        childFlags = ChildrenFlags.SINGLE_VNODE
    } else {
        childFlags = ChildrenFlags.SINGLE_VNODE
        children = createTextVNode(children + '')
    }

    return {
        _isVnode: true,
        flags,
        tag,
        data,
        children,
        childFlags,
        el: null
    }

}

function normalizeVNodes (children: Array<VNode>) {
    const newChidren = []
    for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child.key == null) {
            child.key = '|' + i
        }
        newChidren.push(child)
    }
    return newChidren
}

function normalizeClass (classValue) {
    let res = ''
    if (typeof classValue === 'string') {
        res = classValue
    } else if (Array.isArray(classValue)) {
        for (let i = 0; i < classValue.length; i++) {
            res += normalizeClass(classValue[i]) + ' '
        }
    } else if (typeof classValue === 'object') {
        for (const name in classValue) {
            if (classValue[name]) {
                res += name + ' '
            }
        }
    }
    return res.trim()
}

export function createTextVNode (text: String) {
    return {
        _isVnode: false,
        flags: VNodeFlags.TEXT,
        tag: null,
        data: null,
        children: text,
        childFlags: ChildrenFlags.NO_CHILDREN,
        el: null
    }
}

