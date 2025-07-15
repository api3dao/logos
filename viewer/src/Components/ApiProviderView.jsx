import React from 'react';
import { Flex, Text, Image } from '@chakra-ui/react';
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
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="center">
            <Flex width={'100%'}>
                <Text fontSize="md" fontWeight="bold" ml={2}>
                    There is a total of {getApiProviders().length} api providers
                </Text>
            </Flex>
            <SearchRow text={apiProvider} setText={setApiProvider} placeholder={'Enter a symbol'} />

            {getApiProviders().map((provider, index) => {
                return (
                    <Flex
                        p={3}
                        boxShadow={'md'}
                        width={'310px'}
                        height={'80px'}
                        bgColor={'gray.100'}
                        key={index}
                        alignItems="center"
                        justifyContent="left"
                        onMouseDown={() => setSelectedApiProvider(provider)}
                        cursor={'pointer'}
                    >
                        {selectedApiProvider !== provider ? (
                            <>
                                <Image src={ApiProviderLogo(provider)} width={50} height={50} bgColor={'white'} p={2} />
                                <Image
                                    src={ApiProviderLogo(provider, true)}
                                    width={50}
                                    height={50}
                                    bgColor={'black'}
                                    p={2}
                                />
                                <Text fontSize="md" fontWeight="bold" ml={2}>
                                    {provider}
                                </Text>
                            </>
                        ) : (
                            <>
                                <InfoView
                                    method={'ApiProvider'}
                                    feed={provider}
                                    onExit={() => setSelectedApiProvider(null)}
                                />
                            </>
                        )}
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default ApiProvidersView;
