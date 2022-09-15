import { LinearProgress } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Payment, useGetAllPaymentLazyQuery } from "../../generated/graphql";

export default function Payments() {
  const [getAllPayment] = useGetAllPaymentLazyQuery();
  const [data, setData] = useState<Payment[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllPayment();
      if (response.data?.getAllPayment) {
        setData(
          response.data?.getAllPayment.map((ind) => ({
            ...ind,
            id: ind._id,
          })) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const [columns, setColumns] = useState<GridColDef[]>([
    { field: "email", headerName: "Email", width: 150 },
    { field: "orderId", headerName: "Order Id", width: 150 },
    { field: "paymentId", headerName: "Payment Id", width: 150 },
    { field: "paymentLinkId", headerName: "Payment Link Id", width: 150 },
    { field: "signature", headerName: "Signature", width: 150 },
    { field: "userServiceId", headerName: "User Service Id", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
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
