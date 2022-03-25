export const setVoiceOptions = (voices, voiceSelect, utterThis) =>{
    var selectedOption =
        voiceSelect.selectedOptions[0].getAttribute("data-name");
      for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
          utterThis.voice = voices[i];
          break;
        }
      }
      utterThis.pitch = pitch.value;
      utterThis.rate = rate.value;
  } // setVoiceOptions

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