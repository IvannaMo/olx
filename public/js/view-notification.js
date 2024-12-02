const defaultNotificationContainer = document.getElementById("default-notification-container");
const notificationContainer = document.getElementById("notification-container");
const notification = document.getElementById("notification");


function displayNotification(data) {
    if (defaultNotificationContainer) {
        defaultNotificationContainer.style.display = "none";
        notificationContainer.style.display = "flex";
    }
    notification.innerHTML = "";

    formattedDate = data.sendDate.replace(/\s\d{4}\s*р?\./, "");

    notification.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="h-px w-full bg-[#dedede]"></div>
            <p class="font-bold text-nowrap">${formattedDate}</p>
            <div class="h-px w-full bg-[#dedede]"></div>
        </div>
        <div class="flex justify-start">
            <div class="flex flex-col max-w-[75%]">
                <p class="text-sm text-[#7F9799]">${data.senderName}</p>
                <p class="bg-[#F2F4F5] py-2 px-3 mt-1 w-full rounded-md break-words">${data.message}</p>
            </div>
        </div>
    `;
}

document.querySelectorAll("li[data-notification-id]").forEach((notification) => {
    notification.addEventListener("click", async () => {
        const notificationId = notification.getAttribute("data-notification-id");

        const response = await fetch(`/notifications/${notificationId}`, {
            method: "GET",
            credentials: "include",
        });
        
        if (response.ok) {
            const data = {
                notificationId: notificationId,
                senderName: notification.querySelector(".notification-sender").textContent.trim(),
                message: notification.querySelector(".notification-message").textContent.trim(),
                sendDate: notification.querySelector(".notification-date").textContent.trim(),
            };
    
            displayNotification(data);
        }
    });
});