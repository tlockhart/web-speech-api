const setVoiceOptions = (voices, voiceSelect, utterThis) => {
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name");
  for (let i = 0; i < voices.length; i++) {
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
    /************* */
    setVoiceOptions(voices, voiceSelect, utterThis);
    utterThis.text = inputTxt.value;

    // Start speaking the utterance
    speak(synth, utterThis);

    // Remove the focus from the text area, focus gives focus to textarea
    // inputTxt.blur();
    /*************/
    // utterThis.onboundary = onboundaryHandler;
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

  voiceSelect.onchange = function () {
    speak(synth, utterThis);
  };
};

export const populateVoiceList = (synth, voices, voiceSelect) => {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(),
      bname = b.name.toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });
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
  }
  voiceSelect.selectedIndex = selectedIndex;
}; // populate voice list
