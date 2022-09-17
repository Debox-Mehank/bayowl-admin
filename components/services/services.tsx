import { Button, LinearProgress, Snackbar } from "@mui/material";
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
  ServicesInput,
  useAddServiceMutation,
  useGetAllServiceLazyQuery,
} from "../../generated/graphql";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { parse, ParseResult, ParseStepResult } from "papaparse";
import { durationSeconds } from "../../utility/helpers";

const columns: GridColDef[] = [
  { field: "mainCategory", headerName: "Main Category", width: 150 },
  { field: "subCategory", headerName: "Sub Category", width: 150 },
  { field: "serviceName", headerName: "Service Name", width: 150 },
  { field: "subService", headerName: "Sub Service", width: 150 },
  { field: "subService2", headerName: "Sub Service 2", width: 150 },
  { field: "description", headerName: "Description", width: 150 },
  {
    field: "estimatedTime",
    headerName: "Estimated Time on Project (hours)",
    width: 150,
  },
  { field: "price", headerName: "Price", width: 150 },
  { field: "inputTrackLimit", headerName: "Track Count Limit", width: 150 },
  { field: "uploadFileFormat", headerName: "Upload File Format", width: 150 },
  {
    field: "deliveryFileFormat",
    headerName: "Delivery Format",
    width: 150,
  },
  { field: "deliveryDays", headerName: "Delivery Days", width: 150 },
  {
    field: "maxDuration",
    headerName: "File(s) Duration Limit",
    width: 150,
  },
  {
    field: "numberOfReferenceFileUploads",
    headerName: "Additional Reference Files",
    width: 150,
  },
  { field: "setOfRevisions", headerName: "Revisions", width: 150 },
  {
    field: "revisionsDelivery",
    headerName: "Revision Delivery Days",
    width: 150,
  },
  {
    field: "mixVocalTuningBasic",
    headerName: "Mix Processing: Basic Vocal Tuning",
    width: 150,
  },
  {
    field: "mixVocalTuningAdvanced",
    headerName: "Mix Processing: Advanced Vocal Tuning",
    width: 150,
  },
  {
    field: "mixProcessingReverbs",
    headerName: "Mix Processing: Reverbs",
    width: 150,
  },
  {
    field: "mixProcessingDelays",
    headerName: "Mix Processing: Delays",
    width: 150,
  },
  {
    field: "mixProcessingOtherFx",
    headerName: "Mix Processing: Other Fx",
    width: 150,
  },
  {
    field: "Extra Revision",
    headerName: "Extra Revision",
    width: 150,
  },
  {
    field: "Add on: 10 Tracks",
    headerName: "Add on: 10 Tracks",
    width: 150,
  },
  {
    field: "Add on: 30s Duration",
    headerName: "Add on: 30s Duration",
    width: 150,
  },
];

export default function Service() {
  const [getAllService] = useGetAllServiceLazyQuery();
  const [data, setData] = useState<Services[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleErrorClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowError(false);
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllService();
      if (response.error) {
        setErrorMessage(response.error.message.toString());
        setShowError(true);
        setLoading(false);
        return;
      }

      if (!response.data) {
        setErrorMessage("Something went wrong, please try again later");
        setShowError(true);
        setLoading(false);
        return;
      }

      const servicesDataRaw =
        response.data?.getAllService.map((ind) => ({
          ...ind,
          id: ind._id,
        })) ?? [];

      const servicesData = servicesDataRaw.map((el) => {
        var sObj: any = { ...el };
        el.addOn.map((elem) => {
          sObj[elem.type] = elem.value;
        });
        delete sObj.addOn;
        return sObj;
      });

      setData(servicesData);

      setLoading(false);
    };
    fetchServices();
  }, []);
  const [addService] = useAddServiceMutation();

  function handleFileChange(inputFile: File) {
    parse(inputFile, {
      worker: true,
      complete: async function (row: ParseResult<string>) {
        const data: ServicesInput[] = row.data.map((el) => ({
          mainCategory: el[0],
          subCategory: el[1],
          serviceName: el[2],
          subService: el[3] === "" ? null : el[3],
          subService2: el[4] === "" ? null : el[4],
          description: el[5] === "" ? null : el[5],
          estimatedTime: el[6] === "" ? null : parseInt(el[6]),
          price: parseInt(el[7] === "" ? "0" : el[7]),
          inputTrackLimit: el[8] === "" ? null : parseInt(el[8]),
          uploadFileFormat: el[9] === "" ? [] : el[9].split(","),
          deliveryFileFormat: el[10] === "" ? [] : el[10].split(","),
          deliveryDays: el[11] === "" ? null : parseInt(el[11]),
          maxFileDuration: el[12] === "" ? null : durationSeconds(el[12]),
          numberOfReferenceFileUploads: el[13] === "" ? null : parseInt(el[13]),
          setOfRevisions: el[14] === "" ? null : parseInt(el[14]),
          revisionsDelivery: el[15] === "" ? null : parseInt(el[15]),
          mixVocalTuningBasic: el[16] === "" ? null : el[16],
          mixVocalTuningAdvanced: el[17] === "" ? null : el[17],
          mixProcessingReverbs: el[18] === "" ? null : el[18],
          mixProcessingDelays: el[19] === "" ? null : el[19],
          mixProcessingOtherFx: el[20] === "" ? null : el[20],
          addOn: [
            {
              type: "Extra Revision",
              value: el[21] === "" ? null : parseInt(el[21]),
            },
            {
              type: "Add on: 10 Tracks",
              value: el[22] === "" ? null : parseInt(el[22]),
            },
            {
              type: "Add on: 30s Duration",
              value: el[23] === "" ? null : parseInt(el[23]),
            },
          ],
        }));

        setLoading(true);

        const { data: addData, errors } = await addService({
          variables: { input: data },
        });

        if (errors) {
          setLoading(false);
          setErrorMessage(errors[0].message);
          setShowError(true);
          return;
        }

        if (!addData || !addData.addService) {
          setLoading(false);
          setErrorMessage("Something went wrong, try again later");
          setShowError(true);
          return;
        }

        const finalData: Services[] = data.map((el) => ({
          ...el,
          _id:
            Date.now().toString(36) + Math.random().toString(36).substring(2),
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        const servicesData = finalData.map((el) => {
          var sObj: any = { ...el };
          el.addOn.map((elem) => {
            sObj[elem.type] = elem.value;
          });
          delete sObj.addOn;
          return sObj;
        });
        setData(servicesData);
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
  return (
    <>
      <DataGrid
        rows={data}
        columns={columns}
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: LinearProgress,
        }}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        loading={loading}
      />
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={handleErrorClose}
        message={errorMessage}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      />
    </>
  );
}
