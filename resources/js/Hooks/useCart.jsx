import axios from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        axios.get(route('cart.show'))
            .then(response => {
                setCart(response.data.cart || []);
            })
            .catch(error => console.error('Error fetching cart:', error))
            .finally(() => setCartLoading(false));
    }, []);


    const addToCart = async (item, changedQuantity = null, itemPrice = 0) => {
        setCartLoading(true);
        itemPrice = itemPrice === 0 ? item.discount_price || item.price : itemPrice;
        try {
            const doesExistInCart = cart.find(c => c.product_id === item.id);
            const updatedQuantity = doesExistInCart ? doesExistInCart.quantity + 1 : 1;
            const finalQuantity = changedQuantity || updatedQuantity;
            const data = { product_id: item.id, quantity: finalQuantity, price: itemPrice };
            const response = await axios.post(route('cart.add'), data);
            setCart([...response.data.cart]);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setCartLoading(false);
        }
    };

    const removeFromCart = (itemId) => {
        setCartLoading(true);
        setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
        axios.delete(route('cart.remove', itemId))
            .catch(error => console.error('Error removing from cart:', error))
            .finally(() => setCartLoading(false));
    };

    const clearCart = () => {
        setCartLoading(true);
        setCart([]);
        axios.delete(route('cart.delete'))
            .catch(error => console.error('Error clearing cart:', error))
            .finally(() => setCartLoading(false));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartLoading }}>
            {children}
        </CartContext.Provider>
    );
};

export default () => {
    return useContext(CartContext)
}
