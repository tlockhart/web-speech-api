const textarea = document.getElementById("textarea");
const highlights = document.getElementById("highlights");

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function applyHighlights(text, startIdx, endIdx) {
  let old_text = text;
  let sentence= old_text.slice(startIdx, endIdx + 1);

  console.log("OldText:", old_text);
  console.log(
    "SENTENCE:",
    sentence,
    "; startIdx:",
    startIdx,
    "; endIdx:",
    endIdx,
    "length:",
    text.length - 1
  );
 
const escapedRegex = escapeRegex(sentence);
console.log(`escapedRegex: ${escapedRegex}`)
  const regex = new RegExp(escapedRegex);
  console.log("REGEX:", regex);
  let match = text.replace(regex, "<mark>$&</mark>");
  console.log("MATCH:", match);
  return match;
}

function unApplyHighlights(text) {
  // let old_text = text;
  console.log("UNAPPLYHIGHLIGHTS");
  let sentence = "[<mark>]+[\s\S]+[<\/mark>]";

  // console.log("OldText:", old_text);
  console.log(
    "SENTENCE:",
    sentence,
     "length:",
    text.length - 1
  );
 
const escapedRegex = escapeRegex(sentence);
console.log(`escapedRegex: ${escapedRegex}`)
  const regex = new RegExp(escapedRegex);
  console.log("REGEX:", regex);
  let match = text.replace(regex, "$&");
  console.log("MATCH:", match);
  return match;
}

export const  removeSentenceHighlights = () => {
  let text = textarea.value;
  let unHighlightedText =  unApplyHighlights(text);
  console.log("unHLighted:", unHighlightedText);
  highlights.innerHTML = unHighlightedText;
}

export const highlightSentence = (startIdx, endIdx) => {
  console.log(startIdx, endIdx);
  let text = textarea.value;
  console.log("TEXT:", text);
  let highlightedText = applyHighlights(text, startIdx, endIdx);
  console.log("HLighted:", highlightedText);
  highlights.innerHTML = highlightedText;
};

export const clearSelection = (textarea) => {
  let range = new Range();
  range.selectNodeContents(textarea); // or selectNode(p) to select the <p> tag too
  document.getSelection().removeAllRanges(); // clear existing selection if any
}