import { Flex, Text, Image } from '@chakra-ui/react';
import { DappLogo } from '@api3/logos';
import SearchRow from '../Custom/SearchRow';
import { useState } from 'react';
import InfoView from '../Custom/InfoView';
import { api3Contracts } from '@api3/dapi-management';

const DappView = () => {
    const [searchArg, setSearchArg] = useState('');
    const [selectedDapp, setSelectedDapp] = useState('');

    const getDapps = () => {
        const dapps = [...new Set(api3Contracts.DAPPS)];
        return dapps.filter((dapp) => dapp.name.toLowerCase().includes(searchArg.toLowerCase()));
    };

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="center">
            <Flex width={'100%'}>
                <Text fontSize="md" fontWeight="bold" ml={2}>
                    There is a total of {getDapps().length} dapps
                </Text>
            </Flex>
            <SearchRow text={searchArg} setText={setSearchArg} placeholder={'Enter a dapp name'} />

            {getDapps().map((dapp, index) => {
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
                        onMouseDown={() => setSelectedDapp(dapp.alias)}
                        cursor={'pointer'}
                    >
                        {selectedDapp !== dapp.alias ? (
                            <>
                                <Image src={DappLogo(dapp.alias)} width={50} height={50} bgColor={'white'} p={2} />
                                <Image
                                    src={DappLogo(dapp.alias, true)}
                                    width={50}
                                    height={50}
                                    bgColor={'black'}
                                    p={2}
                                />
                                <Text fontSize="md" fontWeight="bold" ml={2}>
                                    {dapp.name}
                                </Text>
                            </>
                        ) : (
                            <>
                                <InfoView method={'Dapp'} feed={dapp.alias} onExit={() => selectedDapp(null)} />
                            </>
                        )}
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default DappView;
