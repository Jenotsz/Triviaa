function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

function initializeDeviceCheck() {
    if (isMobileDevice()) {
        document.getElementById('mobileMessage').style.display = 'block';
        document.body.style.pointerEvents = 'none';
    } else {
        fetch('../php/lock_manager.php')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(text => {
                let data = {};
                try {
                    data = text ? JSON.parse(text) : {};
                } catch (e) {
                    console.error('Error parsing lock_manager.php response:', e);
                    data = {};
                }
                if (data.error) {
                    document.getElementById('lockMessage').style.display = 'block';
                    document.body.style.pointerEvents = 'none';
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.addEventListener('beforeunload', function() {
        if (!isMobileDevice()) {
            fetch('../php/lock_manager.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=unload'
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeDeviceCheck);
