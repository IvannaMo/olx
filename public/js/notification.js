const notificationContainer = document.getElementById("notification-container");
    

function openNotificationContainer(e) {
    const isAuthenticated = e.currentTarget.getAttribute("data-is-authenticated");

    if (isAuthenticated === "false") {
        window.location.href = "/login";
    } 
    else {
        if (window.getComputedStyle(notificationContainer).display === "none") {
            notificationContainer.style.display = "flex";
        }
    }
}

document.getElementById("seller-notification-button").addEventListener("click", (e) => {
    openNotificationContainer(e);
});

document.getElementById("advertisement-notification-button").addEventListener("click", (e) => {
    openNotificationContainer(e);
});


document.getElementById("close-notification-container-button").addEventListener("click", () => {
    if (window.getComputedStyle(notificationContainer).display === "flex") {
        notificationContainer.style.display = "none";
    }
});


document.getElementById("send-notification-input").addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const message = e.target.value.trim();
        const receiverId = notificationContainer.getAttribute("data-receiver-id"); 

        if (message && receiverId) {
            const response = await fetch("/notification/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: receiverId,
                    message: message
                }),
                credentials: "include",
            });

            if (response.ok) {
                const notifications = document.getElementById("notifications");

                const notification = document.createElement("p");
                notification.className = "bg-white py-2 px-3 max-w-[75%] rounded-md break-words";
                notification.textContent = message;

                notifications.appendChild(notification);

                e.target.value = "";
            } 
        }
    }
});