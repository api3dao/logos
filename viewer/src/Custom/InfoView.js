import * as React from 'react';
import { Flex, Spacer, Text } from '@chakra-ui/react';
import { ApiProviderLogo, SymbolLogo, ChainLogo } from 'beta-logos';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CloseIcon } from '@chakra-ui/icons';

const LogoView = (method, feed) => {
    if (method === 'Chain') {
        return <ChainLogo id={feed} width={50} height={50} />;
    } else if (method === 'Symbol') {
        return <SymbolLogo id={feed} width={50} height={50} />;
    } else if (method === 'ApiProvider') {
        return <ApiProviderLogo id={feed} width={50} height={50} />;
    }
};

const InfoView = ({ method, feed, onExit }) => {
    return (
        <Flex p={5} bgColor={'white'} boxShadow={'md'} gap={5} zIndex={0} alignItems={'center'} wrap={"wrap"}>
            <Flex flexDirection={'row'} width={"100%"} justifyContent={'left'} alignItems={'center'}>
                {LogoView(method, feed)}
                <Text fontSize="md" fontWeight="bold" ml={2}> {feed} </Text>
                <Spacer />
                <CloseIcon onClick={() => onExit(null)} cursor={'pointer'} />

            </Flex>
            <Flex flexDirection={'column'} justifyContent={'left'} alignItems={'left'}>
                <SyntaxHighlighter
                    PreTag="div"
                    children={String(
                        `// React component\n<${method}Logo \n\tid={'${feed}'}\n\twidth={50}\n\theight={50} \n/>\n\n// SVG image\n<img \n\tsrc={${method}LogoSvg('${feed}')}\n\twidth={50}\n\theight={50}\n/>`
                    ).replace(/\n$/, '')}
                    language={'javascript'}
                    style={xonokai}
                />
            </Flex>
        </Flex>
    );
};

export default InfoView;
