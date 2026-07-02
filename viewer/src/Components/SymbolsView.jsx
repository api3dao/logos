import React from 'react';
import { SymbolLogo } from '@api3/logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import LogoCard from '../Custom/LogoCard';
import { dapis } from '@api3/dapi-management';

const SymbolsView = () => {
    const [symbol, setSymbol] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState(null);

    const getSymbols = () => {
        const supportedFeeds = dapis.filter((dapi) => dapi.stage !== 'retired').map((dapi) => dapi.name);
        const filteredFeeds = [...new Set(supportedFeeds.map((feed) => feed.split('/')).flat())];
        return filteredFeeds.filter((feed) => feed.toLowerCase().includes(symbol.toLowerCase()));
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Symbols</h1>
                <p className="page-subtitle">Logos for the price feed symbols supported by Api3.</p>
                <span className="stat-pill">{getSymbols().length} symbols</span>
            </div>

            <SearchRow text={symbol} setText={setSymbol} placeholder={'Enter a symbol'} />

            <div className="logo-grid">
                {getSymbols().map((feed, index) => (
                    <LogoCard
                        key={index}
                        label={feed}
                        lightSrc={SymbolLogo(feed, true)}
                        darkSrc={SymbolLogo(feed)}
                        onClick={() => setSelectedSymbol(feed)}
                    />
                ))}
            </div>

            {selectedSymbol ? (
                <InfoView method={'Symbol'} feed={selectedSymbol} onExit={() => setSelectedSymbol(null)} />
            ) : null}
        </div>
    );
};

export default SymbolsView;
