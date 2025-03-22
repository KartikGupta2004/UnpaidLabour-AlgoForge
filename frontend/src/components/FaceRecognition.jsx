import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
// import './FaceRecognition.css';

// https://justadudewhohacks.github.io/face-api.js/docs/index.html

function FaceRecognition() {
  const [profileImage, setProfileImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // Ensure models exist in public/models folder
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
      } catch (err) {
        setError('Failed to load face detection models.');
        console.error(err);
      }
    };
    loadModels();
  }, []);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const padImageToSquare = async (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const maxSize = Math.max(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');
        
        // Fill with transparent background
        ctx.fillStyle = 'rgba(255,255,255,0)'; 
        ctx.fillRect(0, 0, maxSize, maxSize);

        // Center the image
        const offsetX = (maxSize - img.width) / 2;
        const offsetY = (maxSize - img.height) / 2;
        ctx.drawImage(img, offsetX, offsetY, img.width, img.height);

        resolve(canvas.toDataURL()); // Return padded image as DataURL
      };
    });
  };

  const compareFaces = async () => {
    setError(null);
    setComparisonResult(null);

    if (!profileImage || !selfieImage) {
      setError('Please upload both a profile photo and a selfie.');
      return;
    }

    try {
      const paddedProfileImage = await padImageToSquare(profileImage);
      const paddedSelfieImage = await padImageToSquare(selfieImage);

      const profileImg = new Image();
      profileImg.src = paddedProfileImage;
      await new Promise((resolve) => (profileImg.onload = resolve));

      const selfieImg = new Image();
      selfieImg.src = paddedSelfieImage;
      await new Promise((resolve) => (selfieImg.onload = resolve));

      const profileDetection = await faceapi
        .detectSingleFace(profileImg)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!profileDetection) {
        setError('No face detected in the profile photo.');
        return;
      }

      const selfieDetections = await faceapi
        .detectAllFaces(selfieImg)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (selfieDetections.length === 0) {
        setError('No face detected in the selfie.');
        return;
      }

      const labeledDescriptor = new faceapi.LabeledFaceDescriptors(
        'profile',
        [profileDetection.descriptor]
      );

      const faceMatcher = new faceapi.FaceMatcher([labeledDescriptor], 0.6);
      const results = selfieDetections.map(detection =>
        faceMatcher.findBestMatch(detection.descriptor)
      );

      const matchingResults = results.filter(result => result.distance < 0.6);
      const hasMatch = matchingResults.length > 0;
      const containsMultiplePeople = selfieDetections.length > 1;

      let resultMessage = '';
      if (hasMatch && containsMultiplePeople) {
        resultMessage = 'The selfie matches the profile photo and contains multiple people!';
      } else if (hasMatch) {
        resultMessage = 'The selfie matches the profile photo.';
      } else if (containsMultiplePeople) {
        resultMessage = 'The selfie does not match the profile photo, but contains multiple people.';
      } else {
        resultMessage = 'The selfie does not match the profile photo.';
      }
      setComparisonResult(resultMessage);
    } catch (err) {
      setError('Error processing the images.');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>Face Comparison with face-api.js</h1>
      <div>
        <h3>Upload Profile Photo</h3>
        <input type="file" onChange={(e) => handleImageChange(e, setProfileImage)} accept="image/*" />
        {profileImage && <img src={profileImage} alt="Profile" width="150" />}
      </div>
      <div>
        <h3>Upload Selfie</h3>
        <input type="file" onChange={(e) => handleImageChange(e, setSelfieImage)} accept="image/*" />
        {selfieImage && <img src={selfieImage} alt="Selfie" width="150" />}
      </div>
      <button onClick={compareFaces}>Compare Photos</button>
      {comparisonResult && <p>{comparisonResult}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FaceRecognition;
