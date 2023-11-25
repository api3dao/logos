import { Flex, Text, Spacer } from '@chakra-ui/react';
import { ChainIcon } from 'react-icons';
import * as Api3Chains from '@api3/chains';

const ChainsView = () => {
    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="center">
            {Api3Chains.CHAINS.map((chain, index) => {
                return (
                    <Flex
                        p={3}
                        boxShadow={'md'}
                        width={'350px'}
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
