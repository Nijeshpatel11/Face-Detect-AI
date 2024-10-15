console.log(faceapi);

const run = async () => {
   
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });
    const videoFeedEl = document.getElementById('video-feed');
    videoFeedEl.srcObject = stream;

    // load models
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    ]);

    // set up the canvas
    const canvas = document.getElementById('canvas');
    canvas.style.left = `${videoFeedEl.offsetLeft}px`;
    canvas.style.top = `${videoFeedEl.offsetTop}px`;
    canvas.height = videoFeedEl.height;
    canvas.width = videoFeedEl.width;

    let uploadedFaceData = null;
    let lastNotification = ""; 
    let consecutiveMatchCount = 0; 
    let consecutiveNoMatchCount = 0;
    const matchThreshold = 0.6; 

    // handle image upload
    const imageUploadEl = document.getElementById('image-upload');
    imageUploadEl.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const img = await faceapi.bufferToImage(file);
            uploadedFaceData = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
            console.log('Uploaded face data: ', uploadedFaceData);
            lastNotification = ""; // Reset last notification after new image upload
        }
    });

    // notification display function
    const showNotification = (message) => {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    };

    // facial detection with points
    setInterval(async () => {
        const faceAIData = await faceapi.detectAllFaces(videoFeedEl)
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withAgeAndGender()
            .withFaceExpressions();

        // clear the canvas
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // resize results for canvas
        const resizedResults = faceapi.resizeResults(faceAIData, videoFeedEl);
        faceapi.draw.drawDetections(canvas, resizedResults);
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
        faceapi.draw.drawFaceExpressions(canvas, resizedResults);

        // process each detected face
        resizedResults.forEach(face => {
            const { age, gender, genderProbability, detection, descriptor } = face;
            const genderText = `${gender} - ${Math.round(genderProbability * 100) / 100}`;
            const ageText = `${Math.round(age)} years`;
            const textField = new faceapi.draw.DrawTextField([genderText, ageText], face.detection.box.topRight);
            textField.draw(canvas);

            // Match uploaded face with live faces
            if (uploadedFaceData) {
                const matcher = new faceapi.FaceMatcher(uploadedFaceData, matchThreshold);
                const bestMatch = matcher.findBestMatch(descriptor);
                const label = bestMatch.toString();

                let notificationMessage = "Match not found.";

                // Check if the match is within the threshold distance
                if (bestMatch.distance < matchThreshold && !label.includes("unknown")) {
                    consecutiveNoMatchCount = 0; 
                    consecutiveMatchCount++;
                    if (consecutiveMatchCount >= 4) { // Require 3 consecutive matches
                        notificationMessage = "Match found!";
                    }
                } else {
                    consecutiveMatchCount = 0; 
                    consecutiveNoMatchCount++; 
                    if (consecutiveNoMatchCount >= 4) { // Require 3 consecutive non-matches
                        notificationMessage = "Match not found.";
                    }
                }

                // Only show notification when the result changes (no fixed timeout)
                if (notificationMessage !== lastNotification) {
                    showNotification(notificationMessage);
                    lastNotification = notificationMessage; 
                }

                const drawBox = new faceapi.draw.DrawBox(detection.box, { label: notificationMessage });
                drawBox.draw(canvas);
            }
        });
    }, 200); 
};

run();
