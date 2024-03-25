import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ColorsEnum } from "common/theme";
import { Typography } from "@mui/material";
import { useThemeStore } from "store/theme";

const StyledButton = (props: {
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  const theme = useThemeStore();
  const color = props.disabled
    ? ColorsEnum.grey
    : theme.mode === "dark"
    ? ColorsEnum.white
    : ColorsEnum.black;
  return (
    <Button
      disabled={props.disabled}
      style={{ color: color, borderColor: color }}
      sx={{ '&:hover': { backgroundColor: ColorsEnum.beer18, opacity: '80%' } }}
    >
      <Typography variant="subtitle1">{props.children}</Typography>{" "}
    </Button>
  );
};

export default function BuySellClose() {
  return (
    <div>
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                "& > *": {
                m: 1,
                },
            }}
            >
      <ButtonGroup size="small" aria-label="Small button group">
        <StyledButton> Buy </StyledButton>
        <StyledButton> Sell </StyledButton>
        <StyledButton disabled> Close </StyledButton>
      </ButtonGroup>
    </Box>
    </div>
  );
}
