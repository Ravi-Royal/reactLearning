import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

function Navigation() {
    return (
        <nav className={styles.navigation}>
            <ul>
                <Link className={styles.link} to="/">Home</Link>
                <Link className={styles.link} to="/about">About</Link>
            </ul>
        </nav>
    );
}

export default Navigation;