const result = document.querySelector("#result");
const wordDisplayed = document.querySelector("#word");
const errorDisplayed = document.querySelector("#error");
const errorParagraph = document.querySelector("#error-paragraph");
const phoneticsTextDisplayed = document.querySelector("#phoneticsText");
const definitionsList = document.querySelector("#definitions");
const originDisplayed = document.querySelector("#origin");
const inputField = document.querySelector("#word-input-field");
const searchButton = document.querySelector("#search-button");
const phoneticsLink = document.querySelector("#phoneticsLink");
const definitionsHeader = document.querySelector("#definitions-header");
const originHeader = document.querySelector("#origin-header");
const phoneticsHeader = document.querySelector("#phonetics-header");
const historyButton = document.querySelector("#history-button");
const historyList = document.querySelector("#history-list")
const wordsHistory = [];

async function getData(word) {
  await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`)
    .then(async function (response) {
      let data = await response.json();
      let dataObject = data[0];
      let wordObject = {
        word: dataObject.word,
        phoneticsText: dataObject.phonetics[0].text,
        phoneticsAudio: dataObject.phonetics[0].audio,
        meanings: dataObject.meanings,
        origin: dataObject.origin,
      };
      wordsHistory.push(wordObject.word)
      displayResult(wordObject);
    })
    .catch(function (err) {
      displayError();
    });
}

function displayResult(obj) {
  cleanResultDiv();
  wordDisplayed.innerText = obj.word[0].toUpperCase() + obj.word.slice(1);
  phoneticsHeader.innerText = "Phonetics:"
  phoneticsTextDisplayed.innerText = obj.phoneticsText;
  phoneticsLink.innerText = "Listen to pronounciation";
  phoneticsLink.setAttribute("href", `https://${obj.phoneticsAudio}`);
  definitionsHeader.innerText = "Definitions:";
  appendDefinitionToList(obj.meanings);
  originHeader.innerText = "Origin:";
  originDisplayed.innerText = obj.origin;
}

function displayError() {
  cleanResultDiv();
  errorDisplayed.innerText = "Error 404 - Not Found";
  errorParagraph.innerText =
    "We could not find the word you are searching for, please check your spelling and try again";
}

function appendDefinitionToList(array) {
  definitionsList.innerText = "";
  for (let i = 0; i < array.length; i++) {
    let newLi = document.createElement("li");
    newLi.innerText = array[i].definitions[0].definition;
    definitionsList.appendChild(newLi);
  }
}

function searchWord() {
  let wordToSearch = inputField.value;
  getData(wordToSearch);
  inputField.value = "";
}

function showHistory() {
  cleanResultDiv();
  historyList.innerText = "This is your search history:"
  for (let i = 0; i < wordsHistory.length; i++) {
    let newLi = document.createElement("li");
    newLi.innerText = wordsHistory[i];
    historyList.appendChild(newLi);
  }
}

function cleanResultDiv() {
  let resultNodeList = result.childNodes;
  for (let i = 0; i < resultNodeList.length; i++) {
    resultNodeList[i].innerText = "";
  }
}

searchButton.addEventListener("click", searchWord);
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchWord();
  }
});
historyButton.addEventListener("click", showHistory);
