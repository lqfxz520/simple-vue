// export interface VNode {
//     _isVnode: true
//     el: Element | null
//     flags: VNodeFlags
//     tag: string | FunctionalComponent | ComponentClass | null
//     data: VNodeData | null
//     children: VNodechildren
//     childFlags: ChildrenFlags
// }

export const ChildrenFlags = {
    // 未知的children
    UNKNOWN_CHILDREN: 0,
    // 没有
    NO_CHILDREN: 1,
    SINGLE_VNODE: 1 << 1,
    // 拥有多个节点，带key
    KEYED_VNODES: 1 << 2,
    NONE_KEYED_VNODES: 1 << 3
}

ChildrenFlags.MULTIPLE_VNODE = ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES

export const VNodeFlags = {
    ELEMENT_HTML: 1,
    ELEMENT_SVG: 1 << 1,
    COMPONENT_STATEFUL_NORMAL: 1 << 2,
    COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
    COMPONENT_STATEFUL_KEEP_ALIVE: 1 << 4,
    COMPONENT_FUNCTIONAL: 1 << 5,
    TEXT: 1 << 6,
    FRAGMENT: 1 << 7,
    PORTAL: 1 << 8
}

VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG

VNodeFlags.COMPONENT_STATEFUL =
    VNodeFlags.COMPONENT_STATEFUL_NORMAL |
    VNodeFlags.COMPONENT_STATEFUL_KEEP_ALIVE |
    VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE
VNodeFlags.COMPONENT = VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL
