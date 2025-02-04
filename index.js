const inputSlider = document.querySelector("[data-lengthRange]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("#password");
const copyMessage = document.querySelector("[data-copyMessage]");
const copyBtn = document.querySelector("#copyBtn");
const generateBtn = document.querySelector("#generateBtn");
const indicator = document.querySelector("[data-indicator]");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");

let passwordLength = 10;
let password = "";
let checkCount = 1;

handleSlider();

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateRandomUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateRandomLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function getRandomSymbol() {
    const symbols = "!@#$%^&*(){}[]=<>/,.";
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function strengthCalculator() {
    let hasUpper = document.querySelector("[data-uppercase]").checked;
    let hasLower = document.querySelector("[data-lowercase]").checked;
    let hasNumber = document.querySelector("[data-numbers]").checked;
    let hasSymbol = document.querySelector("[data-symbol]").checked;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength > 8) {
        setIndicator("limegreen");
    } else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength > 6) {
        setIndicator("orange");
    } else {
        setIndicator("red");
    }
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join(""
    );
}

function generatePassword() {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArray = [];
    if (document.querySelector("[data-uppercase]").checked) funcArray.push(generateRandomUppercase);
    if (document.querySelector("[data-lowercase]").checked) funcArray.push(generateRandomLowercase);
    if (document.querySelector("[data-numbers]").checked) funcArray.push(generateRandomNumber);
    if (document.querySelector("[data-symbol]").checked) funcArray.push(getRandomSymbol);

    for (let i = 0; i < funcArray.length; i++) {
        password += funcArray[i]();
    }

    for (let i = 0; i < passwordLength - funcArray.length; i++) {
        const index = getRandomInteger(0, funcArray.length);
        password += funcArray[index]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    strengthCalculator();
}

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "Copied!";
    } catch (e) {
        copyMessage.innerText = "Failed!";
    }
    copyMessage.classList.add("active");
    setTimeout(() => {
        copyMessage.classList.remove("active");
    }, 1000);
}

function handleCheckbox() {
    checkCount = Array.from(allCheckboxes).filter(checkbox => checkbox.checked).length;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckboxes.forEach(checkbox => checkbox.addEventListener('change', handleCheckbox));
inputSlider.addEventListener('input', e => {
    passwordLength = e.target.value;
    handleSlider();
});
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyToClipboard();
});
generateBtn.addEventListener('click', generatePassword);
