document.getElementById("sort").addEventListener("change", () => {
    const categoryId = document.getElementById("categoryId").value;
    const sortValue = document.getElementById("sort").value;

    window.location.href = `/category/${categoryId}?sort=${sortValue}`;
});