import { useState } from 'react';
import './Pnj_to_Jpeg.css'
import pic from '../../assets/pic.png'
function Pnj_to_Jpeg() {
  const [imageFile, setImageFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [converted, setConverted] = useState(false);

  // Handle file input change
  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
    setConverted(false);
    setDownloadUrl(null); // Reset download URL on new file input
  };

  // Function to convert PNG to JPEG
  async function convertPngToJpeg() {
    if (!imageFile) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch('http://127.0.0.1:8080/api/png-to-jpeg', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setConverted(true); // Mark as converted
    } catch (error) {
      console.error('Error during conversion:', error);
    }
  }
    const refreshPage = () => {
        window.location.reload();
    };
  return (
    <div className='container'>
        
        <div className="hh">
            <img src={pic} className='left-arrow' onClick={refreshPage}/>
            <h1>Convert PNG to JPEG</h1>
            
            
            <input type="file" accept="image/png" onChange={handleFileChange} />


            <button onClick={convertPngToJpeg} disabled={!imageFile} className='convert1'>
            Convert
            </button>

            {converted && (
            <a href={downloadUrl} download="converted.jpeg">
                <button className='download'>Download</button>
            </a>
            )}
        </div>
    </div>
  );
}

export default Pnj_to_Jpeg;
