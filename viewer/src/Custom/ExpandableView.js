import { Text, Flex, Spacer, VStack, Box } from '@chakra-ui/react';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import { useState } from 'react';

const ExpandableView = ({ view, header, defaultState = false, size = 'md' }) => {
    const [isOpen, setIsOpen] = useState(defaultState);

    return (
        <VStack alignItems={'left'} p={2} boxShadow={'md'} width={'100%'} cursor={'pointer'}>
            <Box p={2} alignItems={'center'} borderRadius={'sm'} bgColor={'gray.50'} onClick={() => setIsOpen(!isOpen)}>
                <Flex gap={3} alignItems={'center'}>
                    <Text fontWeight={'bold'} fontSize={size}>
                        {header}
                    </Text>
                    <Spacer />
                    {isOpen ? (
                        <TbTriangleFilled size={'24px'} cursor={'pointer'} />
                    ) : (
                        <TbTriangleInvertedFilled size={'24px'} cursor={'pointer'} />
                    )}
                </Flex>
            </Box>
            {isOpen ? view : null}
        </VStack>
    );
};

export default ExpandableView;
