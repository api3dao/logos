import { Flex, Text } from '@chakra-ui/react';
import { ApiProviderLogo } from 'beta-logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';

const ApiProvidersView = () => {
    const [apiProvider, setApiProvider] = useState('');
    const [selectedApiProvider, setSelectedApiProvider] = useState('');

    const getApiProviders = () => {
        const apiProviders = [
            'coinpaprika',
            'dxfeed',
            'finage',
            'finnhub',
            'iexcloud',
            'kaiko',
            'ncfx',
            'nodary',
            'tradermade',
            'twelvedata'
        ];

        return apiProviders.filter((provider) => provider.toLowerCase().includes(apiProvider.toLowerCase()));
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>
                There is a total of {getApiProviders().length} api providers
            </Text>
            <SearchRow text={apiProvider} setText={setApiProvider} placeholder={'Enter a symbol'} />

            {getApiProviders().map((feed, index) => {
                return (
                    <Flex
                        p={3}
                        boxShadow={'md'}
                        width={'120px'}
                        height={'120px'}
                        bgColor={selectedApiProvider === feed ? 'gray.300' : 'gray.100'}
                        key={index}
                        alignItems="center"
                        justifyContent="left"
                        wrap={'wrap'}
                        onMouseOver={() => setSelectedApiProvider(feed)}
                        onMouseOut={() => setSelectedApiProvider(null)}
                    >
                        {selectedApiProvider !== feed ? (
                            <ApiProviderLogo id={feed} width={100} height={100} />
                        ) : (
                            <InfoView method={'ApiProvider'} feed={feed} />
                        )}
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default ApiProvidersView;
