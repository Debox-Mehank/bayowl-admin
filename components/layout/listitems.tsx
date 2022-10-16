import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TableChartIcon from "@mui/icons-material/TableChart";
import { ListOfService } from "./interface";
export const MainListItems = ({
  name,
  changeService,
  selected,
}: {
  name: ListOfService;
  changeService: (ser: ListOfService) => void;
  selected: boolean;
}) => {
  return (
    <React.Fragment>
      <ListItemButton selected={selected} onClick={() => changeService(name)}>
        <ListItemIcon>
          <TableChartIcon />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </React.Fragment>
  );
};
