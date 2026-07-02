import React from 'react';
import { SymbolLogo } from '@api3/logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import { dapis } from '@api3/dapi-management';

const SymbolsView = () => {
    const [symbol, setSymbol] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState('');

    const getSymbols = () => {
        const supportedFeeds = dapis.filter((dapi) => dapi.stage !== 'retired').map((dapi) => dapi.name);
        const filteredFeeds = [...new Set(supportedFeeds.map((feed) => feed.split('/')).flat())];
        return filteredFeeds.filter((feed) => feed.toLowerCase().includes(symbol.toLowerCase()));
    };

    return (
        <div
            className="flex flex-wrap items-center justify-center"
            style={{ padding: 12, gap: 12, backgroundColor: 'white' }}
        >
            <div className="flex" style={{ width: '100%' }}>
                <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>
                    There is a total of {getSymbols().length} symbols
                </span>
            </div>
            <SearchRow text={symbol} setText={setSymbol} placeholder={'Enter a symbol'} />

            {getSymbols().map((feed, index) => {
                return (
                    <div
                        className="card"
                        key={index}
                        style={{ padding: 12, width: 310, height: 80 }}
                        onMouseDown={() => setSelectedSymbol(feed)}
                    >
                        {selectedSymbol !== feed ? (
                            <>
                                <img
                                    src={SymbolLogo(feed, true)}
                                    width={50}
                                    height={50}
                                    style={{ backgroundColor: 'white', padding: 8 }}
                                    alt={feed}
                                />
                                <img
                                    src={SymbolLogo(feed)}
                                    width={50}
                                    height={50}
                                    style={{ backgroundColor: 'black', padding: 8 }}
                                    alt={feed}
                                />
                                <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 8 }}>{feed}</span>
                            </>
                        ) : (
                            <InfoView method={'Symbol'} feed={feed} onExit={() => setSelectedSymbol(null)} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SymbolsView;
