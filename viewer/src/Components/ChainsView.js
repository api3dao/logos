import { Flex, Text, Spacer, Image } from '@chakra-ui/react';
import { ChainLogo } from 'api3-logos';
import * as Api3Chains from '@api3/chains';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import Title from '../Custom/Title';
import InfoView from '../Custom/InfoView';

const ChainList = ({ isTestnet, chain }) => {
    const [selectedChain, setSelectedChain] = useState('');

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
                height={'80px'}
                bgColor={'gray.100'}
                key={index}
                alignItems="center"
                justifyContent="left"
                onMouseDown={() => setSelectedChain(chain)}
                cursor={'pointer'}
            >
                {selectedChain !== chain ? (
                    <>
                        <Image
                            src={ChainLogo(chain.id)}
                            width={50}
                            height={50}
                            filter={chain.testnet ? 'grayscale(1)' : ''}
                        />
                        <Text fontSize="md" fontWeight="bold" ml={2}>
                            {chain.name}
                        </Text>
                        <Spacer />
                        <Text fontSize="sm" ml={2}>
                            {chain.id}
                        </Text>
                    </>
                ) : (
                    <InfoView method={'Chain'} feed={chain.id} onExit={() => setSelectedChain(null)} />
                )}
            </Flex>
        );
    });
};

const ChainsView = () => {
    const [chain, setChain] = useState('');

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>
                There is a total of {Api3Chains.CHAINS.length} chains
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
