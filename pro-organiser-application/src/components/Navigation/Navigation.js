import React from 'react';
import {Link } from 'react-router-dom';
import '../Navigation/Navigation.css';

function Navigation() {
    
    const styleNav = {
        color : 'white',
        textDecoration : 'none'
    }

    return (
        <nav>
            <h1>Pro-Organizer</h1>
            <ul className="nav-links">
                <Link to="/" style={styleNav}>
                    <li>Home</li>
                </Link>
                <Link to="/createboard" style={styleNav} >
                    <li>Create a Board</li>
                </Link>
            </ul>
        </nav>
    )
}

export default Navigation
