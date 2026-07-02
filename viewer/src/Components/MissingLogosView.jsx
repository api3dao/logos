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
import Title from '../Custom/Title';

const MissingBatchView = ({ header, batch, method }) => {
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
                    There is a total of {batch.length} missing {header} logos
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

const MissingLogosView = () => {
    const checkIfMissingLogos = () => {
        return SymbolLogoMissing.length + ApiProviderLogoMissing.length + ChainLogoMissing.length;
    };

    return (
        <div
            className="flex flex-wrap items-center justify-start"
            style={{ padding: 12, gap: 12, backgroundColor: 'white' }}
        >
            {checkIfMissingLogos() === 0 ? (
                <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>There is no missing logos</span>
            ) : null}
            <MissingBatchView header={'Symbols'} batch={SymbolLogoMissing} method={SymbolLogo} />
            <MissingBatchView header={'ApiProviders'} batch={ApiProviderLogoMissing} method={ApiProviderLogo} />
            <MissingBatchView header={'Chains'} batch={ChainLogoMissing} method={ChainLogo} />
        </div>
    );
};

export default MissingLogosView;
