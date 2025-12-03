import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

function BaseNavigation() {
    return (
        <nav className={`${styles.navigation} p-0`}>
            <ul className="p-0">
            <Link className={styles.link} to="/home">Home</Link>
            <Link className={styles.link} to="/about">About</Link>
            <Link className={styles.link} to="/hooks">Hooks</Link>
            <Link className={styles.link} to="/stock">Stock</Link>
            </ul>
        </nav>
    );
}

export default BaseNavigation;