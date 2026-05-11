import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../app/features/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = React.useState(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate('/');
    };

    return (
        <>
            <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm bg-white">
                <a href="/">
                    <img src="/logo.svg" alt="logo" className='h-11 w-auto' />
                </a>

                <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                    <a href="/" className="hover:text-green-600 transition">Home</a>
                    <a href="/#features" className="hover:text-green-600 transition">Features</a>
                    <a href="/#testimonials" className="hover:text-green-600 transition">Testimonials</a>
                    <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
                </div>

                <div className="flex gap-2">
                    <Link to='/app?state=register' className="hidden md:block px-6 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white" hidden={user}>
                        Get started
                    </Link>
                    <Link to='/app?state=login' className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900" hidden={user}>
                        Login
                    </Link>
                    <Link to='/app' className='hidden md:block px-8 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white' hidden={!user}>
                        Dashboard
                    </Link>
                    <button onClick={handleLogout} className='hidden md:block px-6 py-2 border border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700 active:scale-95 transition-all rounded-full text-red-600' hidden={!user}>
                        Logout
                    </button>
                </div>

                <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu">
                        <path d="M4 5h16M4 12h16M4 19h16" />
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <a href="/" className="text-white">Home</a>
                <a href="/#features" className="text-white">Features</a>
                <a href="/#testimonials" className="text-white">Testimonials</a>
                <Link to="/contact" className="text-white">Contact</Link>
                {user && (
                    <>
                        <Link to='/app' className="text-green-400">Dashboard</Link>
                        <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-400">
                            Logout
                        </button>
                    </>
                )}
                <button onClick={() => setMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-md flex">
                    X
                </button>
            </div>
        </>
    );
};

export default Navbar;
