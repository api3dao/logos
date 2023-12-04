import { Flex, Text } from '@chakra-ui/react';
import { ApiProviderLogo } from 'beta-logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
const apiIntegrations = require('@api3/api-integrations');

const ApiProvidersView = () => {
    const [apiProvider, setApiProvider] = useState('');

    const getApiProviders = () => {
        return apiIntegrations.getApiProviderAliases();
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
                        width={'150px'}
                        height={'150px'}
                        bgColor={'gray.100'}
                        key={index}
                        alignItems="center"
                        justifyContent="center"
                        wrap={'wrap'}
                    >
                        <ApiProviderLogo id={feed} width={100} height={100} />
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default ApiProvidersView;
