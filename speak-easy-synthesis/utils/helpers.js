const DEFAULT_VOICE = 19;

const setVoiceOptions = (voices, voiceSelect, utterThis) => {
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name");

  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
      break;
    }
  } // for
  utterThis.rate = rate.value;
  utterThis.pitch = pitch.value;
}; // setVoiceOptions

//   export

export const inputText = `11.1 The Competitive Labor Market

The market for labor is of particular importance in the economy because it affects all of us. You
are directly influenced by the labor market when you are looking for a job or are employed and
earning money. In this chapter, instead of firms acting as suppliers, as we have viewed them so
far, firms are the buyers (demanders) of labor. And individuals, like you, are the suppliers of
labor.

The market for labor, then, is composed of suppliers (workers) and demanders (firms). Workers
produce goods and services and therefore are known as factors of production—a term we’ve met
before in Chapter 6. Remember that a factor of production is used in the production of other
goods.

Markets for factors of production are somewhat different from markets for goods and services
that we consume because the demand for factors of production is derived from the demand for
final goods and services. A firm first makes the decision to produce a good or service and then
decides which factors are necessary to produce that good or service. `;

export const setSpeech = () => {
  return new Promise(function (resolve, reject) {
    let synth = window.speechSynthesis;
    let id;

    id = setInterval(() => {
      if (synth) {
        resolve(synth);
        clearInterval(id);
      }
    }, 20);
  });
};

const speak = (synth, utterThis) => {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  ///IMPORTANT
  // selectedOptions(voices, voiceSelect, utterThis);

  // Start Speaking
  synth.speak(utterThis);

  // End is fired when utterance is finished being spoken
  utterThis.onend = function (event) {
    console.log("SpeechSynthesisUtterance.onend", event);
  };
  // Error Event is fired when an err occurs that prevents the utterance from being spoken
  utterThis.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror");
  };
}; // speak

function onboundaryHandler(event, type) {
  console.log("TYPE:", type);
  if (type === "word") {
    // Get Text element
    var textarea = document.getElementById("txt");
    console.log("TEXTAREA:", textarea);
    // Get the entire text
    // const text = textarea.textContent;
    var value = textarea.value;
    // console.log("TEXT:", text);
    // Get index of the first char that triggered the
    // utterance event
    var index = event.charIndex;
    console.log("INDEX:", index);
    // Get the entire word
    var word = getWordAt(value, index);
    var anchorPosition = getWordStart(value, index);
    var activePosition = anchorPosition + word.length;

    console.log(
      "activeposition:",
      activePosition,
      ";anchorPosition:",
      anchorPosition
    );
    textarea.focus();
    // if there is no current selected range
    if (textarea.setSelectionRange) {
      textarea.setSelectionRange(anchorPosition, activePosition);
    } else {
      // OLD CONTENT
      var range = textarea.createTextRange();
      range.collapse(true);
      range.moveEnd("character", activePosition);
      range.moveStart("character", anchorPosition);
      range.select();
    }
  } //if
} //onBoundary

// Get the word of a string given the string and index
function getWordAt(str, pos) {
  let isSameSentence = true;
  // Perform type conversions.
  // str = String(str);
  pos = Number(pos) >>> 0;
  // console.log("GEtWOrdAt STR:", str, "; pos:", pos);

  /***********************************************
   * match on a non-whitespace letter
   * Search for the word's beginning index. loop
   * through the starting index of each word
   * and return the index of all non-whitespace char
   ***********************************************/
  console.log("Accumulator:", str.slice(0, pos + 1));
  var sentence = str.slice();
  var left = str.slice(0, pos + 1).search(/\S+$/);
  console.log("LEFT-INDEX:", left);
  /***********************************************
   * match on a whitespace letter
   * Search for the word's ending index. loop
   * through the index of each word
   * and return the index of whitespace char
   * as end index
   ***********************************************/
  var right = str.slice(pos).search(/\s/);

  console.log("RIGHT-INDEX:", right);
  // The last word in the string is a special case.
  if (right < 0) {
    return str.slice(left);
  }

  /**********************************************
   * Return the word, using the located bounds to
   * extract it from the string.
   **********************************************/
  let word = str.slice(left, right + pos);
  console.log("WORD:", word);
  return word;
}

// Get the position of the beginning of the word
function getWordStart(str, pos) {
  str = String(str);
  console.log("Pos1:", pos);
  pos = Number(pos) >>> 0;
  console.log("Pos2:", pos);

  /***********************************************
   * From the whole text str, slice the first
   * letter and increment by one, search loops
   * thru text, until a non-whitespace character
   * is found, and returns the char index of the
   * start of the word,
   ************************************************/
  var start = str.slice(0, pos + 1).search(/\S+$/);
  console.log("Start:", start);
  return start;
}

export const activateListeners = (
  synth,
  voices,
  voiceSelect,
  utterThis,
  inputTxt
) => {
  // sliders:
  var pitch = document.querySelector("#pitch");
  var pitchValue = document.querySelector(".pitch-value");
  var rate = document.querySelector("#rate");
  var rateValue = document.querySelector(".rate-value");

  // buttons:
  const playBtn = document.getElementById("play");
  const pauseBtn = document.getElementById("pause");
  const resumeBtn = document.getElementById("resume");
  const stopBtn = document.getElementById("stop");

  // Checkboxes:
  var checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=settings]"
  );
  let enabledSettings = [];

  /*
For IE11 support, replace arrow functions with normal functions and
use a polyfill for Array.forEach:
https://vanillajstoolkit.com/polyfills/arrayforeach/
*/

  // Use Array.forEach to add an event listener to each checkbox.
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      enabledSettings = Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
        .filter((i) => i.checked) // Use Array.filter to remove unchecked checkboxes.
        .map((i) => i.value); // Use Array.map to extract only the checkbox values from the array of objects.

      console.log(enabledSettings);
    });
  });

  playBtn.onclick = (event) => {
    event.preventDefault();
    setVoiceOptions(voices, voiceSelect, utterThis);
    utterThis.text = inputTxt.value;
    /**************/
    //old part
    // // Start speaking the utterance
    // speak(synth, utterThis);

    // // Remove the focus from the text area, focus gives focus to textarea
    // // inputTxt.blur();
    /*************/
    // new part
    // onboundary event fired when the spoken utterance reaches a word or sentence boundary

    console.log("Settings inclue word:", enabledSettings.includes("word"));
    console.log(
      "Settings inclue sentence:",
      enabledSettings.includes("sentence")
    );
    console.log("Settings inclue line:", enabledSettings.includes("line"));
    switch (true) {
      case enabledSettings.includes("sentence"):
        console.log("In sentence case");
        // ired when the spoken utterance reaches
        // a word or sentence boundary
        utterThis.onboundary = (event) => onboundaryHandler(event, "sentence");
        synth.speak(utterThis);
        break;
      case enabledSettings.includes("line"):
        utterThis.onboundary = (event) => onboundaryHandler(event, "line");
        // synth.speak(utterThis);
        break;
      case enabledSettings.includes("word"):
        utterThis.onboundary = (event) => onboundaryHandler(event, "word");
        synth.speak(utterThis);
        break;
      default:
    }
  };

  pauseBtn.onclick = (event) => {
    event.preventDefault();
    if (speechSynthesis) {
      speechSynthesis.pause();
    }
  };

  resumeBtn.onclick = (event) => {
    event.preventDefault();
    if (speechSynthesis) {
      speak(synth, utterThis);
      speechSynthesis.resume();
    }
  };

  stopBtn.onclick = (event) => {
    event.preventDefault();
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  };

  pitch.onchange = function () {
    utterThis.pitch = pitch.value;
    pitchValue.textContent = pitch.value;
  };

  rate.onchange = function () {
    // rateValue = document.querySelector(".rate-value");
    console.log("RateValue:", rate.value);
    utterThis.rate = rate.value;
    rateValue.textContent = rate.value;
  };

  voiceSelect.onchange = function (event) {
    // NOTE: setInitial voice, must recall, when new voice selected.
    setVoiceOptions(voices, voiceSelect, utterThis);

    speak(synth, utterThis);
  };
};

//populate options and set selected to first option
export const populateVoiceList = async (
  synth,
  voices,
  voiceSelect,
  utterThis
) => {
  voices = await synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(),
      bname = b.name.toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });
  console.log("popVList voice:", voices.length);
  // console.log("popVList selectedIndex:", voiceSelect.selectedIndex);
  var selectedIndex =
    voiceSelect.selectedIndex < 0 ? DEFAULT_VOICE : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = "";
  for (let i = 0; i < voices.length; i++) {
    var option = document.createElement("option");
    option.textContent = voices[i].name + " (" + voices[i].lang + ")";

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  } // for
  console.log("popVlist selectedIndex:", selectedIndex);

  // voiceSelect is default index 0
  voiceSelect.selectedIndex = selectedIndex;
  console.log("popVList VOICESELECT:", voiceSelect.selectedIndex);

  // NOTE: setInitial voice, must recall, when new voice selected.
  setVoiceOptions(voices, voiceSelect, utterThis);
  return voices;
}; // populate voice list
