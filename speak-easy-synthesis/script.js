import {
  activateListeners,
  inputText,
  setSpeech,
  populateVoiceList,
} from "./utils/helpers.js";

// inputs:
var inputForm = document.querySelector("form");
var inputTxt = document.querySelector(".txt");
inputTxt.value = inputText;

var voiceSelect = document.querySelector("select");

// Voice List
var voices = [];

// Create Utterance:
var utterThis = new SpeechSynthesisUtterance();
let synth;
const retrieveSynth = async () => {
  synth = await setSpeech();
  console.log("Voices", synth);
  // helper

  // populate voiceOptions
  populateVoiceList(synth, voices, voiceSelect);

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  // Start Listeners
  activateListeners(synth, voices, voiceSelect, utterThis, inputTxt);
};

retrieveSynth();
// synth.then((voices) => console.log(voices))
