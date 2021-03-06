import { render } from "react-dom";
import Autocomplete from "./Autocomplete";

import AutocompleteDiv from "./AutocompleteDiv";
import AutocompleteHeighLight from "./AutocompleteHighLight";

require("./styles.css");

function App() {
  return (
    <div>
      {/* <h1>Auto suggestion Div</h1>
      <AutocompleteDiv
        suggestions={[
          "a",
          "b",
          "c",
          "TotalCurrentRatio",
          "NetAsset",
          "IntangibleAssests",
          "Inventory",
          "TotalCurrentLiability",
          "NetPayment",
          "InvoiceDate",
          "Solitary",
          "Tail",
          "Wetlands",
        ]}
      />

      <h1>Auto suggestion</h1>
      <Autocomplete
        suggestions={[
          "TotalCurrentRatio",
          "NetAsset",
          "IntangibleAssests",
          "Inventory",
          "TotalCurrentLiability",
          "NetPayment",
          "InvoiceDate",
          "Solitary",
          "Tail",
          "Wetlands",
        ]}
      /> */}

      <h1>Auto HighLight</h1>
      <AutocompleteHeighLight
        suggestions={[
          "TotalCurrentRatio",
          "NetAsset",
          "IntangibleAssests",
          "Inventory",
          "TotalCurrentLiability",
          "NetPayment",
          "InvoiceDate",
          "Solitary",
          "Tail",
          "Wetlands",
        ]}
      />
    </div>
  );
}

const container = document.createElement("div");
document.body.appendChild(container);
render(<App />, container);
