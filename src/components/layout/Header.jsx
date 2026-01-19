import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/constants';
import './Header.scss';

const Header = ({ showBack = false, title = '' }) => {
    return (
        <header className="header">
            <div className="header__container">
                {showBack ? (
                    <Link to={ROUTES.HOME} className="header__back">
                        ← 뒤로
                    </Link>
                ) : (
                    <Link to={ROUTES.HOME} className="header__logo">
                        <span className="header__logo-icon">🐯</span>
                        <span className="header__logo-text">한경 워드퍼즐</span>
                    </Link>
                )}

                {title && <h1 className="header__title">{title}</h1>}

                <div className="header__spacer" />
            </div>
        </header>
    );
};

export default Header;
