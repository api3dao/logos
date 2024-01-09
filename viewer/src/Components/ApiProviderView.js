import { Flex, Text, Image } from '@chakra-ui/react';
import { ApiProviderLogo } from '@phase21/logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import { getApiProviderAliases } from 'api-integrations'

const ApiProvidersView = () => {
    const [apiProvider, setApiProvider] = useState('');
    const [selectedApiProvider, setSelectedApiProvider] = useState('');

    const getApiProviders = () => {
        const apiProviders = getApiProviderAliases();
        return apiProviders.filter((provider) => provider.toLowerCase().includes(apiProvider.toLowerCase()));
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>
                There is a total of {getApiProviders().length} api providers
            </Text>
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
                                <Image src={ApiProviderLogo(provider)} width={50} height={50} />
                                <Text fontSize="md" fontWeight="bold" ml={2}>
                                    {provider}
                                </Text>
                            </>
                        ) : (
                            <InfoView
                                method={'ApiProvider'}
                                feed={provider}
                                onExit={() => setSelectedApiProvider(null)}
                            />
                        )}
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default ApiProvidersView;
