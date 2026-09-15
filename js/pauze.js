document.addEventListener("DOMContentLoaded", function() {
    let mediaFiles = [];
    let currentIndex = 0;
    const container = document.getElementById("slideshow-container");
    if (!container) {
        return;
    }
    fetch("/Trivia/php/media.php")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            mediaFiles = shuffleArray(data);
            changeMedia();
        })
        .catch(error => console.error("Error fetching media list:", error));

    function changeMedia() {
        if (mediaFiles.length === 0) return;
        container.innerHTML = "";
        const media = mediaFiles[currentIndex];
        let element;
        if (media.type === "image") {
            element = document.createElement("img");
            element.src = media.src;
            element.className = "pauze_img";
            element.onload = () => setTimeout(changeMedia, 4000);
        } else if (media.type === "video") {
            element = document.createElement("video");
            element.src = media.src;
            element.className = "pauze_img";
            element.autoplay = true;
            element.controls = false;
            element.muted = false;
            element.loop = false;
            element.onended = () => setTimeout(changeMedia, 1000);
        }
        container.appendChild(element);
        currentIndex = (currentIndex + 1) % mediaFiles.length;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});

function back_toq() {
    window.location.href = "start.html";
}