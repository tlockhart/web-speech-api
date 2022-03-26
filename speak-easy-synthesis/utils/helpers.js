const setVoiceOptions = (voices, voiceSelect, utterThis) => {
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  
  console.log("InSETVOICEOPTIONS, voice:", voices.length);
  for (let i = 0; i < voices.length; i++) {
    console.log("Voice:", voices[i].name);
    if (voices[i].name === selectedOption) {

      utterThis.voice = voices[i];
      break;
    }
  }
  utterThis.pitch = pitch.value;
  utterThis.rate = rate.value;
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
    console.log("SpeechSynthesisUtterance.onend");
  };
  // Error Event is fired when an err occurs that prevents the utterance from being spoken
  utterThis.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror");
  };
  
}; // speak

function onboundaryHandler(event){
  var textarea = document.getElementsByClassName('txt')[0];
  // console.log("TEXTAREA:", textarea);
  var value = textarea.value;
  var index = event.charIndex;
  var word = getWordAt(value, index);
  var anchorPosition = getWordStart(value, index);
  var activePosition = anchorPosition + word.length;
  
  textarea.focus();
  
  if (textarea.setSelectionRange) {
     textarea.setSelectionRange(anchorPosition, activePosition);
  }
  else {
     var range = textarea.createTextRange();
     range.collapse(true);
     range.moveEnd('character', activePosition);
     range.moveStart('character', anchorPosition);
     range.select();
  }
}

// Get the word of a string given the string and index
function getWordAt(str, pos) {
  // Perform type conversions.
  str = String(str);
  pos = Number(pos) >>> 0;

  // Search for the word's beginning and end.
  var left = str.slice(0, pos + 1).search(/\S+$/),
      right = str.slice(pos).search(/\s/);

  // The last word in the string is a special case.
  if (right < 0) {
      return str.slice(left);
  }
  
  // Return the word, using the located bounds to extract it from the string.
  return str.slice(left, right + pos);
}

// Get the position of the beginning of the word
function getWordStart(str, pos) {
  str = String(str);
  pos = Number(pos) >>> 0;

  // Search for the word's beginning
  var start = str.slice(0, pos + 1).search(/\S+$/);
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
    utterThis.onboundary = onboundaryHandler;
    synth.speak(utterThis);
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
    pitchValue.textContent = pitch.value;
  };

  rate.onchange = function () {
    rateValue.textContent = rate.value;
  };

  voiceSelect.onchange = function (event) {

    // NOTE: setInitial voice, must recall, when new voice selected.
    setVoiceOptions(voices, voiceSelect, utterThis);

    speak(synth, utterThis);
  };
};

//populate options and set selected to first option
export const populateVoiceList = async(synth, voices, voiceSelect, utterThis) => {
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
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
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

    
  }// for
  console.log("popVlist selectedIndex:", selectedIndex);

  // voiceSelect is default index 0
  voiceSelect.selectedIndex = selectedIndex;
  console.log("popVList VOICESELECT:", voiceSelect.selectedIndex);

  // NOTE: setInitial voice, must recall, when new voice selected.
  setVoiceOptions(voices, voiceSelect, utterThis);
  return voices;
}; // populate voice list
