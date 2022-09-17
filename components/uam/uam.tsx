import { LinearProgress } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import { useGetAllUserLazyQuery, User } from "../../generated/graphql";

export type CustomerUserOmit = Omit<User, "services">;

interface CustomUser extends CustomerUserOmit {
  id: string;
  numberOfService: number;
}

const CELL_WIDTH = 180;

export default function UAM() {
  const [getAllUser] = useGetAllUserLazyQuery();
  const [data, setData] = useState<CustomUser[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllUser();
      if (response.data?.getAllUser) {
        setData(
          response.data?.getAllUser.map((el) => ({
            ...el,
            id: el._id,
            numberOfService: el.services.length,
            lastLoggedIn: moment(el.lastLoggedIn).format("MMM Do YY, hh:mm a"),
            createdAt: moment(el.createdAt).format("MMM Do YY, hh:mm a"),
            updatedAt: moment(el.updatedAt).format("MMM Do YY, hh:mm a"),
          }))
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const [columns, setColumns] = useState<GridColDef[]>([
    { field: "name", headerName: "Name", width: CELL_WIDTH },
    { field: "email", headerName: "Email", width: CELL_WIDTH },
    { field: "number", headerName: "Number", width: CELL_WIDTH },
    {
      field: "numberOfService",
      headerName: "Number Of Service",
      width: CELL_WIDTH,
    },
    {
      field: "accountVerified",
      headerName: "Account Verified",
      width: CELL_WIDTH,
    },
    { field: "lastLoggedIn", headerName: "Last Logged In", width: CELL_WIDTH },
    { field: "createdAt", headerName: "Created At", width: CELL_WIDTH },
    { field: "updatedAt", headerName: "Updated At", width: CELL_WIDTH },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  // const [servicesData, setServicesData] = useState<Services[]>([]);
  return (
    <DataGrid
      rows={data}
      columns={columns}
      components={{
        Toolbar: GridToolbar,
        LoadingOverlay: LinearProgress,
      }}
      pageSize={10}
      rowsPerPageOptions={[10]}
      checkboxSelection
      loading={loading}
    />
  );
}
