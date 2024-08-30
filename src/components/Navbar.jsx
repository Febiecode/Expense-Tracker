import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto">
                <Link href="/">
                    <p className="text-white font-bold">Expense Tracker</p>
                </Link>
                <div className="ml-auto">
                    <Link href="/login">
                        <p className="text-gray-300 hover:text-white ml-4">Login</p>
                    </Link>
                    <Link href="/register">
                        <p className="text-gray-300 hover:text-white ml-4">Register</p>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
