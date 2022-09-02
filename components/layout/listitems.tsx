import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TableChartIcon from "@mui/icons-material/TableChart";
export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <TableChartIcon />
      </ListItemIcon>
      <ListItemText primary="Services" />
    </ListItemButton>
  </React.Fragment>
);
