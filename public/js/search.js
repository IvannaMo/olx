function search() {
    const categoryId = document.getElementById("categoryId").value;
    const searchQuery = document.getElementById("search").value;
    const sortValue = document.getElementById("sort").value;

    window.location.href = `/category/${categoryId}?search=${searchQuery}&sort=${sortValue}`;
}

document.getElementById("search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        search();
    }
});

document.getElementById("search-button").addEventListener("click", search);