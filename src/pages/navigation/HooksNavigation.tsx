import { Link } from "react-router-dom";

function HooksNavigation() {
    return (
        <div>
            <h2 className="font-bold">Hooks Navigation Page</h2>
            <nav className="flex gap-4 my-4">
                <Link className="text-blue-500 hover:text-blue-700" to="useState">useState</Link>
            </nav>
        </div>
    )
}

export default HooksNavigation;