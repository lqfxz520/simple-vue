import { VNodeFlags, ChildrenFlags } from './flags'
export default function render (vnode: any, container: any) {
    mount(vnode, container)
}

function mount(vnode, container, isSvg?) {
    const { flags } = vnode
    if (flags & VNodeFlags.ELEMENT) {
        // 挂在普通标签
        mountElement(vnode, container)
    } else if (flags & VNodeFlags.COMONENT) {
        // 挂载组件
    } else if (flags & VNodeFlags.TEXT) {
        // 挂载纯文本
    } else if (flags & VNodeFlags.FRAGMENT) {

    } else if (flags & VNodeFlags.PORTAL) {
        //qualifiedName
    }
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/
function mountElement(vnode, container, isSvg) {
    isSvg = isSvg || vnode.flags & VNodeFlags.ELEMENT_SVG
    const el = isSvg
        ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag)
    vnode.el = el

    const data = vnode.data
    if (data) {
        for (let key in data) {
            switch (key) {
                case 'style':
                    for (let k in data.style) {
                        el.style[k] = data.style[k]
                    }
                    break
                case 'class':
                    el.className = data[key]
                    break
                default:
                    if (domPropsRE.test(key)) {
                        el[key] = data[key]
                    } else {
                        el.setAttribute(key, data[key])
                    }
                    break
            }
        }
    }

    // 递归挂载子节点
    const { children, childFlags } = vnode
    if (childFlags !== ChildrenFlags.NO_CHILDREN) {
        if (childFlags & ChildrenFlags.SINGLE_VNODE) {
            // 单个节点直接调用mount
            mount(children, el, isSvg)
        } else if (childFlags & ChildrenFlags.KEYED_VNODES) {
            // 多个节点循环调用
            for(let i = 0; i < children.length; i++) {
                mount(children[i], el, isSvg)
            }
        }
    }

    container.appendChild(el)
}

function mountComponent(vnode, container) {}
