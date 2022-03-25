var utterance = new SpeechSynthesisUtterance();
utterance.lang = 'en-UK';
utterance.rate = 1;

document.getElementById('playButton').onclick = function(){
    var text = document.getElementById('textarea').value;
    // create the utterance on play in case user called stop
    // reference https://stackoverflow.com/a/47276578/441016
    
    // utterThis
    utterance = new SpeechSynthesisUtterance();
    utterance.onboundary = onboundaryHandler;
    utterance.text = text;
    speechSynthesis.speak(utterance);
};

document.getElementById('pauseButton').onclick = function(){
    if (speechSynthesis) {
      speechSynthesis.pause();
    }
};

document.getElementById('resumeButton').onclick = function(){
    if (speechSynthesis) {
      speechSynthesis.resume();
    }
};

document.getElementById('stopButton').onclick = function(){
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
};

function onboundaryHandler(event){
    var textarea = document.getElementById('textarea');
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
};

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