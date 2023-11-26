import { Flex, Text, Spacer } from '@chakra-ui/react';
import { ChainIcon } from 'react-icons';
import * as Api3Chains from '@api3/chains';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import Title from '../Custom/Title';

const ChainList = ({ isTestnet, chain }) => {
    const getChains = (isTestnet) => {
        return Api3Chains.CHAINS.filter(
            (chainObject) =>
                chainObject.name.toLowerCase().includes(chain.toLowerCase()) && chainObject.testnet === isTestnet
        );
    };

    return getChains(isTestnet).map((chain, index) => {
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
    });
};

const ChainsView = () => {
    const [chain, setChain] = useState('');

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>
                There are total of {Api3Chains.CHAINS.length} chains
            </Text>
            <SearchRow text={chain} setText={setChain} placeholder={'Enter a chain'} />
            <Title header={'Mainnets'} />
            <ChainList isTestnet={false} chain={chain} />
            <Title header={'Testnets'} />
            <ChainList isTestnet={true} chain={chain} />
        </Flex>
    );
};

export default ChainsView;
