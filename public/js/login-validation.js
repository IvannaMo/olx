document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("email-error").innerHTML = "";
    document.getElementById("password-error").innerHTML = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let isValid = true;

    if (!email) {
        document.getElementById("email-error").innerHTML += "Не забудьте ввести електронну пошту";
        isValid = false;
    }
    if (!password) {
        document.getElementById("password-error").innerHTML += "Не забудьте ввести пароль";
        isValid = false;
    }

    if (isValid) {
        const formData = { email, password };

        const response = await fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });
    
        if (response.ok) {
            window.location.href = "/profile-advertisements";
        }
    }
});