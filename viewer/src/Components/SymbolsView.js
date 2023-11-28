import { Flex, Text } from '@chakra-ui/react';
import { SymbolIcon } from 'logos';
import Feeds from '../data/feeds.json';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';

const SymbolsView = () => {
    const [symbol, setSymbol] = useState('');

    const getSymbols = () => {
        const filteredFeeds = [...new Set(Feeds.map((feed) => feed.name.split('/')).flat())];
        return filteredFeeds.filter((feed) => feed.toLowerCase().includes(symbol.toLowerCase()));
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>
                There are total of {getSymbols().length} symbols
            </Text>
            <SearchRow text={symbol} setText={setSymbol} placeholder={'Enter a symbol'} />

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
