import { h, Fragment, Portal } from './h'
import render from './render'

class Component1 {
    render() {
        return h('span', null, 'component1')
    }
}

class Component2 {
    render() {
        return h('span', null, 'component2')
    }
}

class MyComponent {
    isTrue = true

    mounted() {
        setTimeout(() => {
            this.isTrue = false
            this._update()
        }, 2000)
    }

    render() {
        const vnode = this.isTrue ? h(Component1, {}) : h(Component2, {})
        console.log(vnode)
        return vnode
    }
}

const com = h(MyComponent)

render(com, document.getElementById('app'))

