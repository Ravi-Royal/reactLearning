import { Link } from "react-router-dom";

function StockNavigation() {
    return (
        <div>
            <h2 className="font-bold">Stock Analysis Navigation Page</h2>
            <nav className="flex gap-4 my-4">
                <ol className="list-decimal pl-5">
                    <li>
                        <Link className="text-blue-500 hover:text-blue-700" to="analysis">Stock P&L Analysis</Link>
                    </li>
                    <li>
                        <Link className="text-blue-500 hover:text-blue-700" to="favorites">My Favorite Stocks</Link>
                    </li>
                </ol>
            </nav>
        </div>
    )
}

export default StockNavigation;