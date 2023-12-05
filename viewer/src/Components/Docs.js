import { Text, VStack } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChainsView = () => {
    return (
        <VStack
            p={3}
            gap={3}
            bgColor={'white'}
            wrap={'wrap'}
            width={'100%'}
            alignItems={'left'}
            overflow={'scroll'}
            justifyContent="left"
        >
            <Text fontSize="md" fontWeight="bold" ml={2}>
                Usage of ChainLogo and SymbolLogo components
            </Text>
            <Text fontSize="md" ml={2}>
                You can use ChainLogo and SymbolLogo by importing them from @api3/logos package
            </Text>

            <Text fontSize="xl" fontWeight="bold" ml={2}>
                Installation
            </Text>
            <SyntaxHighlighter
                PreTag="div"
                children={String('npm install beta-logos')}
                language={'bash'}
                style={dracula}
            />
            <Text fontSize="xl" fontWeight="bold" ml={2}>
                Usage
            </Text>
            <SyntaxHighlighter
                PreTag="div"
                children={String(`import React from 'react';
import { ChainLogo, SymbolLogo, ApiProviderLogo, 
    ChainLogoBase64, SymbolLogoBase64, ApiProviderLogoBase64 } from 'beta-logos';

const App = () => (
    <div>
        <ChainLogo id={'1'} width={50} height={50} />
        <SymbolLogo id={'ETH'} width={50} height={50} />
        <ApiProviderLogo id={'dxfeed'} width={50} height={50} />

        <img src={ChainLogoBase64('43114')} width={50} height={50} alt='' />
        <img src={SymbolLogoBase64('BTC')} width={50} height={50} alt='' />
        <img src={ApiProviderLogoBase64('nodary')} width={50} height={50} alt='' />
        
    </div>
);

export default App;`)}
                language={'javascript'}
                style={dracula}
            />

        </VStack>
    );
};

export default ChainsView;
