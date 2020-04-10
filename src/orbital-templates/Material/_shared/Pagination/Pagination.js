import React from "react";
import TablePagination from "@material-ui/core/TablePagination";
import { Paper } from "@material-ui/core";
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
    <></>
  );
};
export default Pagination;
