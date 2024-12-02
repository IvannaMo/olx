document.getElementById("logout-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const response = await fetch("/users/logout", {
        method: "POST",
        credentials: "include",
    });
    
    if (response.ok) {
        window.location.href = "/";
    }
});
