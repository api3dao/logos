import React from 'react';
import { SymbolLogo } from '@api3/logos';

const Header = () => {
    return (
        <div className="flex-col justify-center" style={{ width: '100%', height: '70px' }}>
            <header
                className="flex items-center justify-between shadow-md"
                style={{ padding: 16 }}
            >
                <div className="flex cursor-pointer" style={{ alignItems: 'flex-start', gap: 12 }}>
                    <img src={SymbolLogo('API3')} width={32} height={32} alt="API3" />
                    <span style={{ fontWeight: 300, fontSize: 20 }}>API3 Logos Viewer</span>
                </div>
                <div className="spacer" />
            </header>
        </div>
    );
};

export default Header;
