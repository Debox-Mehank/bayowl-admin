import { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { MainListItems } from "./listitems";
import Service from "../services/services";
import { ListOfService } from "./interface";
import UAM from "../uam/uam";
import Payments from "../payments/payments";
import TAM from "../tam/tam";
import ServiceTracking from "../serviceTracking/serviceTracking";
import ServiceTrackingEmployee from "../serviceTrackingEmployee/serviceTrackingEmployee";
import DashboardContentPage from "../dashboardContent/dashboardContent";
import Dashboard from "../dashboard/dashboard";
import { LoadingButton } from "@mui/lab";
import { useLogoutLazyQuery } from "../../generated/graphql";
const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const sideMenuItemManager: ListOfService[] = [
  ListOfService.UAM,
  ListOfService.ServiceTracking,
];

const sideMenuItemEmployee: ListOfService[] = [
  ListOfService.ServiceTrackingEmployee,
];

const sideMenuItemMaster: ListOfService[] = [
  ListOfService.Dashboard,
  ListOfService.Services,
  ListOfService.UAM,
  ListOfService.Payments,
  ListOfService.TAM,
  ListOfService.ServiceTracking,
  ListOfService.DashboardContent,
];

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function Layout({ typeRole }: { typeRole: string }) {
  const [open, setOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentService, setCurrentService] = useState<ListOfService>(
    typeRole === "master"
      ? ListOfService.Dashboard
      : typeRole === "manager"
      ? ListOfService.UAM
      : ListOfService.ServiceTrackingEmployee
  );

  const [logout] = useLogoutLazyQuery();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  function renderSwitch(param: ListOfService) {
    switch (param) {
      case ListOfService.Services:
        return <Service />;
      case ListOfService.UAM:
        return <UAM />;
      case ListOfService.Payments:
        return <Payments />;
      case ListOfService.TAM:
        return <TAM />;
      case ListOfService.ServiceTracking:
        return <ServiceTracking />;
      case ListOfService.ServiceTrackingEmployee:
        return <ServiceTrackingEmployee />;
      case ListOfService.DashboardContent:
        return <DashboardContentPage />;
      case ListOfService.Dashboard:
        return <Dashboard />;
    }
  }

  const logoutFunc = async () => {
    setLoading(true);
    await logout();
    localStorage.clear();
    setLoading(false);
    window.location.reload();
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
          <LoadingButton
            variant="outlined"
            style={{ color: "white", borderColor: "white" }}
            onClick={logoutFunc}
            loading={loading}
          >
            Logout
          </LoadingButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {typeRole === "master" &&
            sideMenuItemMaster.map((ind: ListOfService) => (
              <MainListItems
                name={ind}
                key={ind}
                changeService={(ser: ListOfService) => setCurrentService(ser)}
              />
            ))}
          {typeRole === "employee" &&
            sideMenuItemEmployee.map((ind: ListOfService) => (
              <MainListItems
                name={ind}
                key={ind}
                changeService={(ser: ListOfService) => setCurrentService(ser)}
              />
            ))}
          {typeRole === "manager" &&
            sideMenuItemManager.map((ind: ListOfService) => (
              <MainListItems
                name={ind}
                key={ind}
                changeService={(ser: ListOfService) => setCurrentService(ser)}
              />
            ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Box p={2} height={"91%"}>
          {renderSwitch(currentService)}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
