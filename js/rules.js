
function rules() {
    document.getElementById("rulesModal").style.display = "flex";
}

function closeRules() {
    document.getElementById("rulesModal").style.display = "none";
}

window.onclick = function(event) {
    var modal = document.getElementById("rulesModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}; 