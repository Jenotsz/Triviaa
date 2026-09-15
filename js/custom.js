function back() {
    window.location.href = "../html/home.html";
}

function saveColor() {
    let colorPicker = document.getElementById("colorPicker");
    let selectedColor = colorPicker.value;
    localStorage.setItem("bgColor", selectedColor);
    applySavedPreferences();
}

function saveImage() {
    let fileInput = document.getElementById("imageUpload");
    let file = fileInput.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem("bgImage", e.target.result);
            applySavedPreferences();
        };
        reader.readAsDataURL(file);
    }
}

function savePageTitles() {
    let homeTitleInput = document.getElementById("homeTitle");
    let startTitleInput = document.getElementById("startTitle");
    let pageTitleColorInput = document.getElementById("pageTitleColor");

    let homeTitle = homeTitleInput.value.trim();
    let startTitle = startTitleInput.value.trim();
    let pageTitleColor = pageTitleColorInput.value;

    const isHomeTitleFilled = homeTitle !== '';
    const isStartTitleFilled = startTitle !== '';
    const isColorFilled = pageTitleColor !== '';

    if (isHomeTitleFilled && homeTitle.length > 30) {
        showCustomAlert('Sākuma lapas virsraksts nedrīkst pārsniegt 30 simbolus.');
        homeTitleInput.focus();
        return;
    }
    if (isStartTitleFilled && startTitle.length > 30) {
        showCustomAlert('Spēles lapas virsraksts nedrīkst pārsniegt 30 simbolus.');
        startTitleInput.focus();
        return;
    }
    if (isHomeTitleFilled && homeTitle.length === 0) {
        showCustomAlert('Sākuma lapas virsraksts nevar būt tukšs.');
        homeTitleInput.focus();
        return;
    }
    if (isStartTitleFilled && startTitle.length === 0) {
        showCustomAlert('Spēles lapas virsraksts nevar būt tukšs.');
        startTitleInput.focus();
        return;
    }

    if (!isHomeTitleFilled && !isStartTitleFilled && !isColorFilled) {
        showCustomAlert('Aizpildiet vismaz vienu lauku, lai saglabātu.');
        return;
    }

    if (isHomeTitleFilled && !isValidInput(homeTitle)) {
        showCustomAlert('Sākuma lapas virsraksts satur neatļautas rakstzīmes.');
        return;
    }
    if (isStartTitleFilled && !isValidInput(startTitle)) {
        showCustomAlert('Spēles lapas virsraksts satur neatļautas rakstzīmes.');
        return;
    }

    const repeatCharRegex = /(.)\1{3,}/;
    if (isHomeTitleFilled && repeatCharRegex.test(homeTitle)) {
        showCustomAlert('Sākuma lapas virsrakstā nedrīkst būt viens un tas pats simbols vairāk nekā 3 reizes pēc kārtas.');
        homeTitleInput.focus();
        return;
    }
    if (isStartTitleFilled && repeatCharRegex.test(startTitle)) {
        showCustomAlert('Spēles lapas virsrakstā nedrīkst būt viens un tas pats simbols vairāk nekā 3 reizes pēc kārtas.');
        startTitleInput.focus();
        return;
    }

    showCustomConfirm('Vai tiešām vēlaties saglabāt izmaiņas?', () => {
        if (isHomeTitleFilled) localStorage.setItem("homeTitle", homeTitle);
        if (isStartTitleFilled) localStorage.setItem("startTitle", startTitle);
        if (isColorFilled) localStorage.setItem("pageTitleColor", pageTitleColor);
        applySavedPreferences();
        showCustomAlert("Izmaiņas saglabātas veiksmīgi!");
    });
}

function isValidInput(inputText) {
    const validCharRegex = /^[a-zA-Z0-9 .,!?'"\r\nĀČĒĢĪĶĻŅŌŠŪŽāčēģīķļņōšūž()„:+-]*$/;
    if (!validCharRegex.test(inputText)) {
        return false;
    }
    return true;
}

function openRulesCustomizeModal() {
    document.getElementById("rulesCustomizeModal").style.display = "flex";
    document.body.classList.add("no-scroll");
    loadRules(); 
}

function closeRulesCustomizeModal() {
    document.getElementById("rulesCustomizeModal").style.display = "none";
    document.body.classList.remove("no-scroll");
}

function loadRules() {
    let savedRulesTitle = localStorage.getItem("rulesTitle");
    let savedRulesParagraph = localStorage.getItem("rulesParagraph");
    let savedGameRulesTitle = localStorage.getItem("gameRulesTitle");
    let savedGameRulesParagraph = localStorage.getItem("gameRulesParagraph");
    let savedRulesTextColor = localStorage.getItem("rulesTextColor");

    if (savedRulesTitle) document.getElementById("rulesTitleText").value = savedRulesTitle;
    if (savedRulesParagraph) document.getElementById("rulesParagraphText").value = savedRulesParagraph;
    if (savedGameRulesTitle) document.getElementById("gameRulesTitleText").value = savedGameRulesTitle;
    if (savedGameRulesParagraph) document.getElementById("gameRulesParagraphText").value = savedGameRulesParagraph;
    if (savedRulesTextColor) document.getElementById("rulesTextColor").value = savedRulesTextColor;
}

function saveRules() {
    let rulesTitleText = document.getElementById("rulesTitleText").value.trim();
    let rulesParagraphText = document.getElementById("rulesParagraphText").value.trim();
    let gameRulesTitleText = document.getElementById("gameRulesTitleText").value.trim();
    let gameRulesParagraphText = document.getElementById("gameRulesParagraphText").value.trim();
    let rulesTextColor = document.getElementById("rulesTextColor").value;

    const allowedRulesRegex = /^[a-zA-Z0-9ĀČĒĢĪĶĻŅŌŠŪŽāčēģīķļņōšūž .,!?\s-]*$/;
    const repeatCharRegex = /(.)\1{3,}/;

    const rulesFields = [
        { value: rulesTitleText, label: 'Noteikumu virsraksts' },
        { value: rulesParagraphText, label: 'Noteikumu teksts' },
        { value: gameRulesTitleText, label: 'Spēles noteikumu virsraksts' },
        { value: gameRulesParagraphText, label: 'Spēles noteikumu teksts' }
    ];
    for (const field of rulesFields) {
        if (!allowedRulesRegex.test(field.value)) {
            showCustomAlert(`${field.label} drīkst saturēt tikai burtus, ciparus, atstarpes un . , ! ?`);
            return;
        }
        if (repeatCharRegex.test(field.value)) {
            showCustomAlert(`${field.label} nedrīkst saturēt vienu un to pašu simbolu vairāk nekā 3 reizes pēc kārtas.`);
            return;
        }
    }

    showCustomConfirm('Vai tiešām vēlaties saglabāt noteikumus?', () => {
        if (rulesTitleText) localStorage.setItem("rulesTitle", rulesTitleText);
        if (rulesParagraphText) localStorage.setItem("rulesParagraph", rulesParagraphText);
        if (gameRulesTitleText) localStorage.setItem("gameRulesTitle", gameRulesTitleText);
        if (gameRulesParagraphText) localStorage.setItem("gameRulesParagraph", gameRulesParagraphText);
        localStorage.setItem("rulesTextColor", rulesTextColor);
        showCustomAlert("Noteikumi saglabāti veiksmīgi!");
        closeRulesCustomizeModal();
    });
}

function lightenColor(hex, percent) {
    var r = parseInt(hex.substring(1, 3), 16);
    var g = parseInt(hex.substring(3, 5), 16);
    var b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, r + (255 - r) * percent);
    g = Math.min(255, g + (255 - g) * percent);
    b = Math.min(255, b + (255 - b) * percent);

    r = Math.round(r).toString(16).padStart(2, '0');
    g = Math.round(g).toString(16).padStart(2, '0');
    b = Math.round(b).toString(16).padStart(2, '0');

    return "#" + r + g + b;
}

function applySavedPreferences() {
    let savedColor = localStorage.getItem("bgColor");
    let savedImage = localStorage.getItem("bgImage");
    let savedHomeTitle = localStorage.getItem("homeTitle");
    let savedStartTitle = localStorage.getItem("startTitle");
    let savedPageTitleColor = localStorage.getItem("pageTitleColor");

    if (savedColor) {
        document.documentElement.style.setProperty("--bg-color", savedColor);
        document.documentElement.style.setProperty("--points-button-bg-color", lightenColor(savedColor, 0.2));
        let colorPicker = document.getElementById("colorPicker");
        if (colorPicker) colorPicker.value = savedColor;
    }
    if (savedImage) {
        let topRightImg = document.getElementById("topRightImage");
        let centerImg = document.getElementById("centerImage");
        let logoImg = document.getElementById("logoButtonImg");
        if (topRightImg) topRightImg.src = savedImage;
        if (centerImg) centerImg.src = savedImage;
        if (logoImg) logoImg.src = savedImage;
    }
    if (savedPageTitleColor) {
        document.querySelectorAll('h1').forEach(function(h1) {
            h1.style.setProperty('color', savedPageTitleColor, 'important');
        });
    }
    if (savedHomeTitle) {
        let homeTitleElement = document.getElementById("homePageTitle");
        if (homeTitleElement) {
            homeTitleElement.textContent = savedHomeTitle;
        }
    }
    if (savedStartTitle) {
        let startTitleElement = document.getElementById("startPageTitle");
        if (startTitleElement) {
            startTitleElement.textContent = savedStartTitle;
        }
    }
}

function applyRulesOnHomePage() {
    let rulesTitleElement = document.getElementById("rulesTitle");
    let rulesParagraphElement = document.getElementById("rulesParagraph");
    let gameRulesTitleElement = document.getElementById("gameRulesTitle");
    let gameRulesParagraphElement = document.getElementById("gameRulesParagraph");

    let savedRulesTextColor = localStorage.getItem("rulesTextColor");

    if (rulesTitleElement) {
        let savedRulesTitle = localStorage.getItem("rulesTitle");
        if (savedRulesTitle) rulesTitleElement.textContent = savedRulesTitle;
        if (savedRulesTextColor) rulesTitleElement.style.color = savedRulesTextColor;
    }
    if (rulesParagraphElement) {
        let savedRulesParagraph = localStorage.getItem("rulesParagraph");
        if (savedRulesParagraph) rulesParagraphElement.innerHTML = savedRulesParagraph.replace(/\r?\n/g, '<br>');
        if (savedRulesTextColor) rulesParagraphElement.style.color = savedRulesTextColor;
    }
    if (gameRulesTitleElement) {
        let savedGameRulesTitle = localStorage.getItem("gameRulesTitle");
        if (savedGameRulesTitle) gameRulesTitleElement.textContent = savedGameRulesTitle;
        if (savedRulesTextColor) gameRulesTitleElement.style.color = savedRulesTextColor;
    }
    if (gameRulesParagraphElement) {
        let savedGameRulesParagraph = localStorage.getItem("gameRulesParagraph");
        if (savedGameRulesParagraph) gameRulesParagraphElement.innerHTML = savedGameRulesParagraph.replace(/\r?\n/g, '<br>');
        if (savedRulesTextColor) gameRulesParagraphElement.style.color = savedRulesTextColor;
    }
}

function previewCategoryImage() {
    const preview = document.getElementById('categoryImagePreview');
    const file = document.getElementById('categoryImage').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

function previewQuestionImage() {
    const preview = document.getElementById('questionImagePreview');
    const file = document.getElementById('myFile').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

document.addEventListener("DOMContentLoaded", applySavedPreferences);
document.addEventListener("DOMContentLoaded", applyRulesOnHomePage);

document.addEventListener("DOMContentLoaded", function() {
    let savedPageTitleColor = localStorage.getItem("pageTitleColor");
    let pageTitleColorInput = document.getElementById("pageTitleColor");
    if (savedPageTitleColor && pageTitleColorInput) {
        pageTitleColorInput.value = savedPageTitleColor;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('homeTitle') && document.getElementById('startTitle')) {
        var pageTitleColor = localStorage.getItem('pageTitleColor');
        var pageTitleColorInput = document.getElementById('pageTitleColor');
        if (pageTitleColor && pageTitleColorInput) {
            pageTitleColorInput.value = pageTitleColor;
        }
        var homeTitle = localStorage.getItem('homeTitle');
        var homeTitleInput = document.getElementById('homeTitle');
        if (homeTitle && homeTitleInput) {
            homeTitleInput.value = '';
            homeTitleInput.setAttribute('placeholder', homeTitle);
        }
        var startTitle = localStorage.getItem('startTitle');
        var startTitleInput = document.getElementById('startTitle');
        if (startTitle && startTitleInput) {
            startTitleInput.value = '';
            startTitleInput.setAttribute('placeholder', startTitle);
        }
        var bgColor = localStorage.getItem('bgColor');
        var colorPicker = document.getElementById('colorPicker');
        if (bgColor && colorPicker) {
            colorPicker.value = bgColor;
        }
    }
});
