import {
  activateListeners,
  inputText,
  setSpeech,
  populateVoiceList,
} from "./utils/helpers.js";

// inputs:
var inputForm = document.querySelector("form");
let inputTxt = document.querySelector("#txt");
// const inputText
// inputTxt.textContent = inputText;

var voiceSelect = document.querySelector("select");

// Voice List
var voices = [];

// Step1: Create Utterance:
var utterThis = new SpeechSynthesisUtterance();
let synth;

const retrieveSynth = async () => {
  // Step 2: Create SpeechSynthesis
  synth = await setSpeech();
  console.log("Voices", synth);
  // helper

  // Step3: Return the list of voices from populateVoiceOptions
  voices = await populateVoiceList(synth, voices, voiceSelect, utterThis);

  console.log("retSynth: voices:", voices.length);


  // Step4: Activate Listeners
  activateListeners(synth, voices, voiceSelect, utterThis, inputTxt);
};

retrieveSynth();
// synth.then((voices) => console.log(voices))
