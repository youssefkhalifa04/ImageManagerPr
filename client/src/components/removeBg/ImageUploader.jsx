import React, { useState } from 'react';
import './ImageUploader.css'
import pic from '../../assets/pic.png'
const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [outputUrl, setOutputUrl] = useState('');
    
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);  // Reset error on file change
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file before uploading.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:8080/api/remove-background', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error removing background: ' + response.statusText);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setOutputUrl(url);  // Create a URL for the output image
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = outputUrl;
        link.download = 'output.png';  // The name for the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const refreshPage = () => {
        window.location.reload();
    };
    

    return (
        <div className='containerbg'>
            <div className='hh'>
                <img src={pic} className='left-arrow' onClick={refreshPage} />
                <h1>Upload Image to Remove </h1>
                <h1>Background</h1>
                <div className="second-container">
                <div className="file-input-container">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    id="file-upload"
                    className="file-input"
                />
                <label htmlFor="file-upload" className="file-input-label">
                    Choose an image
                </label>
            </div>
                    <button onClick={handleUpload} disabled={loading} className='removebtn' >
                        {loading ? 'Processing...' : 'Remove Background'}
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {outputUrl && (
                        <div className='hiro'>
                            <button onClick={handleDownload} className='downloadbtn'>
                                <div className="hover-bg"></div>
                                <span>Download</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
