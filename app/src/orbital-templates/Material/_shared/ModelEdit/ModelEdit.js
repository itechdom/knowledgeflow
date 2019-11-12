import React from "react";
import { Formik } from "formik";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Icon
} from "@material-ui/core";
import Forms from "../Forms/Forms";
import FormsValidate from "../Forms/Forms.Validate";
import Loading from "../Loading/Loading";

export default class ModelEdit extends React.Component {
  componentWillReceiveProps(nextProps) {}
  componentDidMount() {}
  render() {
    let {
      model,
      modelSchema,
      onSave,
      onCancel,
      form,
      uploadMedia,
      deleteMedia,
      onMediaUploadComplete,
      onGalleryUploadComplete,
      onMediaDeleteComplete,
      onGalleryDeleteComplete,
      uploadGallery,
      gallery,
      media,
      classes,
      ...rest
    } = this.props;

    return !!model ? (
      <Formik
        onSubmit={(values, actions) => {
          onSave(model, values);
        }}
        initialValues={model}
        enableReinitialize={true}
        validate={(values, props) => {
          let errors;
          errors = FormsValidate(values, form, modelSchema);
          return errors;
        }}
        render={({
          values,
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched
        }) => {
          return (
            <Card className={classes && classes.editContent}>
              <CardHeader title={model && model.title} />
              <CardContent>
                <form id="edit-form">
                  <Forms
                    id="edit-fields"
                    form={form}
                    errors={errors}
                    modelSchema={modelSchema}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    values={values}
                    touched={touched}
                    media={model && model.image}
                    tempMedia={media}
                    gallery={model && model.gallery}
                    tempGallery={gallery}
                    isSubmitting={isSubmitting}
                    onMediaDrop={(acceptedFiles, rejectedFiles) => {
                      uploadMedia(model._id, acceptedFiles).then(res => {
                        onMediaUploadComplete(model, res.data);
                      });
                    }}
                    onGalleryDrop={(acceptedFiles, rejectedFiles) => {
                      uploadGallery(model._id, acceptedFiles).then(res => {
                        onGalleryUploadComplete(model, res.data);
                      });
                    }}
                    onMediaDelete={(image, index, isMultiple) => {
                      deleteMedia(model._id, image).then(() => {
                        if (isMultiple) {
                          onGalleryDeleteComplete(model, image, index);
                        }
                        onMediaDeleteComplete(model, image);
                      });
                    }}
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
                  <Icon>save</Icon>
                  <span style={{ marginLeft: "5px" }}>Save</span>
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
    ) : (
      <Loading />
    );
  }
}
