const filterButton = document.getElementById("filter-button") 
const filterPanel = document.getElementById("filter-panel")

filterButton.addEventListener("click", () => {
    const displayValueComputed = window.getComputedStyle(filterPanel).getPropertyValue('display');

    if(displayValueComputed === 'none') {
        filterPanel.style.display = 'block'
    } else
    if(displayValueComputed === 'block') {
        filterPanel.style.display = 'none'
    } else {}
})