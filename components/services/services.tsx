import {
  Button,
  CircularProgress,
  LinearProgress,
  Toolbar,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  Services,
  useAddServiceMutation,
  useGetAllServiceLazyQuery,
  useGetAllServiceQuery,
} from "../../generated/graphql";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { parse, ParseStepResult } from "papaparse";
interface ServiceInterface {
  _id: string;
  serviceCategory: string;
  serviceName: string;
  subService: string;
  subSubService: string;
  for: string;
  description: string;
  estimatedTime: number;
  price: number;
  inputLimit: number;
  fileFormat: string;
  deliveryFormat: string;
  deliveryDays: number;
  maxDuration: number;
  numberOfReferenceFileUploads: number;
  setOfRevisions: number;
  revisionsDelivery: number;
  mixVocalTuning: string;
  mixProcessingReverbs: number;
  mixProcessingDelays: number;
  mixProcessingOtherFx: number;
  addOn: {
    type: string;
    value: number;
  }[];
}

export default function Service() {
  const [getAllService] = useGetAllServiceLazyQuery();
  const [data, setData] = useState<Services[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllService();
      if (response.data?.getAllService) {
        setColumns((prev) => {
          var newData = [...prev];
          response.data!.getAllService.map((ind) =>
            ind.addOn.map((indx) =>
              newData.push({
                field: indx.type,
                headerName: indx.type,
                width: 150,
              })
            )
          );
          return newData;
        });

        setData(
          response.data?.getAllService.map((ind) => ({
            ...ind,
            id: ind._id,
            ...ind.addOn.map((indx) => ({ [indx.type]: indx.value })),
          })) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const [addService] = useAddServiceMutation();
  const [columns, setColumns] = useState<GridColDef[]>([
    { field: "serviceCategory", headerName: "Service Category", width: 150 },
    { field: "serviceName", headerName: "Service Name", width: 150 },
    { field: "subService", headerName: "Sub Service", width: 150 },
    { field: "subSubService", headerName: "Sub Sub Service", width: 150 },
    { field: "for", headerName: "For Information", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "estimatedTime", headerName: "Estimated Time", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "inputLimit", headerName: "Input Limit", width: 150 },
    { field: "fileFormat", headerName: "File Format", width: 150 },
    { field: "deliveryFormat", headerName: "Delivery Format", width: 150 },
    { field: "deliveryDate", headerName: "Delivery Date", width: 150 },
    { field: "maxDuration", headerName: "Max Duration", width: 150 },
    {
      field: "numberOfReferenceFileUploads",
      headerName: "Number Of File Uploads",
      width: 150,
    },
    { field: "setOfRevisions", headerName: "Set Of Revisions", width: 150 },
    {
      field: "revisionsDelivery",
      headerName: "Revisions Delivery",
      width: 150,
    },
    { field: "mixVocalTuning", headerName: "Mix - Vocal Tuning", width: 150 },
    {
      field: "mixProcessingReverbs",
      headerName: "Mix - Processing Reverbs",
      width: 150,
    },
    {
      field: "mixProcessingDelays",
      headerName: "Mix - Processing Delays",
      width: 150,
    },
    {
      field: "mixProcessingOtherFx",
      headerName: "Mix - Processing Other Fx",
      width: 150,
    },
  ]);

  function handleFileChange(inputFile: File) {
    setLoading(true);
    parse(inputFile, {
      worker: true,
      step: async function (row: ParseStepResult<string>) {
        console.log(row);
        await addService({
          variables: {
            input: {
              serviceCategory: row.data[0],
              serviceName: row.data[1],
              subService: row.data[2],
              subSubService: row.data[3],
              for: row.data[4],
              description: row.data[5],
              estimatedTime: parseInt(row.data[6]),
              price: parseInt(row.data[7]),
              inputLimit: parseInt(row.data[8]),
              fileFormat: row.data[9],
              deliveryFormat: row.data[10],
              deliveryDays: parseInt(row.data[11]),
              maxDuration: parseInt(row.data[12]),
              numberOfReferenceFileUploads: parseInt(row.data[13]),
              setOfRevisions: parseInt(row.data[14]),
              revisionsDelivery: parseInt(row.data[15]),
              mixVocalTuning: row.data[16],
              mixProcessingReverbs: row.data[17],
              mixProcessingDelays: row.data[18],
              mixProcessingOtherFx: row.data[19],
              addOn: [
                {
                  type: "Extra Revision",
                  value: parseInt(row.data[20]),
                },
                {
                  type: "30 Second",
                  value: parseInt(row.data[21]),
                },
              ],
            },
          },
        });
      },
      complete: function () {
        setLoading(false);
      },
    });
  }

  let inputFile: HTMLInputElement;
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <label htmlFor="contained-button-file">
          <input
            style={{ display: "none" }}
            ref={(input) => {
              // assigns a reference so we can trigger it later
              inputFile = input!;
            }}
            accept=".csv"
            id="contained-button-file"
            type="file"
            onChange={(e) => {
              handleFileChange(e.target.files![0]);
            }}
          />
        </label>
        <Button
          onClick={() => inputFile.click()}
          startIcon={<FileUploadOutlinedIcon />}
        >
          Upload CSV
        </Button>
      </GridToolbarContainer>
    );
  }
  const [loading, setLoading] = useState<boolean>(false);
  // const [servicesData, setServicesData] = useState<Services[]>([]);
  return (
    <DataGrid
      rows={data}
      columns={columns}
      components={{
        Toolbar: CustomToolbar,
        LoadingOverlay: LinearProgress,
      }}
      pageSize={10}
      rowsPerPageOptions={[5]}
      checkboxSelection
      loading={loading}
    />
  );
}
