/* eslint-disable react/prop-types */
import React from 'react';
import { getChains } from '@api3/dapi-management';
import {
    SymbolLogoMissing,
    SymbolLogo,
    ApiProviderLogoMissing,
    ApiProviderLogo,
    ChainLogoMissing,
    ChainLogo
} from '@api3/logos';

const MissingBatchView = ({ header, batch, method }) => {
    const getChain = (chainId) => {
        const chains = getChains();
        const targetChain = chains.find((chainObject) => chainObject.id === chainId);
        return targetChain ? targetChain.alias + ' (' + chainId + ')' : 'Unknown Chain';
    };

    return batch.length === 0 ? null : (
        <>
            <h2 className="section-heading">
                {header} <span className="logo-card-meta">({batch.length})</span>
            </h2>
            <div className="logo-grid">
                {batch.map((item, index) => (
                    <div className="logo-card" key={index} style={{ cursor: 'default' }}>
                        <div className="logo-card-thumbs">
                            <div className="logo-card-thumb" style={{ backgroundColor: 'white' }}>
                                <img src={method(item)} width={28} height={28} alt={item} />
                            </div>
                        </div>
                        <span className="logo-card-label">{header === 'Chains' ? getChain(item) : item}</span>
                    </div>
                ))}
            </div>
        </>
    );
};

const MissingLogosView = () => {
    const totalMissing = SymbolLogoMissing.length + ApiProviderLogoMissing.length + ChainLogoMissing.length;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Missing Logos</h1>
                <p className="page-subtitle">
                    Symbols, chains and API providers referenced in @api3/dapi-management without a matching logo.
                </p>
                <span className="stat-pill">{totalMissing} missing</span>
            </div>

            {totalMissing === 0 ? <p className="page-subtitle">There are no missing logos.</p> : null}
            <MissingBatchView header={'Symbols'} batch={SymbolLogoMissing} method={SymbolLogo} />
            <MissingBatchView header={'ApiProviders'} batch={ApiProviderLogoMissing} method={ApiProviderLogo} />
            <MissingBatchView header={'Chains'} batch={ChainLogoMissing} method={ChainLogo} />
        </div>
    );
};

export default MissingLogosView;
