import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    TbHome2,
    TbCoin,
    TbLink,
    TbServer2,
    TbAlertTriangle,
    TbPuzzle,
    TbBook2,
    TbMenu2,
    TbX
} from 'react-icons/tb';
import { SymbolLogo } from '@api3/logos';

const NAV_ITEMS = [
    { to: '/', label: 'Home', icon: TbHome2, end: true },
    { to: '/symbols', label: 'Symbols', icon: TbCoin },
    { to: '/chains', label: 'Chains', icon: TbLink },
    { to: '/api-providers', label: 'API Providers', icon: TbServer2 },
    { to: '/missing-logos', label: 'Missing Logos', icon: TbAlertTriangle },
    { to: '/extensions', label: 'Extensions', icon: TbPuzzle },
    { to: '/docs', label: 'How to use', icon: TbBook2 }
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <div className="mobile-topbar">
                <div className="mobile-menu-button" onClick={() => setIsOpen(true)}>
                    <TbMenu2 size={20} />
                </div>
                <img src={SymbolLogo('API3')} width={24} height={24} alt="Api3" />
                <span className="sidebar-brand-title">Api3 Logos</span>
            </div>

            <div className={`sidebar-backdrop${isOpen ? ' open' : ''}`} onClick={() => setIsOpen(false)} />

            <div className={`sidebar${isOpen ? ' open' : ''}`}>
                <div className="flex items-center justify-between">
                    <NavLink to="/" className="sidebar-brand" onClick={() => setIsOpen(false)}>
                        <img src={SymbolLogo('API3')} width={30} height={30} alt="Api3" />
                        <div className="flex-col">
                            <span className="sidebar-brand-title">Api3 Logos</span>
                            <span className="sidebar-brand-subtitle">Viewer</span>
                        </div>
                    </NavLink>
                    <div className="sidebar-close" onClick={() => setIsOpen(false)}>
                        <TbX size={18} />
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="nav-link-icon">
                                <Icon size={18} />
                            </span>
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
