import { Flex, Text, Spacer, Image } from '@chakra-ui/react';
import { ChainLogo } from '@api3/logos';
import { getChains, api3Contracts } from '@api3/dapi-management';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import Title from '../Custom/Title';
import InfoView from '../Custom/InfoView';

const getSupportedChains = (isTestnet, searchArg) => {
    const supportedChainIds = getChains()
        .filter((chain) => chain.stage !== 'retired')
        .filter((chain) =>
            searchArg ? chain.alias.includes(searchArg.toLowerCase()) || chain.id.includes(searchArg) : true
        )
        .map((chain) => chain.id);
    return api3Contracts.CHAINS.filter((chain) => supportedChainIds.includes(chain.id) && chain.testnet === isTestnet);
};

const ChainList = ({ isTestnet, searchArg }) => {
    const [selectedChain, setSelectedChain] = useState('');

    return getSupportedChains(isTestnet, searchArg).map((chain, index) => {
        return (
            <Flex
                p={3}
                boxShadow={'md'}
                width={'310px'}
                height={'100px'}
                bgColor={'gray.100'}
                key={index}
                alignItems="center"
                justifyContent="left"
                onMouseDown={() => setSelectedChain(chain)}
                cursor={'pointer'}
            >
                {selectedChain !== chain ? (
                    <>
                        <Image src={ChainLogo(chain.id, true)} width={50} height={50} bgColor={'white'} p={2} />
                        <Image src={ChainLogo(chain.id)} width={50} height={50} bgColor={'black'} p={2} />
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
    const [searchArg, setSearchArg] = useState('');

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="center">
            <Flex width={'100%'}>
                <Text fontSize="md" fontWeight="bold" ml={2}>
                    There is a total of {getSupportedChains(false).length} mainnet chains and{' '}
                    {getSupportedChains(true).length} testnet chains
                </Text>
            </Flex>
            <SearchRow text={searchArg} setText={setSearchArg} placeholder={'Enter a chain id or chain name'} />
            <Title header={'Mainnets'} />
            <ChainList isTestnet={false} searchArg={searchArg} />
            <Title header={'Testnets'} />
            <ChainList isTestnet={true} searchArg={searchArg} />
        </Flex>
    );
};

export default ChainsView;
