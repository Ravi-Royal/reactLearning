import { Link } from 'react-router-dom';

function BaseNavigation() {
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
                <li>
                    <Link className="text-blue-600 hover:underline px-2 py-1 rounded" to="/stock">Stock</Link>
                </li>
            </ul>
        </nav>
    );
}

export default BaseNavigation;