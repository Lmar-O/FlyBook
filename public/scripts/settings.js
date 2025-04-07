var backButton = document.getElementById("setting-back-button");
var darkModeButton = document.getElementById("dark-mode-button");

backButton.addEventListener("click", () => {
    window.history.back();
})

darkModeButton.addEventListener("click", () => {
    var rootEl = document.documentElement

    console.log("1")
    if(rootEl.classList.contains("dark-mode")) {
        console.log("2")
        rootEl.classList.remove("dark-mode")
        rootEl.classList.add("light-mode")
    } else 
    if(rootEl.classList.contains("light-mode")) {
        console.log("3")
        rootEl.classList.remove("light-mode")
        rootEl.classList.add("dark-mode")
    } else {
        console.log("4")
        rootEl.classList.add("dark-mode")
    }
})