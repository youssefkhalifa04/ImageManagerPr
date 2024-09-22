import React, { useState } from 'react';
import ImageUploader from '../removeBg/ImageUploader';
import Pnj_to_Jpeg from '../conversion/Pnj_to_Jpeg';
import './Initial.css';
import pic from '../../assets/pic.png'

export default function Initial() {
    // State to track which component to render
    const [component, setComponent] = useState(null);
    const [showButtons, setShowButtons] = useState(true); // State to control button visibility

    

    // Update state to show the ImageUploader component and hide the buttons
    const remove = () => {
        
        setShowButtons(false);  // Hide the buttons
        setComponent(<ImageUploader />);
    };

    // Update state to show the Pnj_to_Jpeg component and hide the buttons
    const convert = () => {
        
        setShowButtons(false);  // Hide the buttons
        setComponent(<Pnj_to_Jpeg />);
    };

    return (
        <div className="bdy">
            {showButtons && (
                <div className='main-container'>
                    <div className="convert" onClick={convert}>
                        <h1>PNJ to JPEG</h1>
                        <h1>Conversion</h1>
                    </div>
                    <div className="remove" onClick={remove}>
                        <h1>Background</h1>
                        <h1>Remover</h1>
                    </div>
                </div>
            )}

            
            <div className="component-display">
                
                {component}
            </div>
        </div>
    );
}
