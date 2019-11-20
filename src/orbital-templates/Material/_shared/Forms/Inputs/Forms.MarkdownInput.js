import * as React from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

export default function App(props) {
  const {
    type,
    value,
    field,
    setFieldTouched,
    setFieldValue,
    standAlone,
    previewOnly,
    ...rest
  } = props;
  const [selectedTab, setSelectedTab] = React.useState("write");
  return (
    <div className="container">
      {previewOnly ? (
        <div
          dangerouslySetInnerHTML={{ __html: converter.makeHtml(value) }}
        ></div>
      ) : (
        <ReactMde
          value={value}
          onChange={event => {
            setFieldValue(field.name, event);
          }}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={markdown =>
            Promise.resolve(converter.makeHtml(markdown))
          }
        />
      )}
    </div>
  );
}
