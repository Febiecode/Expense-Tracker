import { useState, useEffect } from 'react';
import api from '../api/api';
import { useRouter } from 'next/router';
import '../app/globals.css'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            router.push('/dailytransactions');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/auth/login', { username, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            router.push('/dailytransactions');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="container mx-auto mt-[10%] px-4 ">
            <h1 className="text-4xl text-center"><a href='/'>Expense Tracker</a></h1>
            <h2 className="text-2xl text-center">Login</h2>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-4">
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-950"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded  text-gray-950"
                    />
                </div>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                    Login
                </button>
                <p className='text-center mt-4' >Create an account? <a href='/register' className='text-blue-500 underline'>Register</a></p>
            </form>
        </div>
    );
}
