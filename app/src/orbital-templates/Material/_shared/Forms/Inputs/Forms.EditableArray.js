import React from "react";
import { Typography, TextField, Button, Icon, Chip } from "@material-ui/core";
import { withState, lifecycle, compose } from "recompose";
const enhance = compose(
  withState("edited", "setEdited"),
  withState("editableArray", "setEditableArray", {}),
  lifecycle({
    componentDidMount() {
      let { values, editableArray, setEditableArray, form } = this.props;
      if (form) {
        form &&
          form.fields.map(field => {
            if (field.type === "array") {
              setEditableArray({
                ...editableArray,
                [field.name]: values[field.name]
              });
            }
          });
      }
    },
    componentWillReceiveProps(nextProps) {
      let { values, editableArray, setEditableArray } = this.props;
      let { form } = nextProps;
      if (nextProps.form !== this.props.form) {
        form &&
          form.fields.map(field => {
            if (field.type === "array") {
              setEditableArray({
                ...editableArray,
                [field.name]: values[field.name]
              });
            }
          });
      }
    }
  })
);

const ChipTextField = props => {
  const {
    i,
    editableArray,
    field,
    setEditableArray,
    setFieldValue,
    setEdited,
    classes,
    onUpdate,
    onCreate,
    onGet,
    onDelete
  } = props;
  return (
    <div
      key={`${field.name}-${i}`}
      className={classes.chipTextField}
      style={{ padding: "10px" }}
    >
      <TextField
        key={`${field.name}-textfield-i`}
        value={editableArray[field.name][i] || ""}
        autoFocus={true}
        onBlur={() => setEdited(-1)}
        onChange={event => {
          let newState = {
            ...editableArray,
            [field.name]: editableArray[field.name].map((e, index) => {
              if (i === index) {
                return event.target.value;
              }
              return editableArray[field.name][index];
            })
          };
          setEditableArray(newState, () => {
            setFieldValue(field.name, newState[field.name]);
          });
        }}
      />
    </div>
  );
};
const EditableArray = ({
  field,
  setFieldValue,
  setEditableArray,
  editableArray,
  edited,
  setEdited,
  classes
}) => {
  return (
    <>
      <Typography>{field.placeholder}</Typography>
      {editableArray[field.name] &&
        editableArray[field.name].map((item, i) => {
          return (
            <>
              {(edited === i && (
                <ChipTextField
                  i={i}
                  editableArray={editableArray}
                  field={field}
                  setEditableArray={setEditableArray}
                  setEdited={setEdited}
                  setFieldValue={setFieldValue}
                  classes={classes}
                />
              )) || (
                <Chip
                  key={`${field.name}-${i}`}
                  label={editableArray[field.name][i]}
                  onClick={event => {
                    setEdited(i);
                  }}
                  onDelete={() => {
                    let newState = {
                      ...editableArray,
                      [field.name]: editableArray[field.name].filter(
                        (e, index) => {
                          if (i === index) {
                            return false;
                          }
                          return e;
                        }
                      )
                    };
                    setEditableArray(newState);
                    setFieldValue(field.name, newState[field.name]);
                  }}
                />
              )}
            </>
          );
        })}
      <Button
        variant="contained"
        style={{ marginLeft: "10px" }}
        onClick={() => {
          setEditableArray({
            ...editableArray,
            [field.name]: editableArray[field.name]
              ? [...editableArray[field.name], ""]
              : [""]
          });
          editableArray[field.name]
            ? setEdited(editableArray[field.name].length)
            : setEdited(0);
        }}
      >
        <Icon>add</Icon>
        {/* <span style={{ marginLeft: "5px" }}>add</span> */}
      </Button>
    </>
  );
};

export default enhance(EditableArray);
