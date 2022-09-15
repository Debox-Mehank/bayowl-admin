import { LinearProgress } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useGetAllUserLazyQuery, User } from "../../generated/graphql";

export default function UAM() {
  const [getAllUser] = useGetAllUserLazyQuery();
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllUser();
      if (response.data?.getAllUser) {
        setData(
          response.data?.getAllUser.map((ind) => ({
            ...ind,
            id: ind._id,
            numberOfService: ind.services.length,
          })) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const [columns, setColumns] = useState<GridColDef[]>([
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "number", headerName: "Number", width: 150 },
    { field: "numberOfService", headerName: "Number Of Service", width: 150 },
    { field: "accountVerified", headerName: "Account Verified", width: 150 },
    { field: "lastLoggedIn", headerName: "Last Logged In", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "updatedAt", headerName: "Updated At", width: 150 },
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
      rowsPerPageOptions={[5]}
      checkboxSelection
      loading={loading}
    />
  );
}
