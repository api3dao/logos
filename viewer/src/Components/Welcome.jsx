import React from 'react';
import SymbolsView from './SymbolsView';
import ChainsView from './ChainsView';
import ApiProviderView from './ApiProviderView';
import MissingLogosView from './MissingLogosView';
import ExtensionsView from './ExtensionsView';
import Docs from './Docs';
import { VStack } from '@chakra-ui/react';
import ExpandableView from '../Custom/ExpandableView';

const Welcome = () => {
    return (
        <VStack
            p={2}
            bgColor={'white'}
            borderRadius={'sm'}
            spacing={1}
            width={'95vw'}
            maxWidth={'1100px'}
            alignItems={'left'}
            justifyItems={'center'}
        >
            <ExpandableView header={'Symbols'} view={<SymbolsView />} />
            <ExpandableView header={'Chains'} view={<ChainsView />} />
            <ExpandableView header={'ApiProviders'} view={<ApiProviderView />} />
            <ExpandableView header={'Missing Logos'} view={<MissingLogosView />} />
            <ExpandableView header={'Extensions'} view={<ExtensionsView />} />
            <ExpandableView header={'How to use'} view={<Docs />} />
        </VStack>
    );
};

export default Welcome;
