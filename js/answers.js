function fetchAndDisplayAnswers() {
    fetch('/Trivia/php/fetch_all_answers.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const answersDisplayContainer = document.getElementById('answersDisplay');
            answersDisplayContainer.innerHTML = '';
            if (data.error) {
                answersDisplayContainer.innerHTML = `<p>Error fetching answers: ${data.error}</p>`;
                return;
            }
            const orderedCategories = new Map();
            data.forEach(question => {
                const categoryId = question.kategorija_id;
                const categoryName = question.kategorija;
                if (!orderedCategories.has(categoryId)) {
                    orderedCategories.set(categoryId, { name: categoryName, questions: [] });
                }
                orderedCategories.get(categoryId).questions.push(question);
            });
            orderedCategories.forEach(categoryData => {
                const categoryBox = document.createElement('div');
                categoryBox.classList.add('category-box');
                const categoryNameElement = document.createElement('p');
                categoryNameElement.classList.add('category-name');
                categoryNameElement.textContent = categoryData.name;
                categoryBox.appendChild(categoryNameElement);
                const answersList = document.createElement('div');
                answersList.classList.add('answers-list');
                categoryData.questions.forEach(question => {
                    const answerItem = document.createElement('p');
                    answerItem.classList.add('answer-item');
                    answerItem.innerHTML = `
                        <strong>${question.Grutiba} punkti:</strong> ${question.PAtbilde}
                    `;
                    answersList.appendChild(answerItem);
                });
                categoryBox.appendChild(answersList);
                answersDisplayContainer.appendChild(categoryBox);
            });
        })
        .catch(error => {
            document.getElementById('answersDisplay').innerHTML = '<p>Error loading answers.</p>';
        });
}
document.addEventListener('DOMContentLoaded', fetchAndDisplayAnswers); 
