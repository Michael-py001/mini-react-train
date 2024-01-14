import { it, expect, describe } from "vitest";
import React from "../day01/core/React";
describe("createElement", () => {
  it("show return vdom for element with null props", () => {
    const el = React.createElement("div", null, "hi");
    // 快照方法,保存自动生成快照格式
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `);
    // 基本用法：断言
    // expect(el).toEqual({
    //   type: "div",
    //   props: {
    //     children: [
    //       {
    //         type: "TEXT_ELEMENT",
    //         props: { nodeValue: "hi", children: [] },
    //       },
    //     ],
    //   },
    // });
  });

  it("show return vdom for element with props", () => {
    const el = React.createElement("div", {id:'id'}, "hi");
    // 快照方法,保存自动生成快照格式
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "id",
        },
        "type": "div",
      }
    `);
  });
});
