import React from "react";
import { FastField } from "formik";
import { TextField } from '@material-ui/core';

const TextFieldInput = ({
  type,
  value,
  field,
  setFieldTouched,
  setFieldValue,
  standAlone,
  ...rest
}) => {
  return standAlone ? (
    <>
      <TextField
        id={field.name}
        key={field.name}
        label={field.name}
        type={type}
        value={value}
        onChange={event => {
          setFieldValue(field.name, event.target.value);
        }}
        onBlur={e => {
          setFieldTouched(field.name, true);
        }}
        required={field.required || false}
        fullWidth={true}
        {...rest}
      />
    </>
  ) : (
    <FastField
      render={({ form }) => {
        return (
          <>
            <TextField
              id={field.name}
              label={field.name}
              type={type}
              value={value}
              onChange={event => {
                setFieldValue(field.name, event.target.value);
              }}
              onBlur={e => {
                setFieldTouched(field.name, true);
              }}
              required={field.required || false}
              fullWidth={true}
              {...rest}
            />
          </>
        );
      }}
    />
  );
};

export default TextFieldInput;
