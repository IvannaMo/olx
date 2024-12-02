const deleteAdButton = document.getElementById("delete-ad-button");


if (deleteAdButton) {
    document.getElementById("delete-ad-button").addEventListener("click", async () => {
        const advertisementId = document.getElementById("advertisement-container").getAttribute("data-advertisement-id"); 

        if (advertisementId) {
            const response = await fetch(`/advertisements/${advertisementId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                window.location.href = "/profile-advertisements";
            } 
        }
    });
}