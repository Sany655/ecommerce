import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextArea({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const area = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            area.current.focus();
        }
    }, []);

    return (
        <textarea {...props}
            type={type}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={area}></textarea>
    );
});
