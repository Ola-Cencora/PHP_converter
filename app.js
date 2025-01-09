const varDumpForm = document.getElementById("varDump-form");
const outputDiv = document.querySelector(".output");
let userInput;

varDumpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  outputDiv.innerText = "";

  userInput = document.getElementById("varDump-input").value;

  const convertedInput = varDumpConvert(userInput);

  outputDiv.innerText = convertedInput;
});

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
