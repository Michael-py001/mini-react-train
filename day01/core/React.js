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
      children: children.map((child) => {
        return typeof child === "object" ? child : createTextNode(child);
      }),
    },
  };
}
function render(el, container) {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode(el.props.nodeValue)
      : document.createElement(el.type);
  // 设置props
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      //children特殊处理
      dom[key] = el.props[key];
    }
  });

  // 处理children节点
  const chilren = el.props.children || [];
  chilren.forEach((child) => {
    render(child, dom);
  });

  container.append(dom);
}
const React = {
  createElement,
  render,
};
export default React;
