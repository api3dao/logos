import React from 'react';
import { Text, Flex, VStack } from '@chakra-ui/react';

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
