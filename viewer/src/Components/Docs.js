import { Text, VStack } from '@chakra-ui/react';
import { CopyBlock, dracula } from 'react-code-blocks';

const ChainsView = () => {
    return (
        <VStack p={3} gap={3} bgColor={'white'} wrap={'wrap'} width={'100%'} alignItems={'left'} justifyContent="left">
            <Text fontSize="md" fontWeight="bold" ml={2}>
                Usage of ChainIcon and SymbolIcon components
            </Text>
            <Text fontSize="md" ml={2}>
                You can use ChainIcon and SymbolIcon by importing them from @api3/logos package
            </Text>

            <CopyBlock
                text={`import React from 'react';
import { ChainIcon, SymbolIcon } from '@api3/logos';

const App = () => (
    <div>
        <ChainIcon id={'1'} width={50} height={50} />
        <SymbolIcon id={'BTC'} width={50} height={50} />
    </div>
);

export default App;`}
                language={'javascript'}
                showLineNumbers={true}
                theme={dracula}
                codeBlock={false}
            />
        </VStack>
    );
};

export default ChainsView;
