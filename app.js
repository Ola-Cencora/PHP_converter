const varDumpForm = document.getElementById("varDump-form");
const outputDiv = document.querySelector(".output");
let userInput;

varDumpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userInput = document.getElementById("varDump-input").value;

  //convert function

  outputDiv.innerText = userInput;
});
