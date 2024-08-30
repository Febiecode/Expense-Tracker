import { useState, useEffect } from 'react';
import api from '../api/api';

const AddTransactionForm = ({ onClose, onTransactionAdded }) => {
    const [amount, setAmount] = useState('');
    const [remark, setRemark] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

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

            await api.post('/api/transactions', { amount, category, remark }, config);
            onTransactionAdded(); // Refresh transactions after adding a new one
            onClose(); // Close the form
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('There was an error adding the transaction. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded w-full md:w-1/2">
                <h2 className="text-2xl mb-4 text-gray-950">Add New Transaction</h2>
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
                            <option value="" className='text-gray-950'>Select Category</option>
                            {Array.isArray(categories) && categories.length > 0 ? (
                                categories.map((cat) => (
                                    <option key={cat._id} value={cat._id} className='text-gray-950'>
                                        {cat.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled className='text-gray-950'>
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
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionForm;
