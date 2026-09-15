document.addEventListener('DOMContentLoaded', fetchWinners);

function toggleEditForm() {
    const form = document.getElementById('editForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function fetchWinners() {
    const display = document.getElementById('winnersDisplay');
    if (!display) {
        return;
    }

    fetch('/Trivia/php/winners.php')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(text => {
            let data = [];
            try {
                data = text ? JSON.parse(text) : [];
            } catch (e) {
                console.error('Error parsing winners data:', e);
                data = [];
            }
            display.innerHTML = '';

            data.forEach(winner => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <img src="${winner.image_path}" alt="${winner.name}" class="winner-img">
                    <p>${winner.name}</p>
                `;
                display.appendChild(div);
            });

            if (data.length >= 3) {
                document.getElementById('name1').value = data[0].name;
                document.getElementById('name2').value = data[1].name;
                document.getElementById('name3').value = data[2].name;
            }
        })
        .catch(err => console.error('Error:', err));
}

function openPopup() {
    document.getElementById('editPopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('editPopup').style.display = 'none';
}

function updateWinners(event) {
    if (event) event.preventDefault();
    const nameFields = [
        document.getElementById('name1'),
        document.getElementById('name2'),
        document.getElementById('name3')
    ];
    const imageFields = [
        document.querySelector('input[name="image1"]'),
        document.querySelector('input[name="image2"]'),
        document.querySelector('input[name="image3"]')
    ];
    const nameRegex = /^[a-zA-ZĀČĒĢĪĶĻŅŌŠŪŽāčēģīķļņōšūž\s'-]{3,30}$/;
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    for (let i = 0; i < 3; i++) {
        const name = nameFields[i].value.trim();
        if (!nameRegex.test(name)) {
            alert(`Uzvarētāja vārds #${i+1} drīkst saturēt tikai burtus (3-30 simboli).`);
            nameFields[i].focus();
            return false;
        }
        const fileInput = imageFields[i];
        if (fileInput && fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name.toLowerCase();
            const ext = fileName.split('.').pop();
            if (!allowedExtensions.includes(ext)) {
                alert(`Uzvarētāja #${i+1} attēlam jābūt JPG, JPEG, PNG vai GIF formātā.`);
                fileInput.value = '';
                fileInput.focus();
                return false;
            }
        }
    }
    const form = document.getElementById('editWinnersForm');
    const formData = new FormData(form);

    fetch('/Trivia/php/winners.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        fetchWinners();
        closePopup();
    })
    .catch(err => console.error('Error:', err));
    return false;
}

function loadWinners() {
    if (!document.getElementById('winnersDisplay')) {
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/Trivia/php/winners.php', true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                var winners = JSON.parse(xhr.responseText);
                var winnersDisplay = document.getElementById('winnersDisplay');
                winnersDisplay.innerHTML = '';

                winners.forEach(function(winner) {
                    var winnerDiv = document.createElement('div');
                    var img = document.createElement('img');
                    img.src = winner.image_path.startsWith('http') ? winner.image_path : '/Trivia/' + winner.image_path;
                    img.alt = winner.name;
                    var p = document.createElement('p');
                    p.textContent = winner.name;
                    
                    winnerDiv.appendChild(img);
                    winnerDiv.appendChild(p);
                    winnersDisplay.appendChild(winnerDiv);
                });
            } catch (e) {
                console.error('Error parsing winners data:', e);
            }
        } else {
            console.error('Error loading winners:', xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error('Network error occurred while loading winners');
    };

    xhr.send();
}

function addWinner() {
    const form = document.getElementById('editWinnersForm');
    const formData = new FormData(form);
    
    formData.append('nameNew', document.getElementById('newName').value);
    formData.append('imageNew', document.querySelector('input[name="imageNew"]').files[0]);
    
    fetch('/Trivia/php/winners.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        fetchWinners();
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function removeWinner(winner_id) {
    const formData = new FormData();
    formData.append('deleteWinnerId', winner_id);

    fetch('/Trivia/php/winners.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        fetchWinners();
    })
    .catch(error => {
        console.error("Error:", error);
    });
} 