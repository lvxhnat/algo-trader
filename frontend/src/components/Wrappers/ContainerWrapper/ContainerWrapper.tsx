import * as React from "react";

import { Alert, CssBaseline, Divider, Snackbar, Stack } from "@mui/material";
import Navigation from "components/Navigation";
import { ALERTS } from "common/constant/literals";
import { useConnectedStore } from "store/general/general";

export interface ContainerWrapperProps {
  children: React.ReactNode;
  hideNavigate?: boolean;
}

function DisconnectAlert() {
  const connected = useConnectedStore((state) => state.connected);

  return !connected ? (
    <Snackbar open={true}>
      <Alert severity="error"> {ALERTS.OFFLINE} </Alert>
    </Snackbar>
  ) : null;
}

export default function ContainerWrapper(props: ContainerWrapperProps) {
  if (window.location.href === "/")
    console.log(`
    ______   __                              __                               __                     
 /      \ |  \                            |  \                             |  \                    
|  $$$$$$\| $$  ______    ______         _| $$_     ______   ______    ____| $$  ______    ______  
| $$__| $$| $$ /      \  /      \       |   $$ \   /      \ |      \  /      $$ /      \  /      \ 
| $$    $$| $$|  $$$$$$\|  $$$$$$\       \$$$$$$  |  $$$$$$\ \$$$$$$\|  $$$$$$$|  $$$$$$\|  $$$$$$\
| $$$$$$$$| $$| $$  | $$| $$  | $$        | $$ __ | $$   \$$/      $$| $$  | $$| $$    $$| $$   \$$
| $$  | $$| $$| $$__| $$| $$__/ $$        | $$|  \| $$     |  $$$$$$$| $$__| $$| $$$$$$$$| $$      
| $$  | $$| $$ \$$    $$ \$$    $$         \$$  $$| $$      \$$    $$ \$$    $$ \$$     \| $$      
 \$$   \$$ \$$ _\$$$$$$$  \$$$$$$           \$$$$  \$$       \$$$$$$$  \$$$$$$$  \$$$$$$$ \$$      
              |  \__| $$                                                                           
               \$$    $$                                                                           
                \$$$$$$                                                                            
    `);

  return (
    <Stack
      style={{
        height: "100vh",
        paddingLeft: 20,
        paddingRight: 20,
      }}
      alignItems="center"
    >
      <CssBaseline />
      <Navigation hideNavigate={props.hideNavigate} />
      {props.hideNavigate ? <></> : <Divider style={{ width: "100%" }} />}
      <div
        style={{
          paddingTop: 10,
          height: "100%",
          width: "100%",
          overflowY: "hidden",
        }}
      >
        {props.children}
      </div>
      <DisconnectAlert />
    </Stack>
  );
}
