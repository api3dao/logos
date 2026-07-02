import React from 'react';
import { ChainLogo } from '@api3/logos';
import { getChains, api3Contracts } from '@api3/dapi-management';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import Title from '../Custom/Title';
import InfoView from '../Custom/InfoView';

const getSupportedChains = (isTestnet, searchArg) => {
    const supportedChainIds = getChains()
        .filter((chain) => chain.stage !== 'retired')
        .filter((chain) =>
            searchArg ? chain.alias.includes(searchArg.toLowerCase()) || chain.id.includes(searchArg) : true
        )
        .map((chain) => chain.id);
    return api3Contracts.CHAINS.filter((chain) => supportedChainIds.includes(chain.id) && chain.testnet === isTestnet);
};

const ChainList = ({ isTestnet, searchArg }) => {
    const [selectedChain, setSelectedChain] = useState('');

    return getSupportedChains(isTestnet, searchArg).map((chain, index) => {
        return (
            <div
                className="card"
                key={index}
                style={{ padding: 12, width: 310, height: 100 }}
                onMouseDown={() => setSelectedChain(chain)}
            >
                {selectedChain !== chain ? (
                    <>
                        <img
                            src={ChainLogo(chain.id, true)}
                            width={50}
                            height={50}
                            style={{ backgroundColor: 'white', padding: 8 }}
                            alt={chain.name}
                        />
                        <img
                            src={ChainLogo(chain.id)}
                            width={50}
                            height={50}
                            style={{ backgroundColor: 'black', padding: 8 }}
                            alt={chain.name}
                        />
                        <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>{chain.name}</span>
                        <div className="spacer" />
                        <span style={{ fontSize: 14, marginLeft: 8 }}>{chain.id}</span>
                    </>
                ) : (
                    <InfoView method={'Chain'} feed={chain.id} onExit={() => setSelectedChain(null)} />
                )}
            </div>
        );
    });
};

const ChainsView = () => {
    const [searchArg, setSearchArg] = useState('');

    return (
        <div
            className="flex flex-wrap items-center justify-center"
            style={{ padding: 12, gap: 12, backgroundColor: 'white' }}
        >
            <div className="flex" style={{ width: '100%' }}>
                <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>
                    There is a total of {getSupportedChains(false).length} mainnet chains and{' '}
                    {getSupportedChains(true).length} testnet chains
                </span>
            </div>
            <SearchRow text={searchArg} setText={setSearchArg} placeholder={'Enter a chain id or chain name'} />
            <Title header={'Mainnets'} />
            <ChainList isTestnet={false} searchArg={searchArg} />
            <Title header={'Testnets'} />
            <ChainList isTestnet={true} searchArg={searchArg} />
        </div>
    );
};

export default ChainsView;
