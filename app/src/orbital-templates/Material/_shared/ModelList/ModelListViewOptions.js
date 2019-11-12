const ModelListViewOptions = ({ viewOption, setViewOption, classes }) => {
  return (
    <Grid
      className={classes.viewOptionContainer}
      container
      justify={"flex-end"}
    >
      <Grid item>
        <Paper>
          <Button
            className={
              viewOption === 0 ? classes.viewOptionSelected : classes.viewOption
            }
            onClick={() => setViewOption(0)}
          >
            Grid
          </Button>
        </Paper>
      </Grid>
      <Grid item>
        <Paper>
          <Button
            className={
              viewOption === 1 ? classes.viewOptionSelected : classes.viewOption
            }
            onClick={() => setViewOption(1)}
          >
            Table
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ModelListViewOptions;
