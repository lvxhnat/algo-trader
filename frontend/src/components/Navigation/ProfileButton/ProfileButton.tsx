import * as React from "react";
import * as S from "./style";
import { Avatar, Divider, Menu, MenuItem, Typography } from "@mui/material";
import ToggleThemeMode from "./ToggleThemeMode";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "common/constant";

const ProfileButton: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Avatar
        onClick={handleMenuOpen}
        style={{ cursor: "pointer" }}
        sx={{ width: 30, height: 30 }}
      />

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <S.ToggleThemeWrapper>
            <Typography variant="h4"> Light Theme </Typography>
            <div style={{ justifyContent: "flex-end" }}>
              <ToggleThemeMode />
            </div>
          </S.ToggleThemeWrapper>
        </MenuItem>
        <Divider />
      </Menu>
    </div>
  );
};

export default ProfileButton;
