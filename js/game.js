// Game management functions
function Start_game() {
    fetch('/Trivia/php/receive.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('categories');
            container.innerHTML = '';

            const clickedButtons = JSON.parse(localStorage.getItem('clickedButtons')) || [];

            data.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('category-box');

                const name = document.createElement('p');
                name.textContent = category.kategorija;
                name.classList.add('category-name');

                const buttonsDiv = document.createElement('div');
                buttonsDiv.classList.add('points-buttons');

                for (let points = 10; points <= 50; points += 10) {
                    const button = document.createElement('button');
                    button.textContent = points;
                    button.classList.add('points-button');

                    if (clickedButtons.includes(`${category.kategorija_id}-${points}`)) {
                        button.classList.add('hidden');
                    }

                    button.onclick = () => {
                        clickedButtons.push(`${category.kategorija_id}-${points}`);
                        localStorage.setItem('clickedButtons', JSON.stringify(clickedButtons));
                    
                        window.location.href = `question.html?category_id=${category.kategorija_id}&points=${points}`;
                    
                        button.classList.add('hidden');
                    
                        document.getElementById('reset-button').style.display = 'block';
                    };

                    buttonsDiv.appendChild(button);
                }

                categoryDiv.appendChild(name);
                categoryDiv.appendChild(buttonsDiv);
                container.appendChild(categoryDiv);
            });

            const resetButton = document.createElement('button');
            resetButton.id = 'reset-button';
            resetButton.textContent = 'Reset All Buttons';
            resetButton.style.display = 'none';
            resetButton.onclick = resetButtons;
            container.appendChild(resetButton);
        })
        .catch(error => {
            console.error('Error loading categories:', error);
        });
}

function resetButtons() {
    const clickedButtons = JSON.parse(localStorage.getItem('clickedButtons')) || [];

    const buttons = document.querySelectorAll('.points-button');
    buttons.forEach(button => {
        const categoryId = button.closest('.category-box').querySelector('.category-name').textContent;
        const points = button.textContent;
        const buttonId = `${categoryId}-${points}`;
        
        if (clickedButtons.includes(buttonId)) {
            button.style.display = 'inline-block';
        }
    });

    localStorage.removeItem('clickedButtons');

    document.getElementById('reset-button').style.display = 'none';
    window.location.reload();
} 