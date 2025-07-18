/* eslint-disable react/prop-types */
import React from 'react';
import { Flex, Text, Image, VStack } from '@chakra-ui/react';
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
        return getChains().find((chainObject) => chainObject.id === chainId).name + ' (' + chainId + ')';
    };

    return batch.length === 0 ? null : (
        <Flex gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="center">
            <VStack width={'100%'} alignItems={'left'}>
                <Title header={header} />
                <Text fontSize="md" fontWeight="bold" ml={2}>
                    There is a total of {batch.length} missing {header} logos
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

const MissingLogosView = () => {
    const checkIfMissingLogos = () => {
        return SymbolLogoMissing.length + ApiProviderLogoMissing.length + ChainLogoMissing.length;
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            {checkIfMissingLogos() === 0 ? (
                <Text fontSize="md" fontWeight="bold" ml={2}>
                    There is no missing logos
                </Text>
            ) : null}
            <MissingBatchView header={'Symbols'} batch={SymbolLogoMissing} method={SymbolLogo} />
            <MissingBatchView header={'ApiProviders'} batch={ApiProviderLogoMissing} method={ApiProviderLogo} />
            <MissingBatchView header={'Chains'} batch={ChainLogoMissing} method={ChainLogo} />
        </Flex>
    );
};

export default MissingLogosView;
