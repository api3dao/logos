/* eslint-disable react/prop-types */
import React from 'react';
import { Flex, Text, Image, VStack } from '@chakra-ui/react';
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
        <Flex gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="center">
            <VStack width={'100%'} alignItems={'left'}>
                <Title header={header} />
                <Text fontSize="md" fontWeight="bold" ml={2}>
                    There is a total of {batch.length} extended {header} logos
                </Text>
            </VStack>

            {batch.map((item, index) => {
                return (
                    <Flex
                        p={3}
                        boxShadow={'md'}
                        width={'300px'}
                        height={'70px'}
                        bgColor={'gray.100'}
                        key={index}
                        alignItems="center"
                        justifyContent="left"
                        cursor={'pointer'}
                    >
                        <Image src={method(item)} width={'32px'} height={'32px'} />
                        <Text fontSize="sm" fontWeight="bold" ml={2}>
                            {header === 'Chains' ? getChain(item) : item}
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
};

const ExtensionsView = () => {
    const checkIfExtendedLogos = () => {
        return SymbolLogoExtended.length + ApiProviderLogoExtended.length + ChainLogoExtended.length;
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            {checkIfExtendedLogos() === 0 ? (
                <Text fontSize="md" fontWeight="bold" ml={2}>
                    There is no extended logos
                </Text>
            ) : null}
            <ExtensionsBatchView header={'Symbols'} batch={SymbolLogoExtended} method={SymbolLogo} />
            <ExtensionsBatchView header={'ApiProviders'} batch={ApiProviderLogoExtended} method={ApiProviderLogo} />
            <ExtensionsBatchView header={'Chains'} batch={ChainLogoExtended} method={ChainLogo} />
        </Flex>
    );
};

export default ExtensionsView;
