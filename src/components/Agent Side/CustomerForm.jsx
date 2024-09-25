import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faBuilding, faIdBadge, faVenusMars, faCommentDots } from '@fortawesome/free-solid-svg-icons';

const CustomerForm = () => {
    const formStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
    };

    const inputContainerStyle = {
        width: '23%',
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    };

    const buttonStyle = {
        width: '48%',
        padding: '10px 0',
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

    return (
        <form style={formStyle}>
            <h1>Customer Information Form</h1>
            <div style={rowStyle}>
                <div style={inputContainerStyle}>
                    <label>
                        <FontAwesomeIcon icon={faUser} /> Title
                    </label>
                    <input type="text" name="title" placeholder="Title" style={inputStyle} />
                </div>
                <div style={inputContainerStyle}>
                    <label>
                        <FontAwesomeIcon icon={faUser} /> First Name
                    </label>
                    <input type="text" name="firstName" placeholder="First Name" style={inputStyle} />
                </div>
                <div style={inputContainerStyle}>
                    <label>
                        <FontAwesomeIcon icon={faUser} /> Middle Name
                    </label>
                    <input type="text" name="middleName" placeholder="Middle Name" style={inputStyle} />
                </div>
                <div style={inputContainerStyle}>
                    <label>
                        <FontAwesomeIcon icon={faUser} /> Last Name
                    </label>
                    <input type="text" name="lastName" placeholder="Last Name" style={inputStyle} />
                </div>
            </div>
            <div style={rowStyle}>
                <div style={{ ...inputContainerStyle, width: '30%' }}>
                    <label>
                        <FontAwesomeIcon icon={faEnvelope} /> Email
                    </label>
                    <input type="email" name="email" placeholder="Enter your email" style={inputStyle} />
                </div>
                <div style={{ ...inputContainerStyle, width: '30%' }}>
                    <label>
                        <FontAwesomeIcon icon={faPhone} /> Phone
                    </label>
                    <input type="text" name="phone" placeholder="Enter your phone number" style={inputStyle} />
                </div>
                <div style={{ ...inputContainerStyle, width: '30%' }}>
                    <label>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Address
                    </label>
                    <input type="text" name="address" placeholder="Enter your address" style={inputStyle} />
                </div>
            </div>
            <div style={rowStyle}>
                <div style={{ ...inputContainerStyle, width: '23%' }}>
                    <label>
                        <FontAwesomeIcon icon={faBuilding} /> City
                    </label>
                    <input type="text" name="city" placeholder="Enter your city" style={inputStyle} />
                </div>
                <div style={{ ...inputContainerStyle, width: '23%' }}>
                    <label>
                        <FontAwesomeIcon icon={faBuilding} /> State
                    </label>
                    <input type="text" name="state" placeholder="Enter your state" style={inputStyle} />
                </div>
                <div style={{ ...inputContainerStyle, width: '23%' }}>
                    <label>
                        <FontAwesomeIcon icon={faBuilding} /> PostCode
                    </label>
                    <input type="text" name="postCode" placeholder="Enter your PostCode" style={inputStyle} />
                </div>
                <div style={{ ...inputContainerStyle, width: '23%' }}>
                    <label>
                        <FontAwesomeIcon icon={faBuilding} /> Province
                    </label>
                    <input type="text" name="province" placeholder="Enter your Province" style={inputStyle} />
                </div>
            </div>
            <div style={rowStyle}>
                <div style={{ ...inputContainerStyle, width: '23%' }}>
                    <label>
                        <FontAwesomeIcon icon={faIdBadge} /> Vendor ID
                    </label>
                    <input type="text" name="vendorId" placeholder="Enter Vendor ID" style={inputStyle} />
                </div>
                <div style={{ ...inputContainerStyle, width: '23%' }}>
                    <label>
                        <FontAwesomeIcon icon={faIdBadge} /> DialCode
                    </label>
                    <input type="text" name="dialCode" placeholder="Enter DialCode" style={inputStyle} />
                </div>
                <div style={{ ...inputContainerStyle, width: '23%' }}>
                    <label>
                        <FontAwesomeIcon icon={faPhone} /> Alt. Phone
                    </label>
                    <input type="text" name="altPhone" placeholder="Enter Alt. Phone" style={inputStyle} />
                </div>
                <div style={{ ...inputContainerStyle, width: '23%' }}>
                    <label>
                        <FontAwesomeIcon icon={faVenusMars} /> Gender
                    </label>
                    <select name="gender" style={inputStyle}>
                        <option value="U">Undefined</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>
            </div>
            <div style={{ ...inputContainerStyle, width: '100%' }}>
                <label>
                    <FontAwesomeIcon icon={faCommentDots} /> Comments
                </label>
                <textarea name="comments" placeholder="Enter your comments" style={{ ...inputStyle, height: '100px' }} />
            </div>
            <div style={buttonContainerStyle}>
                <button type="submit" style={buttonStyle}>Submit</button>
                <button type="reset" style={clearButtonStyle}>Clear</button>
            </div>
        </form>
    );
}

export default CustomerForm;
