import React, { useState, useEffect } from 'react';
import { getOrders } from '../utils/storage';
import { formatNumber } from '../utils/numberFormatter';
import { Typography, Button, Container, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import TopBar from '../components/TopBar'; // Make sure to adjust the import path according to your file structure
import './styles/summary.css';
import { useNavigate } from 'react-router-dom';
import { FaDollarSign } from "react-icons/fa6";
import { IoGift, IoGiftOutline } from 'react-icons/io5';
import { RiDiscountPercentLine } from 'react-icons/ri';

const Summary = () => {
    const [orders, setOrders] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [filteredOrders, setFilteredOrders] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            const storedOrders = await getOrders();
            setOrders(storedOrders);
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter(order => {
            const orderDate = new Date(order.orderDate);
            const orderMonth = orderDate.getMonth() + 1;
            const orderYear = orderDate.getFullYear();
            return (selectedMonth ? orderMonth === selectedMonth : true) && orderYear === selectedYear;
        });
        setFilteredOrders(filtered);
    }, [selectedMonth, selectedYear, orders]);

    const calculateTotals = () => {
        return filteredOrders.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + parseFloat(item.price || '0'), 0);
        }, 0);
    };

    const calculateDiscount = () => {
        return filteredOrders.reduce((totalDiscount, order) => {
            const orderTotal = order.items.reduce((itemSum, item) => itemSum + parseFloat(item.price || '0'), 0);
            const discount = parseFloat(order.discountPercent || '0') / 100;
            const orderDiscount = orderTotal * discount;
            return totalDiscount + orderDiscount;
        }, 0);
    };

    const calculateProfitFromGifts = () => {
        return filteredOrders.reduce((totalProfit, order) => {
            return totalProfit + order.items.reduce((itemSum, item) => {
                return itemSum + (item.isGift ? parseFloat(item.price || '0') : 0);
            }, 0);
        }, 0);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(Number(e.target.value) || null);
    };

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        if (selectedMonth === null) {
            setSelectedMonth(currentMonth);
            setSelectedYear(currentYear);
        }
    }, [selectedMonth, selectedYear]);

    const isYearly = selectedMonth === 0;

    return (
        <div className="summary-page">
            <TopBar
                title="Hisobot"
                onBackPress={() => navigate('/')}
            />
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Yilni tanlang</InputLabel>
                            <Select
                                value={selectedYear}
                                onChange={handleYearChange}
                                label="Yilni tanlang"
                            >
                                <MenuItem value={2024}>2024</MenuItem>
                                <MenuItem value={2025}>2025</MenuItem>
                                <MenuItem value={2026}>2026</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Oyni tanlang</InputLabel>
                            <Select
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                label="Oyni tanlang"
                            >
                                <MenuItem value={0}>Yillik</MenuItem>
                                <MenuItem value={1}>Yanvar</MenuItem>
                                <MenuItem value={2}>Fevral</MenuItem>
                                <MenuItem value={3}>Mart</MenuItem>
                                <MenuItem value={4}>Aprel</MenuItem>
                                <MenuItem value={5}>May</MenuItem>
                                <MenuItem value={6}>Iyun</MenuItem>
                                <MenuItem value={7}>Iyul</MenuItem>
                                <MenuItem value={8}>Avgust</MenuItem>
                                <MenuItem value={9}>Sentabr</MenuItem>
                                <MenuItem value={10}>Oktabr</MenuItem>
                                <MenuItem value={11}>Noyabr</MenuItem>
                                <MenuItem value={12}>Dekabr</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <div className="summary-stats">
                    <Typography variant="h6"> <FaDollarSign style={{ color: 'gold' }} /> Umumiy narxi: ${formatNumber(calculateTotals())}</Typography>
                    <Typography variant="h6"> <IoGiftOutline style={{ color: 'green' }} /> Sovg'adan foyda: ${formatNumber(calculateProfitFromGifts())}</Typography>
                    <Typography variant="h6"> <RiDiscountPercentLine style={{ color: 'blue' }} /> Chegirma: ${formatNumber(calculateDiscount())}</Typography>
                </div>

                <div className="orders-list">
                    {filteredOrders.map((order, index) => (
                        <div key={index} className="order-item">
                            <div className="order-header">
                                <Typography variant="body1"> Sana: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                                <Typography variant="body1"> <RiDiscountPercentLine size={20} style={{ margin: '0 0 -5px', }} /> {order.discountPercent}</Typography>
                            </div>
                            <div className='order-body'>
                                {
                                    order.items.map((item, idx) => (
                                        <div
                                            key={idx} 
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                        >
                                            <Typography fontWeight='bold'>
                                                {item.item} {item.customer && `---> (${item.customer})`}
                                            </Typography>
                                            <Typography> 
                                                {item.isGift && <IoGift style={{color: 'green', marginRight: 5}} /> }
                                                ${formatNumber(item.price)}
                                            </Typography>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default Summary;
