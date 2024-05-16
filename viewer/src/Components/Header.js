import { Flex, Text, Spacer, Image } from '@chakra-ui/react';
import { SymbolLogo } from '@api3/logos';

const Header = () => {
    return (
        <Flex width={'100%'} height={'70px'} flexDirection={'column'} justifyContent={'center'}>
            <Flex as="header" align="center" justify="space-between" p={4} boxShadow={'md'}>
                <Flex align="flex-start" cursor="pointer" gap={'12px'}>
                    <Image src={SymbolLogo('API3')} width={'32px'} height={'32px'} />
                    <Text fontWeight={'light'} fontSize="xl">
                        API3 Logos Viewer
                    </Text>
                </Flex>
                <Spacer />
            </Flex>
        </Flex>
    );
};

export default Header;
