import {setVoiceOptions, inputText} from "./utils/helpers.js";

var synth = window.speechSynthesis;
// buttons:
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const resumeBtn = document.getElementById("resume");
const stopBtn = document.getElementById("stop");

// inputs:
var inputForm = document.querySelector("form");
var inputTxt = document.querySelector(".txt");
inputTxt.value = inputText;

var voiceSelect = document.querySelector("select");

var pitch = document.querySelector("#pitch");
var pitchValue = document.querySelector(".pitch-value");
var rate = document.querySelector("#rate");
var rateValue = document.querySelector(".rate-value");

// Voice List
var voices = [];

// Create Utterance:
var utterThis = new SpeechSynthesisUtterance();

// helper
const populateVoiceList = () => {
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
} // populate voice list

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
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
} // speak

playBtn.onclick = (event) => {
  event.preventDefault();
  /************* */
  setVoiceOptions(voices, voiceSelect, utterThis);
  utterThis.text = inputTxt.value;

  // Start speaking the utterance
  speak();

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
}

resumeBtn.onclick = (event) => {
  event.preventDefault();
  if (speechSynthesis) {
    speak();
    speechSynthesis.resume();
  }
}

stopBtn.onclick = (event) => {
  event.preventDefault();
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
}

pitch.onchange = function () {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
  rateValue.textContent = rate.value;
};

voiceSelect.onchange = function () {
  speak();
};
