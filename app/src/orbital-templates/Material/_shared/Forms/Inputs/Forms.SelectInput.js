import React from "react";
import { Select, InputLabel, MenuItem } from "@material-ui/core";

const SelectInput = ({ setFieldValue, field, values }) => {
  return (
    <div>
      <InputLabel htmlFor={field.name}>{field.placeholder}</InputLabel>
      <Select
        id={field.name}
        value={values[field.name] || ""}
        onChange={event => {
          setFieldValue(field.name, event.target.value);
        }}
        fullWidth={true}
        required={field.required || false}
      >
        {field.options.map((option, index) => {
          return (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

export default SelectInput;
