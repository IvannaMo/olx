document.getElementById("forgot-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    
    const response = await fetch("/users/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
        credentials: "include",
    });

    if (response.ok) {
        window.location.href = "/forgot-password-success";
    }
});