import React from "react";
import { Formik } from "formik";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Icon,
  Typography
} from "@material-ui/core";
import Forms from "../Forms/Forms";
import FormsValidate from "../Forms/Forms.Validate";

export default class ModelAdd extends React.Component {
  state = {
    initialValues: {}
  };
  componentDidMount() {
    let formKeyVal = {};
    this.props.form &&
      this.props.form.fields.map(field => {
        formKeyVal[field.name] = field.value;
      });
    this.setState({ initialValues: formKeyVal });
  }
  componentWillReceiveProps(nextProps) {}
  render() {
    let {
      onSave,
      onCancel,
      form,
      modelSchema,
      modelName,
      ...rest
    } = this.props;
    return (
      <Formik
        onSubmit={(values, actions) => {
          onSave(values);
        }}
        enableReinitialize={true}
        validate={(values, props) => {
          let errors;
          errors = FormsValidate(values, form, modelSchema);
          return errors;
        }}
        initialValues={this.state.initialValues}
        render={({
          values,
          errors,
          touched,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched
        }) => {
          return (
            <Card>
              <CardContent>
                <Typography variant="title">Create {modelName}</Typography>
                <form id="add-form">
                  <Forms
                    id="add-fields"
                    modelSchema={modelSchema}
                    form={form}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    values={values}
                    touched={touched}
                    handleBlur={handleBlur}
                    {...rest}
                  />
                </form>
              </CardContent>
              <CardActions style={{ justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={event => {
                    handleSubmit(event);
                  }}
                >
                  <Icon>add_circle</Icon>
                  <span style={{ marginLeft: "3px" }}>Add</span>
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={event => {
                    onCancel(event);
                  }}
                >
                  Cancel
                </Button>
              </CardActions>
            </Card>
          );
        }}
      />
    );
  }
}
