// v1
// const dom = document.createElement("div");
// dom.id = "root"
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode("");
// textNode.nodeValue = 'hello world'
// dom.append(textNode)
// v2 react -> vdom -> js 对象 -> 真实 dom

//2 抽离textElement
// const textEl = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "hello world",
//     children: [],
//   },
// };

// 1 一个dom节点用js描述
// const el = {
//   type: "div",
//   props: {
//     id: "app",
//     children: [textEl],
//   },
// };

// 4 封装createTextNode
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

//5 封装createElement
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>{
        return typeof child === "object" ? child : createTextNode(child)
      }),
    },
  };
}

// // 6 使用封装的方法动态生成虚拟dom
// const textEl = createTextNode("hello world");
// const App = createElement("div", { id: "root" }, textEl);

// 3 根据js描述的节点对象创建真实dom vdom -> dom
// const dom = document.createElement(App.type);
// dom.id = App.props.id;
// document.querySelector("#root").append(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = textEl.props.nodeValue;
// dom.append(textNode);

// 7 封装render方法

function render(el,container) {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode(el.props.nodeValue)
      : document.createElement(el.type);
  // 设置props
  Object.keys(el.props).forEach((key) => {
    if(key !== 'children') { //children特殊处理
      dom[key] = el.props[key]
    }
  })

  // 处理children节点
  const chilren = el.props.children || [];
  chilren.forEach(child=>{
    render(child,dom)
  })

  container.append(dom)
}

const App = createElement("div", { id: "root" }, 'hi ','hello world');
// const App = createElement("div", { id: "root" }, 'hello world');
console.log("App:",App);
render(App,document.querySelector('#root'))
