import { Flex, Text } from '@chakra-ui/react';

const MissingLogosView = () => {

    return (
        <Flex p={3} gap={3} bgColor={'white'} wrap={'wrap'} alignItems="center" justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>
                There is a total of 0 missing logos
            </Text>
        </Flex>
    );
};

export default MissingLogosView;
