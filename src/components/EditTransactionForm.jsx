import { useState, useEffect } from 'react';
import api from '../api/api';

const EditTransactionForm = ({ transaction, onClose, onTransactionUpdated }) => {
    const [amount, setAmount] = useState(transaction.amount || '');
    const [remark, setRemark] = useState(transaction.remark || '');
    const [category, setCategory] = useState(transaction.category?._id || '');
    const [categories, setCategories] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

    function getDate(timestamp) {
        const dateObject = new Date(timestamp);
        return dateObject.toLocaleDateString(); // Returns the date in the format "MM/DD/YYYY" or similar
    }

    function getDay(timestamp) {
        const dateObject = new Date(timestamp);
        return dateObject.toLocaleDateString('en-US', { weekday: 'long' }); // Returns the full day name, e.g., "Friday"
    }

    function getTime(timestamp) {
        const dateObject = new Date(timestamp);
        return dateObject.toLocaleTimeString(); // Returns the time in the format "HH:MM:SS AM/PM" or similar
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await api.get('/api/categories', config);
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await api.put(`/api/transactions/${transaction._id}`, { amount, category, remark }, config);
            onTransactionUpdated(); // Refresh transactions after editing
            onClose(); // Close the form
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('There was an error updating the transaction. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded">
                <h2 className="text-2xl mb-4 text-gray-950">Edit Transaction</h2>
                <div className='flex flex-col gap-1 my-3'>
                    <span className='text-gray-950 text-sm'>Date: {getDate(transaction.dateCreated)}</span>
                    <span className='text-gray-950 text-sm'>Day: {getDay(transaction.dateCreated)}</span>
                    <span className='text-gray-950 text-sm'>Time: {getTime(transaction.dateCreated)}</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-gray-950"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <select
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-gray-950"
                            required
                        >
                            <option value="">Select Category</option>
                            {Array.isArray(categories) && categories.length > 0 ? (
                                categories.map((cat) => (
                                    <option key={cat._id} value={cat._id} className='text-gray-950'>
                                        {cat.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    No categories available
                                </option>
                            )}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Remarks</label>
                        <input
                            type="text"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded text-gray-950"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionForm;
