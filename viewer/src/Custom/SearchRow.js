import React from 'react';
import { Flex, Input } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchRow = ({ text, setText, placeholder }) => {
    return (
        <Flex direction="row" align="left" alignItems={'center'} gap={3} width={'100%'}>
            <SearchIcon width={'32px'} height={'32px'} m={2} />

            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                color={'black'}
                fontSize={'md'}
                placeholder={placeholder}
            />
        </Flex>
    );
};

export default SearchRow;
