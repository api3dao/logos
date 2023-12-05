import { Flex, Text } from '@chakra-ui/react';
import { SymbolLogo } from 'beta-logos';
import Feeds from '../data/feeds.json';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';

const SymbolsView = () => {
    const [symbol, setSymbol] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState('');

    const getSymbols = () => {
        const filteredFeeds = [...new Set(Feeds.map((feed) => feed.name.split('/')).flat())];
        return filteredFeeds.filter((feed) => feed.toLowerCase().includes(symbol.toLowerCase()));
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>
                There is a total of {getSymbols().length} symbols
            </Text>
            <SearchRow text={symbol} setText={setSymbol} placeholder={'Enter a symbol'} />

            {getSymbols().map((feed, index) => {
                return (
                    <Flex
                        p={3}
                        boxShadow={'md'}
                        width={'150px'}
                        height={'100px'}
                        bgColor={'gray.100'}
                        key={index}
                        alignItems="center"
                        justifyContent="left"
                        onMouseOver={() => setSelectedSymbol(feed)}
                        onMouseOut={() => setSelectedSymbol(null)}
                        cursor={'pointer'}
                    >
                        <SymbolLogo id={feed} width={50} height={50} />
                        <Text fontSize="sm" fontWeight="bold" ml={2}>
                            {feed}
                        </Text>
                        {selectedSymbol !== feed ? null : <InfoView method={'Symbol'} feed={feed} />}
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default SymbolsView;
