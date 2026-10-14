let currentNumber = "0";
let previousNumber = "";
let operator = "";

const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");

function updateScreen() {
    currentEl.textContent = currentNumber;
    historyEl.textContent = previousNumber + " " + displaySymbol(operator);
}

function displaySymbol(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    if (op === "-") return "−";
    return op;
}

function addNumber(num) {
    if (num === "." && currentNumber.includes(".")) return;
    if (currentNumber === "0" && num !== ".") {
        currentNumber = num;
    } 
    else {
        currentNumber = currentNumber + num;
    }
    updateScreen();
}

    function chooseOperator(op) {
      // if a calculation is already waiting, finish it first
      if (operator !== "" && previousNumber !== "") {
        calculate();
      }
      operator = op;
      previousNumber = currentNumber;
      currentNumber = "0";
      updateScreen();
    }

function calculate() {
    if (operator === "" || previousNumber === "") return;

    const a = parseFloat(previousNumber);
    const b = parseFloat(currentNumber);
    let result;

    if (operator === "+") result = a + b;
    if (operator === "-") result = a - b;
    if (operator === "*") result = a * b;
    if (operator === "%") result = a % b;
    if (operator === "/") {
    if (b === 0) {
        clearAll();
        currentEl.textContent = "Can't divide by 0";
        return;
    }
    result = a / b;
    }

    currentNumber = String(Math.round(result * 1000000000) / 1000000000);
    previousNumber = "";
    operator = "";
    updateScreen();
}

function clearAll() {
    currentNumber = "0";
    previousNumber = "";
    operator = "";
    updateScreen();
}

function deleteLast() {
    currentNumber = currentNumber.slice(0, -1);
    if (currentNumber === "" || currentNumber === "-") currentNumber = "0";
    updateScreen();
}

document.querySelectorAll("button").forEach(function (button) {
    button.addEventListener("click", function () {
    if (button.dataset.num !== undefined) addNumber(button.dataset.num);
    if (button.dataset.op !== undefined) chooseOperator(button.dataset.op);
    if (button.dataset.action === "equals") calculate();
    if (button.dataset.action === "clear") clearAll();
    if (button.dataset.action === "delete") deleteLast();
    });
});

document.addEventListener("keydown", function (event) {
    const key = event.key;
    if ((key >= "0" && key <= "9") || key === ".") addNumber(key);
    if (["+", "-", "*", "/", "%"].includes(key)) chooseOperator(key);
    if (key === "Enter" || key === "=") calculate();
    if (key === "Backspace") deleteLast();
    if (key === "Escape") clearAll();
});
  