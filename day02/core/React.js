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
  nextWorkOfUnit = {
    // 在主入口中初始化任务队列
    dom: container,
    props: {
      children: [el],
    },
  };
  // const dom =
  //   el.type === "TEXT_ELEMENT"
  //     ? document.createTextNode(el.props.nodeValue)
  //     : document.createElement(el.type);
  // // 设置props
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== "children") {
  //     //children特殊处理
  //     dom[key] = el.props[key];
  //   }
  // });

  // // 处理children节点
  // const chilren = el.props.children || [];
  // chilren.forEach((child) => {
  //   render(child, dom);
  // });

  // container.append(dom);
}

let nextWorkOfUnit = null; // 当前正在工作的任务
function workLoop(deadline) {
  let shouldYield = false; // 是否要让出时间片
  // 有任务并且当前帧还没有结束
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit); // 执行任务 返回下一个任务
    shouldYield = deadline.timeRemaining() < 1; // 没有时间了
  }

  requestIdleCallback(workLoop);
}

function performWorkOfUnit(work) {
  //1. 创建dom
  if (!work.dom) {
    // 没有dom节点才处理
    const dom = (work.dom = // 保存dom
      work.type === "TEXT_ELEMENT"
        ? document.createTextNode(work.props.nodeValue)
        : document.createElement(work.type));
    work.parent.dom.append(dom); // 把dom添加到父节点上
    // 2. 设置属性props
    Object.keys(work.props).forEach((key) => {
      if (key !== "children") {
        //children特殊处理
        dom[key] = work.props[key];
      }
    });
  }
  // 3. 处理children 树结构转换为链表 设置好指针
  const children = work.props.children || [];
  let prevChild = null;
  children.forEach((child, index) => {
    //用一个对象保存当前节点的信息
    const newWork = {
      parent: work,
      dom: null,
      props: child.props,
      type: child.type,
      child: null,
      sibling: null,
    };

    if (index === 0) {
      work.child = newWork; // 设置第一个子节点
    } else {
      prevChild.sibling = newWork; // 设置兄弟节点
    }
    prevChild = newWork; // 保存上一个节点
  });
  // 4. 返回下一个任务
  if (work.child) {
    // 有子节点 优先处理子节点
    return work.child;
  }
  if (work.sibling) {
    // 有兄弟节点 处理兄弟节点
    return work.sibling;
  }

  return work.parent?.sibling; // 没有子节点也没有兄弟节点 返回父节点的兄弟节点
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};
export default React;
