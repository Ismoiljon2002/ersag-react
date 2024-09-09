const ORDER_STORAGE_KEY = 'orders';

// Function to save orders to localStorage
export const saveOrders = (orders) => {
    try {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
        console.error('Error saving orders:', error);
    }
};

// Function to retrieve orders from localStorage
export const getOrders = () => {
    try {
        const orders = localStorage.getItem(ORDER_STORAGE_KEY);
        return orders ? JSON.parse(orders) : [];
    } catch (error) {
        console.error('Error retrieving orders:', error);
        return [];
    }
};

// Function to clear orders from localStorage (optional)
export const clearOrders = () => {
    try {
        localStorage.removeItem(ORDER_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing orders:', error);
    }
};
