document.getElementById("edit-ad-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    
    const response = await fetch(`/advertisements/${formData.get("advertisementId")}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
    });

    if (response.ok) {
        window.location.href = "/profile-advertisements";
    }
});