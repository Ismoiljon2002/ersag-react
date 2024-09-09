import React from 'react';
import { FaArrowLeft, FaFilter } from 'react-icons/fa'; // Importing icons from react-icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './styles/topBar.css'; // Import your CSS file
import { Container } from '@mui/material';

const TopBar = ({ title, onBackPress, onFilterPress }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleFilterPress = () => {
        navigate('/summary');
    };

    return (
        <div className="topbar-container">
            <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {onBackPress && (
                    <button onClick={onBackPress} className="topbar-icon">
                        <FaArrowLeft size={24} color="white" />
                    </button>
                )}
                <h1 className="topbar-title">{title}</h1>
                {onFilterPress && (
                    <button onClick={handleFilterPress} className="topbar-icon">
                        <FaFilter size={24} color="white" />
                    </button>
                )}
            </Container>
        </div>
    );
};

export default TopBar;
