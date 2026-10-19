let swRegistration = null;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => { swRegistration = reg; })
        .catch(err => console.error(err));
}

if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const savedTheme = localStorage.getItem('themePreference');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Light Mode';
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('themePreference', 'dark');
            themeToggle.textContent = 'Light Mode';
        } else {
            localStorage.setItem('themePreference', 'light');
            themeToggle.textContent = 'Dark Mode';
        }
    });
}

const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const startCameraBtn = document.getElementById('startCamera');
const takePhotoBtn = document.getElementById('takePhoto');
const photoStatus = document.getElementById('photoStatus');
const imageInputHidden = document.getElementById('image_data');

if (startCameraBtn && cameraVideo) {
    async function getStream() {
        return await navigator.mediaDevices.getUserMedia({ video: true });
    }

    startCameraBtn.addEventListener('click', async () => {
        try {
            const stream = await getStream();
            cameraVideo.srcObject = stream;
            cameraVideo.play();
            if (photoStatus) photoStatus.style.display = 'none';
        } catch (err) {
            console.error("Gagal mengakses kamera:", err);
        }
    });

    takePhotoBtn.addEventListener('click', () => {
        if (cameraVideo.srcObject) {
            const context = cameraCanvas.getContext('2d');
            cameraCanvas.width = cameraVideo.videoWidth || 320;
            cameraCanvas.height = cameraVideo.videoHeight || 240;
            context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
            
            const photoBase64 = cameraCanvas.toDataURL('image/png');
            if (imageInputHidden) {
                imageInputHidden.value = photoBase64;
            }
            if (photoStatus) photoStatus.style.display = 'block';
        }
    });
}