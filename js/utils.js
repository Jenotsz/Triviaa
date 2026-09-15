function openModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('infoModal').style.display = 'flex';
    document.body.classList.add("no-scroll");
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
    document.body.classList.remove("no-scroll");
}

function showCustomAlert(message) {
    document.getElementById('customAlertMessage').textContent = message;
    document.getElementById('customAlertDialog').style.display = 'flex';
}

function closeCustomAlert() {
    document.getElementById('customAlertDialog').style.display = 'none';
    document.getElementById('customConfirmButtons').style.display = 'none'; 
    document.querySelector('#customAlertDialog .custom-alert-button').style.display = 'block';
}

function showCustomConfirm(message, onConfirmCallback) {
    document.getElementById('customAlertMessage').textContent = message;
    document.getElementById('customAlertDialog').style.display = 'flex';
    document.querySelector('#customAlertDialog .custom-alert-button').style.display = 'none'; 
    document.getElementById('customConfirmButtons').style.display = 'flex';

    const confirmYesButton = document.getElementById('confirmYes');
    const confirmNoButton = document.getElementById('confirmNo');

    confirmYesButton.onclick = null;
    confirmNoButton.onclick = null;

    confirmYesButton.onclick = () => {
        closeCustomAlert();
        onConfirmCallback();
    };

    confirmNoButton.onclick = () => {
        closeCustomAlert();
    };
} 