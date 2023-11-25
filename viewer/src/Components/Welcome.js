import { VStack } from '@chakra-ui/react';
import SymbolsView from './SymbolsView';
import ChainsView from './ChainsView';

const Welcome = () => {
    return (
        <VStack
            p={10}
            bgColor={'white'}
            borderRadius={'sm'}
            boxShadow="md"
            spacing={5}
            width={'95vw'}
            maxWidth={'1000px'}
            alignItems={'left'}
            justifyItems={'center'}
        >
            <SymbolsView />
            <ChainsView />
        </VStack>
    );
};

export default Welcome;
