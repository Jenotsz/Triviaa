function loadCategoryQuestions(categoryId) {
    fetch(`/Trivia/php/get_questions.php?category_id=${categoryId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.sort((a, b) => a.Grutiba - b.Grutiba);

        let tableHTML = '<table border="1" style="width:100%"><tr><th>Jautājums</th><th>Punkti</th><th>Pareizā atbilde</th><th>Dzēst</th></tr>';

        if (data && data.length > 0) {
            data.forEach(question => {
                tableHTML += `<tr>
                    <td>${question.Jautajums}</td>
                    <td>${question.Grutiba}</td>
                    <td>${question.PAtbilde}</td>
                    <td><button class="del_button" onclick="deleteQuestion(${question.jautajums_id}, ${categoryId})">Dzēst</button></td>
                </tr>`;
            });
            tableHTML += '</table>';
            openModal('Jautājumi', tableHTML);
        } else {
            openModal('Nav Jautājumu', 'Šai kategorijai nav pievienotu jautājumu.');
        }
    })
    .catch(error => {
        console.error('Error loading questions:', error);
        openModal('Error', 'Kļūda ielādējot jautājumus.');
    });
}

function deleteQuestion(questionId, categoryId) {
    showCustomConfirm('Vai tiešām vēlaties dzēst šo jautājumu?', () => {
        fetch('/Trivia/php/delete_question.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question_id: questionId })
        })
        .then(response => response.text())
        .then(result => {
            if (result.trim() === 'success') {
                showCustomAlert('Jautājums veiksmīgi dzēsts!');
                loadCategoryQuestions(categoryId);
            } else {
                showCustomAlert('Kļūda dzēšot jautājumu.');
            }
        })
        .catch(error => {
            console.error('Error deleting question:', error);
            showCustomAlert('Kļūda dzēšot jautājumu.');
        });
    });
}

function submitQuestion(event) {
    event.preventDefault();

    const form = document.getElementById('questionForm');
    const kategorijaSelect = document.getElementById('kategorija');
    const questionInput = document.getElementById('question');
    const difficultySelect = document.getElementById('difficulty');
    const correctAnswerInput = document.getElementById('correctAnswer');

    let isValid = true;

    if (kategorijaSelect.value === "") {
        showCustomAlert('Lūdzu, atlasiet kategoriju.');
        isValid = false;
    }

    const questionText = questionInput.value.trim();
    if (!questionText) {
        showCustomAlert('Jautājums nevar būt tukšs.');
        isValid = false;
    } else if (questionText.length < 6) {
        showCustomAlert('Jautājumam jābūt vismaz 6 rakstzīmēm.');
        isValid = false;
    } else if (!/^[a-zA-Z0-9 .,!?'"\-\nĀČĒĢĪĶĻŅŌŠŪŽāčēģīķļņōšūž()„":]*$/.test(questionText)) {
        showCustomAlert('Jautājums satur neatļautas rakstzīmes.');
        isValid = false;
    }

    if (difficultySelect.value === "") {
        showCustomAlert('Lūdzu, atlasiet grūtības pakāpi.');
        isValid = false;
    }

    const correctAnswerText = correctAnswerInput.value.trim();
    if (!correctAnswerText) {
        showCustomAlert('Pareizā atbilde nevar būt tukša.');
        isValid = false;
    } else if (!/^[a-zA-Z0-9 .,!?]*$/.test(correctAnswerText)) {
        showCustomAlert('Atbilde var saturēt tikai burtus un ciparus.');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const formData = new FormData(form);
    formData.append('action', 'add_question');

    fetch('/Trivia/php/submit_question.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            form.reset();
            document.getElementById('questionImagePreviewContainer').style.display = 'none';
            document.getElementById('questionMessage').style.display = 'block';
            
            setTimeout(() => {
                document.getElementById('questionMessage').style.display = 'none';
            }, 2000);
        } else if (result === 'duplicate_question_points') {
            showCustomAlert('Šajā kategorijā jau ir jautājums ar šādu punktu vērtību.');
        } else {
            showCustomAlert('Kļūda pievienojot jautājumu.');
        }
    })
    .catch(error => {
        console.error('Error submitting question:', error);
        showCustomAlert('Kļūda pievienojot jautājumu.');
    });
}

function previewQuestionImage() {
    const preview = document.getElementById('questionImagePreview');
    const fileInput = document.getElementById('myFile');
    const file = fileInput.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if (file) {
        const fileName = file.name.toLowerCase();
        const ext = fileName.split('.').pop();
        if (!allowedExtensions.includes(ext)) {
            alert('Jautājuma attēlam jābūt JPG, JPEG, PNG vai GIF formātā.');
            fileInput.value = '';
            preview.src = '';
            return;
        }
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            preview.src = reader.result;
        }, false);
        reader.readAsDataURL(file);
    }
} 