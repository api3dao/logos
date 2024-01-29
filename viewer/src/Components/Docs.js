import { Flex, Text, VStack, Image } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@phase21/logos';

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
                children={String('npm install @phase21/logos')}
                language={'bash'}
                style={dracula}
            />
            <Text fontSize="xl" fontWeight="bold" ml={2}>
                Usage React
            </Text>
            <SyntaxHighlighter
                PreTag="div"
                children={String(`import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@phase21/logos';

<div>
    <img src={ ChainLogo('43114') } width={50} height={50} alt='43114' />
    <img src={ SymbolLogo('BTC') } width={50} height={50} alt='BTC' />
    <img src={ ApiProviderLogo('nodary') } width={50} height={50} alt='nodary' />
</div>`)}
                language={'jsx'}
                style={dracula}
            />

            <Flex p={3} gap={3} wrap={'wrap'} bgColor={"gray.100"} alignItems="center" justifyContent="left">
                <Image src={ChainLogo('43114')} width={50} height={50} alt="43114" />
                <Image src={SymbolLogo('BTC')} width={50} height={50} alt="BTC" />
                <Image src={ApiProviderLogo('nodary')} width={50} height={50} alt="nodary" />
            </Flex>

            <Text fontSize="xl" fontWeight="bold" ml={2}>
                Light/Dark mode
            </Text>

            <SyntaxHighlighter
                PreTag="div"
                children={String(`import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@phase21/logos';

<div>
    <img src={ ChainLogo('59144', true) } width={50} height={50} />
    <img src={ ChainLogo('59144') } width={50} height={50} />
</div>`)}
                language={'jsx'}
                style={dracula}
            />

            <Flex p={3} gap={3} wrap={'wrap'} bgColor={"gray.100"} alignItems="center" justifyContent="left">
                <Image src={ChainLogo('59144', true)} width={50} height={50} alt="43114" />
                <Image src={ChainLogo('59144')} width={50} height={50} alt="43114" />
            </Flex>
            <Text fontSize="xl" fontWeight="bold" ml={2}>
                Usage Vue.js
            </Text>
            <SyntaxHighlighter
                PreTag="div"
                children={String(`<template>
    <div>
        <img v-bind:src="getSymbolLogo('eth')" alt="eth" />
        <img v-bind:src="getChainLogo('1')" alt="1" />
        <img v-bind:src="getApiProviderLogo('nodary')" alt="nodary" />
    </div>
</template>

<script>

import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@phase21/logos';
export default {
...
methods: {
    getSymbolLogo(symbol) {
      return SymbolLogo(symbol);
    },
    getChainLogo(chainId) {
      return ChainLogo(chainId);
    },
    getApiProviderLogo(apiProvider) {
      return ApiProviderLogo(apiProvider);
    },
}
...
}
</script>`)}
                language={'html'}
                style={dracula}
            />
        </VStack>
    );
};

export default ChainsView;
