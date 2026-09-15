function kategorija() {
    fetch('/Trivia/php/receive.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const categorySelect = document.getElementById('kategorija');
            categorySelect.innerHTML = '<option value="" disabled selected>Atlasiet kategoriju</option>';

            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.kategorija_id;
                option.textContent = category.kategorija;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function loadCategories() {
    fetch('/Trivia/php/receive.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const display_kategorijas = document.getElementById('display_kategorijas');
        if (!display_kategorijas) {
            console.error('Element with ID display_kategorijas not found');
            return;
        }
        display_kategorijas.innerHTML = '';

        data.forEach(kategorija => {
            const categoryContainer = document.createElement('div');
            categoryContainer.style.marginBottom = '20px';
            categoryContainer.dataset.categoryId = kategorija.kategorija_id;

            const imgElement = document.createElement('img');
            imgElement.style.width = '150px';
            imgElement.style.height = '150px';
            imgElement.style.border = '1px solid #ccc';
            imgElement.style.display = 'block';
            imgElement.style.margin = '0 auto';
            imgElement.style.objectFit = 'cover';

            if (kategorija.kategorija_img) {
                imgElement.src = kategorija.kategorija_img;
            } else {
                imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2QzY2RjYyIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
            }

            imgElement.addEventListener('click', function() {
                loadCategoryQuestions(kategorija.kategorija_id);
            });

            categoryContainer.appendChild(imgElement);

            const nameElement = document.createElement('p');
            nameElement.textContent = kategorija.kategorija;
            nameElement.style.textAlign = 'center';
            nameElement.style.fontWeight = 'bold';
            categoryContainer.appendChild(nameElement);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Dzēst kategoriju";
            deleteButton.classList.add('del_button');  
            deleteButton.onclick = function() {
                deleteCategory(kategorija.kategorija_id);
            };
            categoryContainer.appendChild(deleteButton);

            display_kategorijas.appendChild(categoryContainer);
        });
    })
    .catch(error => {
        console.error('Error loading categories:', error);
    });
}

function deleteCategory(categoryId) {
    showCustomConfirm('Vai tiešām vēlaties dzēst šo kategoriju?', () => {
        fetch('/Trivia/php/delete_category.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_id: categoryId })
        })
        .then(response => response.text())
        .then(result => {
            if (result.trim() === 'success') {
                showCustomAlert('Kategorija veiksmīgi dzēsta!');
                loadCategories();
                kategorija();
            } else {
                showCustomAlert('Kļūda dzēšot kategoriju.');
            }
        })
        .catch(error => {
            console.error('Error deleting category:', error);
            showCustomAlert('Kļūda dzēšot kategoriju.');
        });
    });
}

function pievieno_kategoriju() {
    const jauna_kategorija = document.getElementById('jauna_kategorija').value.trim();
    const categoryImage = document.getElementById('categoryImage').files[0];
    if (!jauna_kategorija) {
        showCustomAlert('Kategorijas nosaukums nevar būt tukšs.');
        return;
    }

    if (jauna_kategorija.length < 3) {
        showCustomAlert('Kategorijas nosaukumam jābūt vismaz 3 rakstzīmēm.');
        return;
    }

    const categoryRegex = /^[a-zA-Z0-9 ĀČĒĢĪĶĻŅŌŠŪŽāčēģīķļņōšūž]*$/;
    if (!categoryRegex.test(jauna_kategorija)) {
        showCustomAlert('Kategorijas nosaukums var saturēt tikai burtus, ciparus un atstarpes.');
        return;
    }

    if (jauna_kategorija) {
        const formData = new FormData();
        formData.append('name', jauna_kategorija);
        if (categoryImage) {
            formData.append('categoryImage', categoryImage);
        }

        fetch('/Trivia/php/add_category.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(result => {
            if (result === 'success') {
                document.getElementById('categoryMessage').style.display = 'block';
                document.getElementById('jauna_kategorija').value = '';

                loadCategories();
                kategorija();

                document.getElementById('categoryImagePreviewContainer').style.display = 'none';

                setTimeout(() => {
                    document.getElementById('categoryMessage').style.display = 'none';
                }, 2000);
            }
        })
        .catch(error => {
            console.error('Error adding category:', error);
            showCustomAlert('Kļūda pievienojot kategoriju.');
        });
    }
}

function previewCategoryImage() {
    const preview = document.getElementById('categoryImagePreview');
    const fileInput = document.getElementById('categoryImage');
    const file = fileInput.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if (file) {
        const fileName = file.name.toLowerCase();
        const ext = fileName.split('.').pop();
        if (!allowedExtensions.includes(ext)) {
            alert('Kategorijas attēlam jābūt JPG, JPEG, PNG vai GIF formātā.');
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