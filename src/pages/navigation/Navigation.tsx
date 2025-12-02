import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

function Navigation() {
    return (
        <nav className={`${styles.navigation} p-0`}>
            <ul className="p-0">
            <Link className={styles.link} to="/home">Home</Link>
            <Link className={styles.link} to="/about">About</Link>
            </ul>
        </nav>
    );
}

export default Navigation;