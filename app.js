// CHOOSING THE RIGHT TOOL

const vardumpButton = document.querySelector("#vardump-btn");
const jsonButton = document.querySelector("#json-btn");
const formName = document.querySelector("#label-convertInput");
const userInput = document.querySelector("#convert-input");
let clickedButton = vardumpButton;

const clean = () => {
  userInput.value = "";
  outputDiv.innerText = "";
};

vardumpButton.addEventListener("click", () => {
  clickedButton = vardumpButton;
  formName.innerText = "Wprowadź wynik funkcji var_dump:";
  clean();
});
jsonButton.addEventListener("click", () => {
  clickedButton = jsonButton;
  formName.innerText = "Wprowadź JSON:";
  clean();
});

// ADDING CORRECT OUTPUT

const convertForm = document.querySelector("#convert-form");
const outputDiv = document.querySelector(".output");

convertForm.addEventListener("submit", (e) => {
  e.preventDefault();
  outputDiv.innerText = "";

  const inputValue = userInput.value;
  let convertedOutput;

  switch (clickedButton) {
    case vardumpButton:
      convertedOutput = varDumpConvert(inputValue);
      break;
    case jsonButton:
      convertedOutput = jsonConvert(inputValue);
      break;
  }

  outputDiv.innerText = convertedOutput;
});

// VAR_DUMP CONVERT FUNCTION

const typeMap = {
  string: (val) => `'${val.match(/"(.*)"/)?.[1] || ""}'`,
  int: (val) => val.match(/\d+/)?.[0],
  float: (val) => val.match(/\d+\.\d+/)?.[0],
  bool: (val) => (val.includes("true") ? "true" : "false"),
  NULL: () => "null",
};

const getIndent = (level) => "  ".repeat(level);

function getResult(valuePart, key, nested) {
  const type = Object.keys(typeMap).find((t) => valuePart.startsWith(t));
  const value = type ? typeMap[type](valuePart) : "";
  return `${getIndent(nested)}${key} => ${value},\n`;
}

function varDumpConvert(input) {
  let result = "";
  let nested = 0;

  const lines = input.trim().split("[");

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.includes("=>")) {
      const [keyPart, valuePart] = trimmed
        .split("=>")
        .map((part) => part.trim());
      const key = `'${keyPart.match(/["'](.*)["']/)?.[1]}'`;

      if (key.replace(/['"]/g, "") === "Array") {
        result += `${getIndent(nested + 1)}${key} => [\n`;
        nested++;
      } else if (trimmed.slice(-1) === "}") {
        result += getResult(valuePart, key, nested + 1);
        result += `${getIndent(nested)}],\n`;
        nested--;
      } else {
        result += getResult(valuePart, key, nested + 1);
      }
    }
  });

  if (nested >= 0) result += "]";

  return `$array = [\n${result.trimEnd().replace(/,$/, "")};`;
}

// JSON CONVERT FUNCTION

function jsonConvert(input) {
  //...
}
