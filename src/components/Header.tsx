import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@iota/dapp-kit';

export const Header: React.FC = () => {
    const location = useLocation();
    const account = useCurrentAccount();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <span>📚</span>
                    </div>
                    Proof of Learning
                </Link>

                <nav className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Courses
                    </Link>
                    <Link
                        to="/certificates"
                        className={`nav-link ${isActive('/certificates') ? 'active' : ''}`}
                    >
                        My Certificates
                    </Link>
                </nav>

                <div className="wallet-section">
                    {account && (
                        <span className="wallet-address">
                            {account.address.slice(0, 6)}...{account.address.slice(-4)}
                        </span>
                    )}
                    <ConnectButton />
                </div>
            </div>
        </header>
    );
};
