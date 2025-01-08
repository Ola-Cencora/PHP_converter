const varDumpForm = document.getElementById("varDump-form");
const outputDiv = document.querySelector(".output");
let userInput;

varDumpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userInput = document.getElementById("varDump-input").value;

  const convertedInput = varDumpConvert(userInput);

  outputDiv.innerText = convertedInput;
});

function varDumpConvert(input) {
  const typeMap = {
    string: (val) => `'${val.match(/"(.*)"/)?.[1] || ""}'`,
    int: (val) => val.match(/\d+/)?.[0],
    float: (val) => val.match(/\d+\.\d+/)?.[0],
    bool: (val) => (val.includes("true") ? "true" : "false"),
    NULL: () => "null",
  };

  const lines = input.trim().split("[");
  let result = "";

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.includes("=>")) {
      const [keyPart, valuePart] = trimmed
        .split("=>")
        .map((part) => part.trim());
      const key = `'${keyPart.match(/["'](.*)["']/)?.[1] || keyPart}'`;
      const type = Object.keys(typeMap).find((t) => valuePart.startsWith(t));
      const value = type ? typeMap[type](valuePart) : "";
      result += `${key} => ${value},\n`;
    }
  });

  return `$array = [\n ${result.trimEnd(",\n")} \n];`;
}
