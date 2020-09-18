import React from "react";
import Button from "@material-ui/core/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

export default function Commands({ clearCanvas, updateContext }) {
  return (
    <div>
      <Button variant="contained" color="secondary" onClick={clearCanvas}>
        clear
      </Button>

      <ToggleButtonGroup
        exclusive
        variant="contained"
        color="default"
        aria-label="contained default ToggleButton group"
      >
        <ToggleButton onClick={() => updateContext({ lineWidth: 1 })}>
          small
        </ToggleButton>
        <ToggleButton onClick={() => updateContext({ lineWidth: 5 })}>
          medium
        </ToggleButton>
        <ToggleButton onClick={() => updateContext({ lineWidth: 10 })}>
          large
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        exclusive
        variant="contained"
        color="default"
        aria-label="contained default ToggleButton group"
      >
        <ToggleButton onClick={() => updateContext({ strokeStyle: "#df4b26" })}>
          red
        </ToggleButton>
        <ToggleButton onClick={() => updateContext({ strokeStyle: "#98c379" })}>
          green
        </ToggleButton>
        <ToggleButton onClick={() => updateContext({ strokeStyle: "#0971f1" })}>
          blue
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
