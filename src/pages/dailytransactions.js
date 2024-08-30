import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../api/api';
import AddTransactionForm from '../components/AddTransactionForm';
import EditTransactionForm from '../components/EditTransactionForm';
import DeleteTransactionForm from '../components/DeleteTransactionForm';
import AddCategoryForm from '../components/AddCategoryForm';
import '../app/globals.css';

export default function dailytransactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showEditTransactionForm, setShowEditTransactionForm] = useState(false);
    const [showDeleteTransactionForm, setShowDeleteTransactionForm] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const router = useRouter();

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

    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setShowEditTransactionForm(true);
    };

    const handleDelete = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDeleteTransactionForm(true);
    };

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        } else {
            router.push('/login');
        }
    }, []);

    useEffect(() => {
        if (userInfo) {
            const fetchTransactions = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await api.get('/api/transactions', config);
                    setTransactions(data);
                } catch (error) {
                    console.error('Error fetching transactions:', error);
                }
            };

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

            fetchTransactions();
            fetchCategories();
        }
    }, [userInfo]);

    const handleTransactionAddedOrUpdated = () => {
        if (userInfo) {
            const fetchTransactions = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await api.get('/api/transactions', config);
                    setTransactions(data);
                } catch (error) {
                    console.error('Error fetching transactions:', error);
                }
            };
            fetchTransactions();
        }
    };

    const handleCategoryAdded = () => {
        if (userInfo) {
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
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <div className="container mx-auto mt-8 p-4">
            <h2 className="text-2xl text-center">Dashboard</h2>

            {userInfo && (
                <div className="flex justify-between mb-4">
                    <p>{userInfo.username}</p>
                    <button
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
            <div className="flex justify-end  mb-4">
                <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 ml-2"
                    onClick={() => setShowTransactionForm(true)}
                >
                    Add Transaction
                </button>
                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 ml-2"
                    onClick={() => setShowCategoryForm(true)}
                >
                    Add Category
                </button>
            </div>
            <div className='overflow-x-auto'>
                <table className="w-full border-collapse border border-gray-400 ">
                    <thead>
                        <tr>
                            <th className="p-2 border border-gray-300">Date/Day/Time</th>
                            <th className="p-2 border border-gray-300">Amount</th>
                            <th className="p-2 border border-gray-300">Category</th>
                            <th className="p-2 border border-gray-300">Remark</th>
                            <th className="p-2 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td className="p-2 border border-gray-300">{getDate(transaction.dateCreated) + ' ' + getDay(transaction.dateCreated) + ' ' + getTime(transaction.dateCreated)}</td>
                                <td className="p-2 border border-gray-300">{transaction.amount}</td>
                                <td className="p-2 border border-gray-300">{transaction.category?.name}</td>
                                <td className="p-2 border border-gray-300">{transaction.remark}</td>
                                <td className="p-2 border border-gray-300 ">
                                    <div className='flex flex-col md:flex-row items-center justify-center gap-2'>
                                        <button
                                            className="bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-700 mr-2 "
                                            onClick={() => handleEdit(transaction)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white font-bold py-1 px-2 rounded hover:bg-red-700"
                                            onClick={() => handleDelete(transaction)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showTransactionForm && (
                <AddTransactionForm
                    onClose={() => setShowTransactionForm(false)}
                    onTransactionAdded={handleTransactionAddedOrUpdated}
                />
            )}
            {showCategoryForm && (
                <AddCategoryForm
                    onClose={() => setShowCategoryForm(false)}
                    onCategoryAdded={handleCategoryAdded}
                />
            )}
            {showEditTransactionForm && selectedTransaction && (
                <EditTransactionForm
                    transaction={selectedTransaction}
                    onClose={() => setShowEditTransactionForm(false)}
                    onTransactionUpdated={handleTransactionAddedOrUpdated}
                />
            )}
            {showDeleteTransactionForm && selectedTransaction && (
                <DeleteTransactionForm
                    transaction={selectedTransaction}
                    onClose={() => setShowDeleteTransactionForm(false)}
                    onTransactionDeleted={handleTransactionAddedOrUpdated}
                />
            )}
        </div>
    );
}
