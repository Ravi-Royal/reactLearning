import { Link } from "react-router-dom";

function HooksNavigation() {
    return (
        <div>
            <h2 className="font-bold">Hooks Navigation Page</h2>
            <nav className="flex gap-4 my-4">
                <ol className="list-decimal pl-5">
                    <li>
                        <Link className="text-blue-500 hover:text-blue-700" to="useState">useState</Link>
                    </li>
                    <li>
                        <Link className="text-blue-500 hover:text-blue-700" to="useEffect">useEffect</Link>
                    </li>
                </ol>
            </nav>
        </div>
    )
}

export default HooksNavigation;