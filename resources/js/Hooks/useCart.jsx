import axios from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
        cart_items: [],
        total_amount: 0,
        cart_token: '',
        coupon_id: null
    });
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(route('cart.show'));
                const cartData = response.data.cart || {
                    cart_items: [],
                    total_amount: 0,
                    cart_token: '',
                    coupon_id: null,
                };
                setCart(cartData);
            } catch (error) {
                console.error('Error fetching cart:', error.response.data);
            } finally {
                setCartLoading(false);
            }
        };

        fetchCart();
    }, []);

    const addToCart = async (item, changedQuantity = null, variants = null) => {
        setCartLoading(true);
        try {
            const existingCartItem = cart.cart_items?.find(c => c.product_id === item.id && JSON.stringify(c.variants) === JSON.stringify(variants));
            const newQuantity = existingCartItem ? existingCartItem.quantity + 1 : 1;
            const finalQuantity = changedQuantity || newQuantity;
            const subtotal = cart.cart_items;

            // Prepare data to send to the backend
            const data = {
                product_id: item.id,
                quantity: finalQuantity,
                variants: variants || item.variants || '[]',
                subtotal,
            };

            const response = await axios.post(route('cart.add'), data);
            const updatedCart = { ...response.data.cart };

            // Update the cart with new total amount and items
            // updatedCart.total_amount = updatedCart.cart_items?.reduce((sum, item) => sum + parseInt(item.price), 0);
            setCart(updatedCart);

        } catch (error) {
            console.error('Error adding to cart:', error.message);
        } finally {
            setCartLoading(false);
        }
    };

    const removeFromCart = async (itemId, variants = null) => {
        setCartLoading(true);
        if (cart.cart_items.length === 1) {
            clearCart();
            return;
        }
        try {
            await axios.delete(route('cart.remove', { itemId: itemId }));
            const updatedCartItems = cart.cart_items.filter(item => item.id !== itemId);
            const updatedCart = {
                ...cart,
                cart_items: updatedCartItems,
                total_amount: updatedCartItems.reduce((sum, item) => sum + parseInt(item.subtotal), 0)
            };

            setCart(updatedCart);

        } catch (error) {
            console.error('Error removing from cart:', error);
        } finally {
            setCartLoading(false);
        }
    };

    const clearCart = async () => {
        setCartLoading(true);
        try {
            await axios.delete(route('cart.delete'));
            setCart({
                cart_items: [],
                total_amount: 0,
                cart_token: '',
                coupon_id: null,
            });
        } catch (error) {
            console.error('Error clearing cart:', error.response.data.message);
        } finally {
            setCartLoading(false);
        }
    };

    const apply_coupon = (cId, disc, coupon) => {
        setCart({ ...cart, coupon_id: cId, total_amount: cart.total_amount - disc, coupon: coupon });
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartLoading, apply_coupon }}>
            {children}
        </CartContext.Provider>
    );
};

export default () => {
    return useContext(CartContext);
};
