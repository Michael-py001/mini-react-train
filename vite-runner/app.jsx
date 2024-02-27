import React from "./core/React.js";

// 实际上Vite会把jsx标签转成成下面的形式,这里引入了自己的React，所以用的是自己的React
// const App = React.createElement("div", { id: "root" }, "hi ", "hello world");
function Bar() {
  console.log("Bar");
  const [count, setCount] = React.useState(0);
  const [bars, setBar] = React.useState("bar");
  function handleClick() {
    setCount((count) => count + 1);
    // setBar((s) => s + 'bar')
    // setBar('bar')
  }

  /* 
    useEffect
    调用时机是在 React 完成对 DOM 的渲染之后，并且浏览器完成绘制之前。
    cleanup 函数是在下一次调用 effect 之前执行，所以你可以在 effect 中安全地执行清理。
    当deps为空数组时，不会调用cleanup函数

    问：useEffect的deps为空数组时，cleanup函数会执行吗？在什么时候执行？
    答：当useEffect的deps为空数组时，cleanup函数会在组件卸载时执行。这是因为useEffect会在每次渲染时都执行，但是当deps为空数组时，它只会在组件挂载和卸载时执行。cleanup函数用于清理 effect 创建的任何资源，比如取消订阅或清除定时器。
  */

  React.useEffect(() => {
    console.log("init");
    return ()=>{
      console.log("cleanUp0")
    }
  });

  React.useEffect(() => {
    console.log("update1", count);
    return ()=>{
      console.log("cleanUp1")
    }
  }, [count]);
  React.useEffect(() => {
    console.log("update2", count);
    return ()=>{
      console.log("cleanUp2")
    }
  }, [count]);
  return (
    <div>
      {count}
      <div>{bars}</div>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <Bar />
      {/* <CounterWrap /> */}
    </div>
  );
}

// const App = (
//   <div>
//     hello world
//     <CounterWrap />
//   </div>
// );

export default App;
