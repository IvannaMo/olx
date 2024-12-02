document.getElementById("delete-account-button").addEventListener("click", async (e) => {
    const response = await fetch("/users/profile", {
        method: "DELETE",
        credentials: "include",
    });

    if (response.ok) {
        window.location.href = "/";
    }
});