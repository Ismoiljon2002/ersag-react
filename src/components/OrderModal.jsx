import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { IoExitOutline } from "react-icons/io5";
import { FaRegTrashCan, FaCartPlus } from "react-icons/fa6";
import { FaRegSave } from 'react-icons/fa';
import { Button, TextField, Select, MenuItem, Snackbar, Alert, Typography } from '@mui/material';

import './styles/orderModal.css';  // Import the CSS file

const OrderModal = ({ isOpen, onClose, order }) => {
    const [orderDate, setOrderDate] = useState(order ? new Date(order.orderDate) : new Date());
    const [items, setItems] = useState(order ? order.items : [{ item: '', price: '', isGift: false, customer: '' }]);
    const [discountPercent, setDiscountPercent] = useState(order ? order.discountPercent || '0' : '0');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        if (order) {
            setOrderDate(new Date(order.orderDate) || new Date());
            setItems(order.items || [{ item: '', price: '', isGift: false, customer: '' }]);
            setDiscountPercent(order.discountPercent || '0');
        } else {
            setOrderDate(new Date());
            setItems([{ item: '', price: '', isGift: false, customer: '' }]);
            setDiscountPercent('0');
        }
    }, [order]);

    const addItem = () => {
        const isValid = items.every(item => item.item && item.price);
        if (isValid) {
            setItems([...items, { item: '', price: '', isGift: false, customer: '' }]);
        } else {
            showCustomAlert("Iltimos, avvalgi maxsulotni to'liq kiriting", "warning");
        }
    };

    const handleSave = () => {
        const isValid = items.every(item => item.item && item.price);
        if (!isValid) {
            showCustomAlert("Iltimos, barcha maxsulotlarni to'liq kiriting", "warning");
            return;
        }

        const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);
        const newOrder = { ...order, id: order?.id || generateUniqueId(), orderDate: orderDate.toISOString().split('T')[0], discountPercent, items };
        onClose(newOrder);
    };

    const deleteItem = (index) => {
        if (items.length > 1) {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
        } else {
            showCustomAlert("Kamida bitta mahsulot qolishi kerak", "error");
        }
    };

    const showCustomAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setShowAlert(true);
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => onClose(null)}
            style={customStyles}
        >
            <div className="modalContainer">
                <Typography variant="h6" className="headerText">Sanani tanlang:</Typography>

                <DatePicker
                    selected={orderDate}
                    onChange={(date) => setOrderDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="input"
                />

                <TextField
                    label="Chegirma (%)"
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <div className="itemsContainer">
                    {items.map((item, index) => (
                        <div key={index} className="inputWrapper">
                            <TextField
                                label="Maxsulot nomi"
                                value={item.item}
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].item = e.target.value;
                                    setItems(newItems);
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Narxi"
                                type="number"
                                value={item.price} // Apply formatting
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].price = e.target.value;
                                    setItems(newItems);
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <Select
                                value={item.isGift.toString()} // Convert boolean to string for select
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].isGift = e.target.value === 'true'; // Convert string back to boolean
                                    setItems(newItems);
                                }}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="true">Sovg'a</MenuItem>
                                <MenuItem value="false">Sotib olindi</MenuItem>
                            </Select>
                            <TextField
                                label="Xaridor ismi"
                                value={item.customer}
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].customer = e.target.value;
                                    setItems(newItems);
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <div className="buttonContainer">
                                <Button
                                    variant="contained"
                                    color='error'
                                    className='deleteButton'
                                    onClick={() => deleteItem(index)}
                                    startIcon={<FaRegTrashCan />}
                                >
                                    O'chirish
                                </Button>
                                {index === items.length - 1 && ( // Show add button only on the last item
                                    <Button
                                        className='addButton'
                                        variant="contained"
                                        color='warning'
                                        onClick={addItem}
                                        startIcon={<FaCartPlus />}
                                    >
                                        Maxsulot qo'shish
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="buttonGroup">
                    <Button
                        variant="contained"
                        color='success'
                        className='saveButton'
                        onClick={handleSave}
                        startIcon={<FaRegSave />}
                    >
                        Saqlash
                    </Button>
                    <Button
                        variant="contained"
                        className='closeButton'
                        onClick={() => onClose(null)}
                        startIcon={<IoExitOutline />}
                        color='secondary'
                    >
                        Yopish
                    </Button>
                </div>

                <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleAlertClose}>
                    <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </div>
        </Modal>
    );
};

const customStyles = {
    content: {
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: '0',
        marginLeft: '50%',
        width: "100%",
        transform: 'translate(-50%, 0)',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRadius: 0,
        padding: '20px',
        boxShadow: '0 -3px 20px #aaa',
    },
};

export default OrderModal;
