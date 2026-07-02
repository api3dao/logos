/* eslint-disable react/prop-types */
import React from 'react';
import { getChains } from '@api3/dapi-management';
import {
    SymbolLogoExtended,
    SymbolLogo,
    ApiProviderLogoExtended,
    ApiProviderLogo,
    ChainLogoExtended,
    ChainLogo
} from '@api3/logos';

const ExtensionsBatchView = ({ header, batch, method }) => {
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

const ExtensionsView = () => {
    const totalExtended = SymbolLogoExtended.length + ApiProviderLogoExtended.length + ChainLogoExtended.length;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Extensions</h1>
                <p className="page-subtitle">
                    Symbols, chains and API providers with a logo that goes beyond the base @api3/logos set.
                </p>
                <span className="stat-pill">{totalExtended} extended</span>
            </div>

            {totalExtended === 0 ? <p className="page-subtitle">There are no extended logos.</p> : null}
            <ExtensionsBatchView header={'Symbols'} batch={SymbolLogoExtended} method={SymbolLogo} />
            <ExtensionsBatchView header={'ApiProviders'} batch={ApiProviderLogoExtended} method={ApiProviderLogo} />
            <ExtensionsBatchView header={'Chains'} batch={ChainLogoExtended} method={ChainLogo} />
        </div>
    );
};

export default ExtensionsView;
