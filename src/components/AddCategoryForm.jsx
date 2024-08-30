import { useState, useEffect } from 'react';
import api from '../api/api';

const AddCategoryForm = ({ onClose, onCategoryAdded }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
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
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await api.post('/api/categories', { name: categoryName }, config);
            onCategoryAdded(); // Refresh category list after adding a new one
            onClose(); // Close the form
        } catch (error) {
            alert('Duplicate should be allowed');
            console.error('Error adding category:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
            <div className="bg-white p-8 rounded w-full md:w-1/2 ">
                <h2 className="text-2xl mb-4">Add New Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Category Name</label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
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

                <div className='my-5  '>
                    
                    {categories && categories.length > 0 ? (
                        <table className="border-collapse border border-gray-400 overflow-y-scroll h-[300px] block table-fixed w-full">
                        <thead>
                            <tr>
                                <th className="p-2 border border-gray-300 text-gray-950 w-[10%]">S.No.</th>
                                <th className="p-2 border border-gray-300 text-gray-950 w-[90%]">Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category._id}>
                                    <td className="p-2 border border-gray-300 text-gray-950 text-center">{index + 1}</td>
                                    <td className="p-2 border border-gray-300 text-gray-950 text-center">{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    ):(
                        <div>
                            <h3 className='text-gray-950'>Add New Category</h3>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default AddCategoryForm;
