import { Flex, Text } from '@chakra-ui/react';
import { SymbolIcon } from 'react-icons';
import Feeds from '../data/feeds.json';

const SymbolsView = () => {
    const getSymbols = () => {
        return [...new Set(Feeds.map((feed) => feed.name.split('/')).flat())];
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="center">
            {getSymbols().map((feed, index) => {
                return (
                    <Flex
                        p={3}
                        boxShadow={'md'}
                        width={'150px'}
                        height={'100px'}
                        bgColor={'white'}
                        key={index}
                        alignItems="center"
                        justifyContent="left"
                    >
                        <SymbolIcon id={feed} width={50} height={50} />
                        <Text fontSize="sm" fontWeight="bold" ml={2}>
                            {feed}
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default SymbolsView;
