import { Flex, Text, Spacer } from '@chakra-ui/react';
import { ChainIcon } from 'react-icons';
import * as Api3Chains from '@api3/chains';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';

const ChainsView = () => {
    const [chain, setChain] = useState('');

    const getChains = () => {
        return Api3Chains.CHAINS.filter((chainObject) => chainObject.name.toLowerCase().includes(chain.toLowerCase()));
    }

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>There are total of {getChains().length} chains</Text>
            <SearchRow text={chain} setText={setChain} placeholder={"Enter a chain"} />
            {getChains().map((chain, index) => {
                return (
                    <Flex
                        p={3}
                        boxShadow={'md'}
                        width={'310px'}
                        bgColor={'white'}
                        key={index}
                        alignItems="center"
                        justifyContent="left"
                    >
                        <ChainIcon id={chain.id} width={50} height={50} />
                        <Text fontSize="md" fontWeight="bold" ml={2}>
                            {chain.name}
                        </Text>
                        <Spacer />
                        <Text fontSize="sm" ml={2}>
                            {chain.id}
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default ChainsView;
