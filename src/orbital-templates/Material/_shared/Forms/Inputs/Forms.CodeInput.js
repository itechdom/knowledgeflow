import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
// import loadLanguages from "prismjs/components";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

const CodeInput = ({ type, value, field, setFieldValue }) => {
  // const res = loadLanguages([type]);
  // console.log("res", res);
  return (
    <Editor
      value={value || ""}
      onValueChange={code => {
        setFieldValue(field.name, code);
      }}
      highlight={code => highlight(code, languages.js)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12
      }}
    />
  );
};

export default CodeInput;
