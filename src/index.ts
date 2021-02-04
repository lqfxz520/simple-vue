import { h, Fragment, Portal } from './h'
import render from './render'

function MyFunctionComp(props) {
    return h('div', null, props.text)
}

class MyComponent {
    localState = 'one'

    mounted() {
        setTimeout(() => {
            this.localState = 'two'
            this._update()
        }, 2000)
    }

    render() {
        return h(MyFunctionComp, {
            text: this.localState
        })
    }
}

const com = h(MyComponent)

render(com, document.getElementById('app'))

