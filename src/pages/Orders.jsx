import React, { useState, useEffect } from 'react';
import { Fab, Button, Alert, IconButton, Typography, Box, Grid, Card, CardContent, CardActions, Container } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Bookmark as BookmarkIcon, CardGiftcard as GiftIcon } from '@mui/icons-material';
import TopBar from '../components/TopBar';
import OrderModal from '../components/OrderModal';
import { getOrders, saveOrders } from '../utils/storage';
import { formatNumber } from '../utils/numberFormatter';
import './styles/orders.css';
import { IoGift } from 'react-icons/io5';

const Orders = ({ history }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const storedOrders = await getOrders();
            setOrders(storedOrders);
        };
        fetchOrders();
    }, []);

    const handleAddOrder = () => {
        setSelectedOrder(null);
        setModalVisible(true);
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleDeleteOrder = (id) => {
        setAlertMessage({
            type: 'warning',
            text: "Bu buyurtmani o'chirishni xohlaysizmi?",
            onConfirm: () => deleteOrder(id),
        });
    };

    const deleteOrder = async (id) => {
        const updatedOrders = orders.filter((order) => order.id !== id);
        setOrders(updatedOrders);
        await saveOrders(updatedOrders);
        setAlertMessage({
            type: 'success',
            text: 'Buyurtma muvaffaqiyatli o‘chirildi.',
        });
    };

    const handleCloseModal = async (newOrder) => {
        setModalVisible(false);
        if (newOrder) {
            const updatedOrders = selectedOrder
                ? orders.map((order) => (order.id === selectedOrder.id ? newOrder : order))
                : [...orders, newOrder];
            setOrders(updatedOrders);
            await saveOrders(updatedOrders);
        }
    };

    const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const formatOrderDate = (date) => {
        if (!date) return "Noma'lum sana";
        const parsedDate = new Date(date);
        return parsedDate.toISOString().split('T')[0];
    };

    // Automatically hide the alert after 3 seconds
    useEffect(() => {
        if (alertMessage) {
            const timeout = setTimeout(() => {
                setAlertMessage(null);
            }, 3000); // 3 seconds timeout

            return () => clearTimeout(timeout); // Clean up the timeout if component is unmounted or alertMessage changes
        }
    }, [alertMessage]);

    return (
        <Box sx={{ fontFamily: 'Roboto' }}>
            <TopBar
                title="Buyurtmalarim"
                onAddPress={handleAddOrder}
                onFilterPress={() => history.push('/month-selection')}
            />

            {alertMessage && (
                <Alert
                    style={{
                        position: 'absolute',
                        zIndex: 99,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 350
                    }}
                    severity={alertMessage.type}
                    action={
                        <Button color="inherit" size="small" onClick={alertMessage.onConfirm}>
                            Tasdiqlash
                        </Button>
                    }
                >
                    {alertMessage.text}
                </Alert>
            )}

            <Container style={{ paddingTop: 70 }}>
                {sortedOrders.map((item, index) => (
                    <Card style={{ margin: '15px 0' }} key={item.id}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">
                                    <BookmarkIcon sx={{ mr: 1 }} /> {formatNumber(sortedOrders.length - index)}-buyurtma
                                </Typography>

                                <CardActions>
                                    <IconButton onClick={() => handleEditOrder(item)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOrder(item.id)}>
                                        <DeleteIcon style={{ color: 'red' }} />
                                    </IconButton>
                                </CardActions>
                            </Box>
                            <Typography color="textSecondary" fontStyle="italic">
                                Buyurtma sanasi: {formatOrderDate(item.orderDate)}
                            </Typography>
                            <Box>
                                {item.items.map((item, index) => (
                                    <Box key={item.id} display="flex" justifyContent="space-between">
                                        <Typography fontWeight="bold">
                                            {index + 1}. {item.item}
                                            {item.customer && ` ---> (${item.customer})`}
                                        </Typography>
                                        <Typography>
                                            {item.isGift && <IoGift style={{ color: 'green', marginRight: 5 }} />}
                                            ${formatNumber(item.price)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Container>

            <OrderModal isOpen={modalVisible} onClose={handleCloseModal} order={selectedOrder} />

            <Fab
                color="primary"
                aria-label="add"
                onClick={handleAddOrder}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default Orders;
