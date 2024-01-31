import React from "./core/React.js";

// 实际上Vite会把jsx标签转成成下面的形式,这里引入了自己的React，所以用的是自己的React
// const App = React.createElement("div", { id: "root" }, "hi ", "hello world");
function Bar() {
  const [count ,setCount] = React.useState(0)
  const [bars ,setBar] = React.useState('bar')
  function handleClick() {
    setCount((count) => count + 1);
    setBar((s) => s + 'bar')
  }
  return (
    <div>
      {count}
      <div>
        {bars}
      </div>
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
