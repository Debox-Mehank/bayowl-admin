import styled from "@emotion/styled";
import { Button, ButtonProps } from "@mui/material";

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  background:
    "linear-gradient(to right, #18181B, #18181B), linear-gradient(to bottom right, #f09402, #ed4731)",
  backgroundClip: "padding-box, border-box",
  backgroundOrigin: "padding-box, border-box",
  transition: "0.3s all linear",
  color: "white",
  border: "2px solid transparent",
  borderRadius: "10px",
  fontSize: "12px",
  padding: "7px 16px",
  "&:disabled": {
    background: "rgb(255 255 255 / 0.1)",
    color: "rgb(255,255,255 / 0.4)",
    cursor: "not-allowed",
  },
}));
