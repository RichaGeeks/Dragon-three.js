function toggleText() {
    var moreText = document.getElementById("more-text");
    var button = document.querySelector(".learn-more");
    if (moreText.style.display === "none") {
        moreText.style.display = "block";
        button.textContent = "Show Less";
    } else {
        moreText.style.display = "none";
        button.textContent = "Learn More";
    }
}