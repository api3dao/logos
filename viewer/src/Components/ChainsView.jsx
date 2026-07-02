import React from 'react';
import { ChainLogo } from '@api3/logos';
import { getChains, api3Contracts } from '@api3/dapi-management';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import LogoCard from '../Custom/LogoCard';

const getSupportedChains = (isTestnet, searchArg) => {
    const supportedChainIds = getChains()
        .filter((chain) => chain.stage !== 'retired')
        .filter((chain) =>
            searchArg ? chain.alias.includes(searchArg.toLowerCase()) || chain.id.includes(searchArg) : true
        )
        .map((chain) => chain.id);
    return api3Contracts.CHAINS.filter((chain) => supportedChainIds.includes(chain.id) && chain.testnet === isTestnet);
};

// eslint-disable-next-line react/prop-types
const ChainList = ({ isTestnet, searchArg, onSelect }) => {
    return (
        <div className="logo-grid">
            {getSupportedChains(isTestnet, searchArg).map((chain, index) => (
                <LogoCard
                    key={index}
                    label={chain.name}
                    meta={chain.id}
                    lightSrc={ChainLogo(chain.id, true)}
                    darkSrc={ChainLogo(chain.id)}
                    onClick={() => onSelect(chain)}
                />
            ))}
        </div>
    );
};

const ChainsView = () => {
    const [searchArg, setSearchArg] = useState('');
    const [selectedChain, setSelectedChain] = useState(null);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Chains</h1>
                <p className="page-subtitle">Logos for the mainnet and testnet chains supported by Api3.</p>
                <span className="stat-pill">
                    {getSupportedChains(false).length} mainnets · {getSupportedChains(true).length} testnets
                </span>
            </div>

            <SearchRow text={searchArg} setText={setSearchArg} placeholder={'Enter a chain id or chain name'} />

            <h2 className="section-heading">Mainnets</h2>
            <ChainList isTestnet={false} searchArg={searchArg} onSelect={setSelectedChain} />

            <h2 className="section-heading">Testnets</h2>
            <ChainList isTestnet={true} searchArg={searchArg} onSelect={setSelectedChain} />

            {selectedChain ? (
                <InfoView method={'Chain'} feed={selectedChain.id} onExit={() => setSelectedChain(null)} />
            ) : null}
        </div>
    );
};

export default ChainsView;
