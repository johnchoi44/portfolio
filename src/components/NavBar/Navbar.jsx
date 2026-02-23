import React, { useState } from 'react'

import styles from "./Navbar.module.css"
import { getImageUrl } from "../../utils"



const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <a className={styles.title} href="/">
                John Choi
            </a>
            <div className={styles.menu}>
                <img 
                    className={styles.menuBtn} 
                    src={
                        menuOpen
                            ? getImageUrl("nav/closeIcon.png")
                            : getImageUrl("nav/menuIcon.png")
                    } 
                    alt="menu-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                />
                <ul
                    className={`${styles.menuItems} ${menuOpen && styles.menuOpen}`}
                    onClick={() => setMenuOpen(false)}
                >

                    <li>
                        <a onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</a>
                    </li>
                    <li>
                        <a onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}>Experience</a>
                    </li>
                    <li>
                        <a onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>Projects</a>
                    </li>
                    <li>
                        <a onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
