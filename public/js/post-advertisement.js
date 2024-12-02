document.getElementById("post-ad-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    
    const response = await fetch("/advertisements", {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    if (response.ok) {
        window.location.href = "/profile-advertisements";
    }
});