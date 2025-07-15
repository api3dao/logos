import React from 'react';
import { Flex, Text, Image } from '@chakra-ui/react';
import { SymbolLogo } from '@api3/logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import { dapis } from '@api3/dapi-management';

const SymbolsView = () => {
    const [symbol, setSymbol] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState('');

    const getSymbols = () => {
        const supportedFeeds = dapis.filter((dapi) => dapi.stage !== 'retired').map((dapi) => dapi.name);
        const filteredFeeds = [...new Set(supportedFeeds.map((feed) => feed.split('/')).flat())];
        return filteredFeeds.filter((feed) => feed.toLowerCase().includes(symbol.toLowerCase()));
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="center">
            <Flex width={'100%'}>
                <Text fontSize="md" fontWeight="bold" ml={2}>
                    There is a total of {getSymbols().length} symbols
                </Text>
            </Flex>
            <SearchRow text={symbol} setText={setSymbol} placeholder={'Enter a symbol'} />

            {getSymbols().map((feed, index) => {
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
                        onMouseDown={() => setSelectedSymbol(feed)}
                        cursor={'pointer'}
                    >
                        {selectedSymbol !== feed ? (
                            <>
                                <Image src={SymbolLogo(feed, true)} width={50} height={50} bgColor={'white'} p={2} />
                                <Image src={SymbolLogo(feed)} width={50} height={50} bgColor={'black'} p={2} />
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
