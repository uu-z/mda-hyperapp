const { app } = require("hyperapp");
const { main, h1, div, button, input, li } = require("@hyperapp/html");
const { $, $set, $merge } = require("menhera");

const devtools = require("hyperapp-redux-devtools");

const typeStyle = {
  number: {
    background: "blue",
    width: "5px",
    borderRadius: "5px",
    height: "10px",
    alignSelf: "center"
  },
  boolean: {
    background: "red",
    width: "5px",
    borderRadius: "5px",
    height: "10px",
    alignSelf: "center"
  },
  array: {
    background: "pink",
    width: "10px",
    borderRadius: "2px",
    height: "10px",
    alignSelf: "center"
  },
  string: {
    background: "pink",
    width: "5px",
    borderRadius: "5px",
    height: "10px",
    alignSelf: "center"
  }
};

const typeIco = ({ type, keyType, valType }) =>
  div({
    style: typeStyle[type]
  });

const StringComp = ({ v, k, depth, actions }) =>
  div([
    typeIco({ type: v.type }),
    `${k}:`,
    input({
      value: v.val,
      style: {},
      onchange: e => actions.$set({ [depth]: e.target.value })
    })
  ]);
const ArrayComp = ({ v, k, depth, actions }) =>
  div([typeIco({ type: v.type }), `${k}:`, li(v.val.map(v => div(v)))]);

const compile = obj => {
  let vals = {};
  $(obj, (k, v) => {
    let type = typeof v;

    if (type === "object") {
      if (Array.isArray(v)) {
        type = "array";
      } else {
        v = compile(v);
      }
    }
    vals[k] = { type, val: v };
  });
  return vals;
};

const parse = ({ val, depth = "" }) => {
  let content = [];
  $(val, (k, v) => {
    newDepth = depth ? `${depth}/${k}` : k;
    if (v.type == "string") {
      content.push(StringComp({ k, v, depth: newDepth, actions }));
    }

    if (v.type == "boolean") {
      content.push(StringComp({ k, v, depth: newDepth, actions }));
    }

    if (v.type == "number") {
      content.push(StringComp({ k, v, depth: newDepth, actions }));
    }

    if (v.type === "object") {
      content.push(parse({ k, val: v.val, actions, depth: newDepth }));
    }

    if (v.type === "array") {
      content.push(ArrayComp({ k, v, depth: newDepth, actions }));
    }
  });
  return content;
};

const state = compile({
  test: {
    number: 6666,
    string: "2333",
    boolean: true,
    array: [1, 2, 3],
    object: { a: { b: 2, c: 3 }, b: 2, c: 3 }
  }
});

const actions = {
  $set: data => state => $merge([state, data])
};

const view = (state, actions) => {
  return main(parse({ val: state }));
};

devtools(app)(state, actions, view, document.body);
