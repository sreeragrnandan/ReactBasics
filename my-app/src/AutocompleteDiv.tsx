/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, List, ListItem } from "@mui/material";
import React, { useState, useEffect, useRef, Fragment } from "react";
import CaretPositioning from "./EditCaretPositioning";
import setCaret from "./setCaret";

function measureText(
  pText: string | null,
  pFontSize: string,
  pStyle: CSSStyleDeclaration | null
) {
  var lDiv = document.createElement("div");

  document.body.appendChild(lDiv);

  if (pStyle != null) {
    lDiv.style.border = "1px solid #999;";
    lDiv.style.padding = "0.5rem";
    lDiv.style.width = "300px";
  }
  lDiv.style.fontSize = "" + pFontSize + "px";
  lDiv.style.position = "absolute";
  lDiv.style.left = "-1000";
  lDiv.style.top = "-1000";

  lDiv.textContent = pText;

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight,
  };

  document.body.removeChild(lDiv);

  return lResult;
}

function AutocompleteDiv({ suggestions }: { suggestions: Array<string> }) {
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [conformedSuggestion, setConformedSuggestion] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState<string>("");
  const [contentWidth, setContentWidth] = useState("0px");
  const [caretPosition, setCaretPosition] = useState({ start: 0, end: 0 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editable, setEditable] = useState<HTMLElement | null>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const alllowedOperstions = ["+", "-", "(", ")", "*", "^", "%", "/"];
  // let renderOutput: (string | JSX.Element)[];

  // let searchTerm: string;
  let savedCaretPosition: {
    start: number;
    end: number;
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLDivElement>) => {
    if (inputAreaRef.current) {
      savedCaretPosition = CaretPositioning.saveSelection(e.currentTarget);
      setCaretPosition(savedCaretPosition);
      const userInp = inputAreaRef.current.innerText;
      const searchArea = userInp.slice(0, savedCaretPosition.end);

      // For operators
      if (
        alllowedOperstions.includes(searchArea[searchArea.length - 1]) &&
        searchArea[searchArea.length - 1] !==
          conformedSuggestion[savedCaretPosition.end - 1]
      ) {
        let value: string;
        let val: string;
        savedCaretPosition = CaretPositioning.saveSelection(e.currentTarget);
        if (conformedSuggestion.length === 0) {
          val = "";
        } else {
          val = conformedSuggestion;
        }

        if (savedCaretPosition.end === 0 || savedCaretPosition.end === 1) {
          value = searchArea[searchArea.length - 1] + conformedSuggestion;
        } else if (
          conformedSuggestion.length > savedCaretPosition.end &&
          conformedSuggestion.length > 0
        ) {
          value =
            conformedSuggestion.slice(0, savedCaretPosition.end - 1) +
            searchArea[searchArea.length - 1] +
            conformedSuggestion.slice(savedCaretPosition.end - 1);
        } else {
          value = val + searchArea[searchArea.length - 1];
        }
        setConformedSuggestion(value);
        setCaretPosition(savedCaretPosition);
        setContentWidth(
          (measureText(value, "16", null).width + 8).toString() + "px"
        );
      }
      var inputArray = searchArea.split(/\W+/g);
      var srhTerm: string;
      setSearchTerm(inputArray[inputArray.length - 1]);
      srhTerm = inputArray[inputArray.length - 1];

      // If user delets characters from input
      if (conformedSuggestion.length > userInp.length) {
        if (
          !suggestions.includes(srhTerm) &&
          !alllowedOperstions.includes(searchTerm)
        ) {
          setConformedSuggestion(userInp.replace(srhTerm, ""));
        } else {
          setConformedSuggestion(userInp);
        }
        setContentWidth(
          measureText(userInp, "16", null).width.toString() + "px"
        );
      }

      //If cursour moved to the left
      if (conformedSuggestion.length > searchArea.length) {
        setContentWidth(
          measureText(searchArea, "16", null).width.toString() + "px"
        );
      }
      // Filter our suggestions that don't contain the user's input
      const currSuggestions = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(srhTerm.toLowerCase()) > -1
      );
      setActiveSuggestion(0);
      setFilteredSuggestions(currSuggestions);
      setShowSuggestions(true);
      setUserInput(inputAreaRef.current.innerText);
    }
  };

  useEffect(() => {
    setEditable(inputAreaRef.current);
    document.getElementById("12357")?.focus();
  }, []);
  useEffect(() => {
    setCaret(inputAreaRef, caretPosition);
    inputAreaRef.current?.focus();
  }, [inputAreaRef.current?.innerText]);

  // Onkeyboard action
  if (inputAreaRef.current != null) {
    inputAreaRef.current.onkeydown = function (e) {
      var value;
      e = e || window.event;

      savedCaretPosition = CaretPositioning.saveSelection(e.currentTarget);

      // User pressed the enter key
      if (e.key === "Escape") {
        if (showSuggestions) {
          setShowSuggestions(false);
        } else if (!showSuggestions) {
          inputAreaRef.current?.blur();
        }
      }
      if (e.key === "Enter" && userInput.length > 0) {
        e.preventDefault();
        var val;
        if (conformedSuggestion.length === 0) {
          val = "";
        } else {
          val = conformedSuggestion;
        }
        if (
          conformedSuggestion.length > savedCaretPosition.end &&
          conformedSuggestion.length > 0
        ) {
          value =
            conformedSuggestion.slice(
              0,
              savedCaretPosition.end - searchTerm.length
            ) +
            filteredSuggestions[activeSuggestion] +
            conformedSuggestion.slice(
              savedCaretPosition.end - searchTerm.length
            );
        } else {
          value = val + filteredSuggestions[activeSuggestion];
        }

        savedCaretPosition.end =
          savedCaretPosition.end +
          (filteredSuggestions[activeSuggestion].length - searchTerm.length);
        if (savedCaretPosition.end > value.length) {
          savedCaretPosition.end = value.length;
        }

        // value = val + filteredSuggestions[activeSuggestion];
        setCaretPosition(savedCaretPosition);
        setConformedSuggestion(value);
        setActiveSuggestion(0);
        setShowSuggestions(false);
        setUserInput(value);
        setContentWidth(
          (measureText(value, "16", null).width + 8).toString() + "px"
        );
        setSearchTerm("");
      }
      // User pressed the up arrow
      else if (e.key === "ArrowUp") {
        if (showSuggestions) {
          e.preventDefault();
        }
        if (activeSuggestion === 0) {
          setShowSuggestions(false);
          return;
        }
        setActiveSuggestion(activeSuggestion - 1);
      }
      // User pressed the down arrow
      else if (e.key === "ArrowDown") {
        if (showSuggestions) {
          e.preventDefault();
        }
        if (activeSuggestion - 1 === filteredSuggestions.length) {
          return;
        }
        setActiveSuggestion(activeSuggestion + 1);
      }
      setCaretPosition(savedCaretPosition);
    };
  }

  const onClickButton = () => {
    console.log("conformedSuggestionButton: " + userInput);
  };

  const onClick = (e: { currentTarget: { innerText: string } }) => {
    var val;

    if (conformedSuggestion.length === 0) {
      val = "";
    } else {
      val = conformedSuggestion;
    }
    var value = val + e.currentTarget.innerText;
    setConformedSuggestion(val + e.currentTarget.innerText);
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(value);
    setContentWidth(
      (measureText(userInput, "16", null).width + 8).toString() + "px"
    );
  };
  const handleClick = () => {
    console.info("You clicked the Chip.");
  };
  const renderUserInput = (input: string) => {
    // setCaret(inputAreaRef, caretPosition);
    return input;
    // if (input.length !== 0) {
    //   renderOutput = input.split(/(\W+)/g).map((value, index) => {
    //     if (
    //       conformedSuggestion.split(/(\W+)/g).includes(value) &&
    //       !alllowedOperstions.includes(value) &&
    //       value !== " "
    //     ) {
    //       // return <Chip key={index} label={value} onClick={handleClick} />;
    //       return (
    //         <Chip
    //           key={index}
    //           label={value}
    //           onClick={handleClick}
    //           variant="outlined"
    //         />
    //       );
    //     } else {
    //       return value;
    //     }
    //   });
    //   renderOutput.push(
    //     <div id="12357" key="1235">
    //       {" "}
    //     </div>
    //   );
    // } else {
    //   return "";
    // }
    // return renderOutput;
  };

  const renderSuggestionsList = () => {
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <List className="suggestions" style={{ marginLeft: contentWidth }}>
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <ListItem
                  className={className}
                  key={suggestion}
                  onClick={onClick}
                >
                  {suggestion}
                </ListItem>
              );
            })}
          </List>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }
    return suggestionsListComponent;
  };

  return (
    <Fragment>
      <div>
        <Grid
          direction={"row"}
          id="inputDiv"
          suppressContentEditableWarning={true}
          placeholder="Please enter formula"
          contentEditable="true"
          onInput={onChangeHandler}
          className="input"
          ref={inputAreaRef}
        >
          {renderUserInput(userInput)}
        </Grid>
      </div>
      {renderSuggestionsList()}
      <button type="button" onClick={onClickButton}>
        Submit
      </button>
      <button id="button" onClick={() => setCaret(inputAreaRef, caretPosition)}>
        focus
      </button>
    </Fragment>
  );
}

export default AutocompleteDiv;
