import React from 'react';
import { Text, Flex, VStack } from '@chakra-ui/react';

// eslint-disable-next-line react/prop-types
const Title = ({ header, fontWeight = 'light', p = 3 }) => {
    return (
        <VStack p={p} alignItems={'left'} width={'100%'}>
            <Flex alignItems={'center'} borderBottomWidth={1}>
                <Text fontWeight={fontWeight} fontSize={'2xl'} textUnderlineOffset={1}>
                    {header}
                </Text>
            </Flex>
        </VStack>
    );
};

export default Title;
