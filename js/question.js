const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('category_id');
const points = urlParams.get('points');



function fetchQuestion() {
    if (!categoryId || !points) {
        const container = document.getElementById('question-container');
        container.innerHTML = '<p>Invalid URL parameters. Please go back and try again.</p>';
        return;
    }

    fetch(`/Trivia/php/point_q.php?category_id=${categoryId}&points=${points}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('question-container');
            if (data.length > 0) {
                const question = data[0];
                const imagePath = question.ImagePath ? question.ImagePath : '';
                console.log('Question ImagePath (from question.js):', imagePath);
                let imageHtml = imagePath ? `<img src="${imagePath}" alt="Question Image" class="question-image" />` : '';
                container.innerHTML = `
                    <h1 class="Jaut_kategorija">${question.kategorija}<div></div>${question.Grutiba}</h1>
                    ${imageHtml}
                    <h2>${question.Jautajums}</h2>
                `;
            } else {
                container.innerHTML = '<p>No question found for this category and points.</p>';
            }
        })
        .catch(error => {
            const container = document.getElementById('question-container');
            container.innerHTML = '<p>There was an error fetching the question. Please try again later.</p>';
        });
}

function back() {
    window.location.href = "start.html";
}

window.onload = fetchQuestion;

document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById("fona_muzika");
    if (audio) {
        audio.play().catch(function(error) {
        });
        setTimeout(function() {
            audio.muted = false;
            audio.volume = 0.1;
        }, 100);
    }
});
