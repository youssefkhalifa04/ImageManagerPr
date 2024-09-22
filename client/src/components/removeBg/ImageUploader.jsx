import React, { useState } from 'react';
import './ImageUploader.css'
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

    return (
        <div className='containerbg'>
            <div className='hh'>
                <h1>Upload Image to Remove Background</h1>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={loading} className='removebtn' >
                    {loading ? 'Processing...' : 'Remove Background'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {outputUrl && (
                    <div>
                        <button onClick={handleDownload} className='downloadbtn'>Download</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
