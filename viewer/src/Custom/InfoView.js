import { Flex } from '@chakra-ui/react';
import { ApiProviderLogo, SymbolLogo, ChainLogo } from 'beta-logos';
import { CopyBlock, dracula } from 'react-code-blocks';

const LogoView = (method, feed) => {
    if (method === 'Chain') {
        return <ChainLogo id={feed} width={100} height={100} />;
    } else if (method === 'Symbol') {
        return <SymbolLogo id={feed} width={100} height={100} />;
    } else if (method === 'ApiProvider') {
        return <ApiProviderLogo id={feed} width={100} height={100} />;
    }
};

const InfoView = ({ method, feed }) => {
    return (
        <Flex
            p={5}
            bgColor={'white'}
            boxShadow={'md'}
            style={{ clear: 'both' }}
            gap={5}
            zIndex={1}
            alignItems={'center'}
        >
            {LogoView(method, feed)}
            <Flex flexDirection={'column'} justifyContent={'left'} alignItems={'left'}>
                <CopyBlock
                    text={`// React component\n<${method}Logo id={'${feed}'} width={50} height={50} />\n\n// SVG image\n<img src={${method}LogoSvg('${feed}')} width={50} height={50} alt='' />`}
                    language={'javascript'}
                    showLineNumbers={true}
                    theme={dracula}
                    codeBlock={false}
                />
            </Flex>
        </Flex>
    );
};

export default InfoView;
