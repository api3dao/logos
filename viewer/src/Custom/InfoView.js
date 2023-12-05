import { Flex } from '@chakra-ui/react';
import { ApiProviderLogo, SymbolLogo, ChainLogo } from 'beta-logos';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';


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
            gap={5}
            zIndex={1}
            alignItems={'center'}
            className='message'
        >
            {LogoView(method, feed)}
            <Flex flexDirection={'column'} justifyContent={'left'} alignItems={'left'}>
                <SyntaxHighlighter
                    PreTag="div"
                    children={String(`// React component\n<${method}Logo id={'${feed}'} width={50} height={50} />\n\n// SVG image\n<img src={${method}LogoSvg('${feed}')} width={50} height={50} alt='' />`).replace(/\n$/, '')}
                    language={'javascript'}
                    style={dracula}
                />
            </Flex>
        </Flex>
    );
};

export default InfoView;
