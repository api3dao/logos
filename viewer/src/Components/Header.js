import { Flex, Text, Spacer } from '@chakra-ui/react';
import { SymbolLogo } from 'beta-logos';

const Header = () => {
    return (
        <Flex width={'100%'} height={'90px'} flexDirection={'column'} justifyContent={'center'}>
            <Flex as="header" align="center" justify="space-between" p={4} boxShadow={'md'}>
                <Flex align="flex-start" cursor="pointer" gap={'12px'}>
                    <SymbolLogo id={'API3'} width={32} height={32} />
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
