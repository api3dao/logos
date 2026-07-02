import React from 'react';
import { Link } from 'react-router-dom';
import { TbCoin, TbLink, TbServer2, TbAlertTriangle, TbPuzzle } from 'react-icons/tb';
import { dapis, getChains, api3Contracts } from '@api3/dapi-management';
import {
    SymbolLogoMissing,
    ApiProviderLogoMissing,
    ChainLogoMissing,
    SymbolLogoExtended,
    ApiProviderLogoExtended,
    ChainLogoExtended
} from '@api3/logos';

const getSymbolCount = () => {
    const supportedFeeds = dapis.filter((dapi) => dapi.stage !== 'retired').map((dapi) => dapi.name);
    return new Set(supportedFeeds.map((feed) => feed.split('/')).flat()).size;
};

const getApiProviderCount = () => {
    const providers = [...new Set(dapis.map((dapi) => dapi.providers).flat())];
    return providers.filter((api) => !api.match(/(.*)(-mock)/)).length;
};

const getChainCount = () => {
    const supportedChainIds = getChains()
        .filter((chain) => chain.stage !== 'retired')
        .map((chain) => chain.id);
    return api3Contracts.CHAINS.filter((chain) => supportedChainIds.includes(chain.id)).length;
};

const getMissingCount = () => SymbolLogoMissing.length + ApiProviderLogoMissing.length + ChainLogoMissing.length;
const getExtendedCount = () => SymbolLogoExtended.length + ApiProviderLogoExtended.length + ChainLogoExtended.length;

const OVERVIEW_ITEMS = [
    { to: '/symbols', label: 'Symbols', icon: TbCoin, count: getSymbolCount },
    { to: '/chains', label: 'Chains', icon: TbLink, count: getChainCount },
    { to: '/api-providers', label: 'API Providers', icon: TbServer2, count: getApiProviderCount },
    { to: '/missing-logos', label: 'Missing Logos', icon: TbAlertTriangle, count: getMissingCount },
    { to: '/extensions', label: 'Extensions', icon: TbPuzzle, count: getExtendedCount }
];

const Home = () => {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Api3 Logos Viewer</h1>
                <p className="page-subtitle">
                    Browse the symbol, chain and API provider logos available in the @api3/logos package.
                </p>
            </div>

            <div className="overview-grid">
                {OVERVIEW_ITEMS.map(({ to, label, icon: Icon, count }) => (
                    <Link key={to} to={to} className="overview-card">
                        <div className="overview-card-icon">
                            <Icon size={20} />
                        </div>
                        <span className="overview-card-count">{count()}</span>
                        <span className="overview-card-label">{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
