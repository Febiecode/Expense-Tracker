import api from '../api/api';

const DeleteTransactionForm = ({ transaction, onClose, onTransactionDeleted }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

    const handleDelete = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await api.delete(`/api/transactions/${transaction._id}`, config);
            onTransactionDeleted(); // Refresh transactions after deleting
            onClose(); // Close the form
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('There was an error deleting the transaction. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded text-gray-950">
                <h2 className="text-2xl mb-4 text-gray-950">Delete Transaction</h2>
                <p className="mb-4 text-gray-950">Are you sure you want to delete this transaction?</p>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-4 rounded"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTransactionForm;
