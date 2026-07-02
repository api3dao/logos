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
import Title from '../Custom/Title';

const ExtensionsBatchView = ({ header, batch, method }) => {
    const getChain = (chainId) => {
        const chains = getChains();
        const targetChain = chains.find((chainObject) => chainObject.id === chainId);
        return targetChain ? targetChain.alias + ' (' + chainId + ')' : 'Unknown Chain';
    };

    return batch.length === 0 ? null : (
        <div className="flex flex-wrap items-center justify-center" style={{ gap: 12, backgroundColor: 'white' }}>
            <div className="flex-col text-left" style={{ width: '100%' }}>
                <Title header={header} />
                <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>
                    There is a total of {batch.length} extended {header} logos
                </span>
            </div>

            {batch.map((item, index) => {
                return (
                    <div
                        className="flex items-center justify-start cursor-pointer shadow-md"
                        key={index}
                        style={{ padding: 12, width: 300, height: 70, backgroundColor: 'var(--color-gray-100)' }}
                    >
                        <img src={method(item)} width={32} height={32} alt={item} />
                        <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 8 }}>
                            {header === 'Chains' ? getChain(item) : item}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const ExtensionsView = () => {
    const checkIfExtendedLogos = () => {
        return SymbolLogoExtended.length + ApiProviderLogoExtended.length + ChainLogoExtended.length;
    };

    return (
        <div
            className="flex flex-wrap items-center justify-start"
            style={{ padding: 12, gap: 12, backgroundColor: 'white' }}
        >
            {checkIfExtendedLogos() === 0 ? (
                <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>There is no extended logos</span>
            ) : null}
            <ExtensionsBatchView header={'Symbols'} batch={SymbolLogoExtended} method={SymbolLogo} />
            <ExtensionsBatchView header={'ApiProviders'} batch={ApiProviderLogoExtended} method={ApiProviderLogo} />
            <ExtensionsBatchView header={'Chains'} batch={ChainLogoExtended} method={ChainLogo} />
        </div>
    );
};

export default ExtensionsView;
