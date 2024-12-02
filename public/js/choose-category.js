document.getElementById("category").addEventListener("change", (e) => {
    const id = e.target.value;
    const sortValue = document.getElementById("sort").value;

    window.location.href = `/category/${id}?sort=${sortValue}`;
});