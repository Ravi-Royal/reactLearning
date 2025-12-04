import { useState } from 'react';
import { Link } from 'react-router-dom';

function BaseNavigation() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-green-200 p-2 rounded">
            <ul className="flex gap-3 items-center">
                <li>
                    <Link className="text-blue-600 hover:underline px-2 py-1 rounded" to="/home">Home</Link>
                </li>
                <li>
                    <Link className="text-blue-600 hover:underline px-2 py-1 rounded" to="/about">About</Link>
                </li>
                <li>
                    <Link className="text-blue-600 hover:underline px-2 py-1 rounded" to="/hooks">Hooks</Link>
                </li>

                <li
                    className="relative"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    <button
                        onClick={() => setOpen((s) => !s)}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') setOpen(true);
                        }}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        className="text-blue-600 hover:underline px-2 py-1 rounded inline-flex items-center"
                    >
                        Stock <span className="ml-1">▾</span>
                    </button>

                    <div
                        className={`absolute left-0 bg-white border border-gray-200 shadow-md min-w-[160px] z-50 ${open ? 'block' : 'hidden'}`}
                        role="menu"
                        aria-hidden={!open}
                    >
                        <Link className="block px-3 py-2 text-gray-700 hover:bg-gray-100" to="/stock" onClick={() => setOpen(false)}>Stock P&L Data</Link>
                        <Link className="block px-3 py-2 text-gray-700 hover:bg-gray-100" to="/stock/favs" onClick={() => setOpen(false)}>My Fav List Stock</Link>
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default BaseNavigation;