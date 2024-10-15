
# Face Expression Detection JS App

This is a JavaScript-based face recognition application built using the [face-api.js](https://www.npmjs.com/package/face-api.js) library. The app can detect faces, recognize expressions, and even estimate the age of a person based on an uploaded image. This project demonstrates how machine learning and AI can be used for facial detection and recognition on the web.

## Features

- **Face Detection:** Identify faces within images.
- **Face Expression Detection:** Recognize different facial expressions (e.g., happy, sad, angry).
- **Face Matching:** Match an uploaded image with another to check if they belong to the same person.
- **Age Estimation:** Estimate the age of a person based on their facial features.

## Demo

You can try the live demo [here](https://face-detect-ai-sand.vercel.app/).

## Installation

Follow the steps below to set up and run the project locally:

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- Basic knowledge of JavaScript.

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Nijeshpatel11/Face-Detect-AI.git
   cd face-recognition-app
   ```

2. **Install dependencies**

   ```bash
   npm install face-api.js
   ```

## Usage

1. **Upload an Image:** Click on the "Choose File" button to upload an image from your device.
2. **Detection and Recognition:** The app will detect faces in the image (Also able to Use Webcam) and display information like facial expressions, age, and gender.

## Example Output

When you upload an image, you can see output similar to:

- **Face Detected:** Yes/No
- **Expression:** Happy, Sad, Angry, etc.
- **Estimated Age:** 25
- **Face Match:** Matched with the uploaded image

## Technologies Used

- **JavaScript**
- **face-api.js** - Face recognition and detection library.

