import React from "react";
import TablePagination from "@material-ui/core/TablePagination";
import { Paper, IconButton, Icon } from "@material-ui/core";
const Pagination = ({
  isSm,
  rowsPerPage,
  onChangePage,
  page,
  count,
  onChangeRowsPerPage,
}) => {
  return !isSm ? (
    <Paper>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        isSm={isSm}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={(ev, page) => {
          onChangePage(page);
        }}
        onChangeRowsPerPage={(ev, rowsPerPage) =>
          onChangeRowsPerPage(rowsPerPage)
        }
      />
    </Paper>
  ) : (
    <Paper>
      <IconButton onClick={() => onChangePage(page - 1)}>
        <Icon>navigate_before</Icon>
      </IconButton>
      {10 * (page + 1) - 9} to {`${10 * (page + 1)}`} of {count}
      <IconButton onClick={() => onChangePage(page + 1)}>
        <Icon>navigate_next</Icon>
      </IconButton>
    </Paper>
  );
};
export default Pagination;
