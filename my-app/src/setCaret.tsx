const setCaret = (
  inputAreaRef: React.RefObject<HTMLDivElement>,
  caretPosition: {
    start: number;
    end: number;
  }
) => {
  var el = inputAreaRef.current;
  // var el = document.getElementById("parentDiv");
  var range = document.createRange();
  var sel = window.getSelection();
  if (el !== null && sel !== null && el.innerText.length > 0) {
    // range.setStart(el.childNodes[0], caretPosition.end);
    range.setStart(el, 4314);
    range.collapse(true);
    console.log("setCaret ", caretPosition.end);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }
  return;
};
export default setCaret;