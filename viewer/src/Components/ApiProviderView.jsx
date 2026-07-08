import React from 'react';
import { ApiProviderLogo } from '@api3/logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import LogoCard from '../Custom/LogoCard';
import { dapis } from '@api3/dapi-management';

const ApiProvidersView = () => {
    const [apiProvider, setApiProvider] = useState('');
    const [selectedApiProvider, setSelectedApiProvider] = useState(null);

    const getApiProviders = () => {
        const providers = [...new Set(dapis.map((dapi) => dapi.providers).flat())];
        const filteredApiProviders = providers.filter((api) => !api.match(/(.*)(-mock)/));
        return filteredApiProviders.filter((provider) => provider.toLowerCase().includes(apiProvider.toLowerCase()));
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">API Providers</h1>
                <p className="page-subtitle">Logos for the API providers that power Api3 data feeds.</p>
                <span className="stat-pill">{getApiProviders().length} api providers</span>
            </div>

            <SearchRow text={apiProvider} setText={setApiProvider} placeholder={'Enter a provider'} />

            <div className="logo-grid">
                {getApiProviders().map((provider, index) => (
                    <LogoCard
                        key={index}
                        label={provider}
                        lightSrc={ApiProviderLogo(provider)}
                        darkSrc={ApiProviderLogo(provider, true)}
                        onClick={() => setSelectedApiProvider(provider)}
                    />
                ))}
            </div>

            {selectedApiProvider ? (
                <InfoView method={'ApiProvider'} feed={selectedApiProvider} onExit={() => setSelectedApiProvider(null)} />
            ) : null}
        </div>
    );
};

export default ApiProvidersView;
