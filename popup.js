document.addEventListener('DOMContentLoaded', () => {
    const length = localStorage.getItem('length') || 12;
    const includeUppercase = localStorage.getItem('includeUppercase') !== 'false'; // Default to true
    const includeLowercase = localStorage.getItem('includeLowercase') !== 'false'; // Default to true
    const includeNumbers = localStorage.getItem('includeNumbers') !== 'false'; // Default to true
    const includeSpecial = localStorage.getItem('includeSpecial') === 'true'; // Default to false

    document.getElementById('length').value = length;
    document.getElementById('uppercase').checked = includeUppercase;
    document.getElementById('lowercase').checked = includeLowercase;
    document.getElementById('numbers').checked = includeNumbers;
    document.getElementById('special').checked = includeSpecial;
});

document.getElementById('generate').addEventListener('click', () => {
    const length = document.getElementById('length').value;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSpecial = document.getElementById('special').checked;

    if (length < 6 || length > 50) {
        alert("Password length must be between 6 and 50 characters.");
        return;
    }

    localStorage.setItem('length', length);
    localStorage.setItem('includeUppercase', includeUppercase);
    localStorage.setItem('includeLowercase', includeLowercase);
    localStorage.setItem('includeNumbers', includeNumbers);
    localStorage.setItem('includeSpecial', includeSpecial);

    const password = generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial);
    document.getElementById('password').textContent = password;
});

document.getElementById('password').addEventListener('click', () => {
    const password = document.getElementById('password').textContent;
    if (password) {
        navigator.clipboard.writeText(password).then(() => {
            showNotification();
        });
    }
});

function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial) {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "!\"#$%&'()*+,-./:;<=>?@[]^_`{|}~";

    let allChars = "";
    if (includeUppercase) allChars += uppercaseChars;
    if (includeLowercase) allChars += lowercaseChars;
    if (includeNumbers) allChars += numberChars;
    if (includeSpecial) allChars += specialChars;

    if (allChars === "") return "Please select at least one character type";

    let password = "";
    let usedChars = new Set();

    while (password.length < length) {
        const char = allChars.charAt(Math.floor(Math.random() * allChars.length));
        if (password.length === 0 && (numberChars.includes(char) || specialChars.includes(char))) {
            continue;
        }
        if (!usedChars.has(char) && !isSequential(password, char)) {
            password += char;
            usedChars.add(char);
        }
        if (usedChars.size === allChars.length) {
            usedChars.clear();
        }
    }

    // Ensure the password contains at least one character from each selected category
    if (includeUppercase && !/[A-Z]/.test(password)) return generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial);
    if (includeLowercase && !/[a-z]/.test(password)) return generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial);
    if (includeNumbers && !/[0-9]/.test(password)) return generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial);
    if (includeSpecial && !/[!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password)) return generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial);

    return password;
}

function isSequential(password, char) {
    if (password.length === 0) return false;

    const lastChar = password[password.length - 1];
    const secondLastChar = password.length > 1 ? password[password.length - 2] : null;

    if (secondLastChar &&
        ((char.charCodeAt(0) === lastChar.charCodeAt(0) + 1 && lastChar.charCodeAt(0) === secondLastChar.charCodeAt(0) + 1) ||
            (char.charCodeAt(0) === lastChar.charCodeAt(0) - 1 && lastChar.charCodeAt(0) === secondLastChar.charCodeAt(0) - 1))) {
        return true;
    }

    return false;
}

function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}