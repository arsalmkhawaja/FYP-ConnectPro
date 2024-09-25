import React, { useState } from 'react';

const DispositionModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState({
        A: false, B: false, CALLBK: false, DC: false,
        DEC: false, DNC: false, N: false, NI: false,
        NP: false, SALE: false, XFER: false
    });

    const screenStyle = {
        display: isVisible ? 'block' : 'none',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: '1000',
        paddingTop: '50px',
    };

    const containerStyle = {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'white',
        border: '1px',
        borderRadius: '5px',
    };

    const dispositionContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '20px',
    };

    const itemStyle = {
        marginBottom: '10px',
        fontSize: '16px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    };

    const buttonStyle = {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const clearButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckedItems(prevState => ({ ...prevState, [name]: checked }));
    };

    const handleClearForm = () => {
        setCheckedItems({
            A: false, B: false, CALLBK: false, DC: false,
            DEC: false, DNC: false, N: false, NI: false,
            NP: false, SALE: false, XFER: false
        });
    };

    const handleSubmit = () => {
        const isAnyChecked = Object.values(checkedItems).some(item => item);
        if (isAnyChecked) {
            setIsVisible(false);
        } else {
            alert("Please select at least one option before submitting.");
        }
    };

    return (
        <div>
            <button style={buttonStyle} onClick={toggleVisibility}>Hangup</button>
            
            <div style={screenStyle}>
                <div style={containerStyle}>
                  
                    <h2>CALL DISPOSITION</h2>
                    <div style={dispositionContainerStyle}>
                        {Object.keys(checkedItems).map(key => (
                            <label style={itemStyle} key={key}>
                                <input
                                    type="checkbox"
                                    name={key}
                                    checked={checkedItems[key]}
                                    onChange={handleCheckboxChange}
                                    style={{ marginRight: '8px' }}
                                />
                                {key} - {getLabel(key)}
                            </label>
                        ))}
                    </div>

                    <div style={buttonContainerStyle}>
                        <button style={clearButtonStyle} type="button" onClick={handleClearForm}>Clear Form</button>
                        <button style={buttonStyle} type="button" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getLabel = (key) => {
    const labels = {
        A: 'Answering Machine',
        B: 'Busy',
        CALLBK: 'Call Back',
        DC: 'Disconnected Number',
        DEC: 'Declined Sale',
        DNC: 'DO NOT CALL',
        N: 'No Answer',
        NI: 'Not Interested',
        NP: 'No Pitch No Price',
        SALE: 'Sale Made',
        XFER: 'Call Transferred',
    };
    return labels[key];
};

export default DispositionModal;
