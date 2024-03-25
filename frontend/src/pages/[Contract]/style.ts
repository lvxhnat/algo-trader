import { styled } from "@mui/system";

export const MainWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  paddingTop: 10,
  paddingBottom: 10,
}));
export const LeftWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  width: "50%",
  padding: 0,
}));

export const RightWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  width: "50%",
  padding: 0,
}));
