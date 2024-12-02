let isPasswordCorrect = false;

function passwordValidation(id, condition) {
    const element = document.getElementById(id);
    if (condition) {
        element.classList.remove("text-gray-800");
        element.classList.add("text-[#ff5636]");
        return false;
    } 
    else {
        element.classList.remove("text-[#ff5636]");
        element.classList.add("text-gray-800");
        return true;
    }
}

document.getElementById("password").addEventListener("input", () => {
    const password = document.getElementById("password").value;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);

    const isLengthValid = passwordValidation("password-char-count", password.length < 9);
    const isUpperCaseValid = passwordValidation("password-upper-сhar", !hasUpperCase);
    const isLowerCaseValid = passwordValidation("password-lower-сhar", !hasLowerCase);
    const isDigitValid = passwordValidation("password-digit", !hasDigit);

    isPasswordCorrect = isLengthValid && isUpperCaseValid && isLowerCaseValid && isDigitValid;
});


document.getElementById("reset-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("password-error").innerHTML = "";
    const password = document.getElementById("password").value.trim();

    let isValid = true;

    if (!password) {
        document.getElementById("password-error").innerHTML += "Не забудьте ввести пароль";
        isValid = false;
    }

    if (isValid && isPasswordCorrect) {
        const response = await fetch("/users/reset-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
            credentials: "include",
        });
    
        if (response.ok) {
            window.location.href = "/reset-password-success";
        }
    }
});