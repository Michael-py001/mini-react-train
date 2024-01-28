import React from "./core/React.js";

// 实际上Vite会把jsx标签转成成下面的形式,这里引入了自己的React，所以用的是自己的React
// const App = React.createElement("div", { id: "root" }, "hi ", "hello world");
let showBar = false;

function Counter({ num }) {
  // const foo = <div>foo</div>;
  function Foo() {
    return <div>foo</div>;
  }
  const bar = <p>bar</p>;
  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }
  return (
    <div>
      {/* <div>{showBar ? bar : foo}</div> */}
      <div>{showBar ? bar : <Foo></Foo>}</div>
      <button onClick={handleShowBar}>click</button>
    </div>
  );
}

function App() {
  return (
    <div>
      hello world
      <Counter num={10} />
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
