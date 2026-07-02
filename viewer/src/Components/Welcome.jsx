import React from 'react';
import SymbolsView from './SymbolsView';
import ChainsView from './ChainsView';
import ApiProviderView from './ApiProviderView';
import MissingLogosView from './MissingLogosView';
import ExtensionsView from './ExtensionsView';
import Docs from './Docs';
import ExpandableView from '../Custom/ExpandableView';

const Welcome = () => {
    return (
        <div
            className="flex-col text-left"
            style={{
                padding: 8,
                backgroundColor: 'white',
                borderRadius: 2,
                gap: 4,
                width: '95vw',
                maxWidth: '1100px',
                justifyItems: 'center'
            }}
        >
            <ExpandableView header={'Symbols'} view={<SymbolsView />} />
            <ExpandableView header={'Chains'} view={<ChainsView />} />
            <ExpandableView header={'ApiProviders'} view={<ApiProviderView />} />
            <ExpandableView header={'Missing Logos'} view={<MissingLogosView />} />
            <ExpandableView header={'Extensions'} view={<ExtensionsView />} />
            <ExpandableView header={'How to use'} view={<Docs />} />
        </div>
    );
};

export default Welcome;
