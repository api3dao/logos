import { Flex, Text, Image } from '@chakra-ui/react';
import { SymbolLogo } from 'api3-logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import { nodaryFeeds } from '@nodary/utilities';

const SymbolsView = () => {
    const [symbol, setSymbol] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState('');

    const getSymbols = () => {
        const filteredFeeds = [...new Set(nodaryFeeds.map((feed) => feed.name.split('/')).flat())];
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
                        onMouseDown={() => setSelectedSymbol(feed)}
                        cursor={'pointer'}
                    >
                        {selectedSymbol !== feed ? (
                            <>
                                <Image src={SymbolLogo(feed)} width={50} height={50} />
                                <Text fontSize="sm" fontWeight="bold" ml={2}>
                                    {feed}
                                </Text>
                            </>
                        ) : (
                            <InfoView method={'Symbol'} feed={feed} onExit={() => setSelectedSymbol(null)} />
                        )}
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default SymbolsView;
