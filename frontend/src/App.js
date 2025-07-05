import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!file) {
      alert("Select an image first!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      const payload = {
        name: file.name,
        data: base64,
      };

      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Image uploaded!");
        fetchImages();
      } else {
        alert("Upload failed");
      }
    };

    reader.readAsDataURL(file);
  };

  const fetchImages = async () => {
    const res = await fetch('http://localhost:8080/post');
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App">
      <h1>📸 Image Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadImage}>Upload</button>

      <h2>🖼 Uploaded Images</h2>
      <div className="gallery">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={`data:image/jpeg;base64,${img.data}`}
            alt={img.name}
            className="preview"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
