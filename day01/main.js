import ReactDOM from "./core/ReactDOM.js";
import App from "./app.js";
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

// 实现api：ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// const ReactDOM = {
//   createRoot(container) {
//     return {
//       render(App) {
//         render(App, container);
//       },
//     };
//   },
// };

ReactDOM.createRoot(document.getElementById("root")).render(App);
