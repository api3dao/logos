import React from 'react';
import { ApiProviderLogo } from '@api3/logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import { dapis } from '@api3/dapi-management';

const ApiProvidersView = () => {
    const [apiProvider, setApiProvider] = useState('');
    const [selectedApiProvider, setSelectedApiProvider] = useState('');

    const getApiProviders = () => {
        const providers = [...new Set(dapis.map((dapi) => dapi.providers).flat())];
        const filteredApiProviders = providers.filter((api) => !api.match(/(.*)(-mock)/));
        return filteredApiProviders.filter((provider) => provider.toLowerCase().includes(apiProvider.toLowerCase()));
    };

    return (
        <div
            className="flex flex-wrap items-center justify-center"
            style={{ padding: 12, gap: 12, backgroundColor: 'white' }}
        >
            <div className="flex" style={{ width: '100%' }}>
                <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>
                    There is a total of {getApiProviders().length} api providers
                </span>
            </div>
            <SearchRow text={apiProvider} setText={setApiProvider} placeholder={'Enter a symbol'} />

            {getApiProviders().map((provider, index) => {
                return (
                    <div
                        className="card"
                        key={index}
                        style={{ padding: 12, width: 310, height: 80 }}
                        onMouseDown={() => setSelectedApiProvider(provider)}
                    >
                        {selectedApiProvider !== provider ? (
                            <>
                                <img
                                    src={ApiProviderLogo(provider)}
                                    width={50}
                                    height={50}
                                    style={{ backgroundColor: 'white', padding: 8 }}
                                    alt={provider}
                                />
                                <img
                                    src={ApiProviderLogo(provider, true)}
                                    width={50}
                                    height={50}
                                    style={{ backgroundColor: 'black', padding: 8 }}
                                    alt={provider}
                                />
                                <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>{provider}</span>
                            </>
                        ) : (
                            <InfoView
                                method={'ApiProvider'}
                                feed={provider}
                                onExit={() => setSelectedApiProvider(null)}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ApiProvidersView;
