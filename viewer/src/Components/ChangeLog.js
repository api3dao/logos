import { VStack } from '@chakra-ui/react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../md.css';

const DocsView = () => {
    const markdown = `# @api3/logos

## 0.0.13

### Patch Changes

-   10139eb: Added missing dependency (camelcase)

## 0.0.12

### Patch Changes

-   a4195dc: Release bug fixed

## 0.0.11

### Patch Changes

-   a47a5a0: - React support removed.

    -   \`ChainLogo\`, \`SymbolLogo\` and \`ApiProviderLogo\` now return a string instead of a React component.
    -   Returned string is a base64 encoded SVG image.

\`\`\`js
    import { ChainLogo, SymbolLogo, ApiProviderLogo } from 'beta-logos';

    <div>
        <img src={ChainLogo('43114')} width={50} height={50} alt='43114' />
        <img src={SymbolLogo('BTC')} width={50} height={50} alt='BTC' />
        <img src={ApiProviderLogo('nodary')} width={50} height={50} alt='nodary' />
    </div>
\`\`\`

## 0.0.10

### Patch Changes

-   8fd2486: Added new symbols; 'BABA', 'ETHx', 'MATICx', 'PYTH', 'WOO', 'MATIC Exchange Rate', 'NG', 'QQQ', 'PYPL'

## 0.0.9

### Patch Changes

-   a19b40e: Fix invalid import statement for cjs

## 0.0.8

### Patch Changes

-   c797370: Added new symbols; mETH, EURE, GHO, RDNT

## 0.0.7

### Patch Changes

-   de4bec0: Export functions fixed.

## 0.0.6

### Patch Changes

-   f3149d9: Add example view to repo FE.

## 0.0.5

### Patch Changes

-   a835657: - JSDoc annotations added to \`beta-logos\` package.
    -   JS Docs are annotations are now available for \`beta-logos\` package.

        \`\`\`ts
        @param props

        @param props.id — Unique ID for the logo element.
        @param props.width — Width of the logo.
        @param props.height — Height of the logo.
        @returns — ApiProviderLogo component

        @example
        import { ApiProviderLogo } from 'beta-logos';

        const App = () => {
            return <ApiProviderLogo  id="nodary" />;
        }

        \`\`\`

    -   \`beta - logos\` package now exports \`Logo\` as svg string.
    -   \`beta - logos\` package now exports \`Logo\` as React component.
    -   Package size reduced.

    -   Method names changed.

        -   SVG component

        \`\`\`javascript
        ChainLogoSvg(id: string)
        SymbolLogoSvg(id: string)
        ApiProviderLogoSvg(id: string)
        \`\`\`

        \`\`\`html
        <img src = { ChainLogoSvg('43114') } width = { 50} height = { 50} alt = '' />
        <img src = { SymbolLogoSvg('BTC') } width={50} height={50} alt='' />
        <img src = { ApiProviderLogoSvg('nodary') } width={50} height={50} alt='' />
        \`\`\`

        -  React component

        \`\`\`javascript
        ChainLogo(id: string)
        SymbolLogo(id: string)
        ApiProviderLogo(id: string)
        \`\`\`

        \`\`\`html
        <ChainLogo id = '43114' width = { 50} height = { 50} />
        <SymbolLogo id='BTC' width={50} height={50} />
        <ApiProviderLogo id='nodary' width={50} height={50} />
        \`\`\`

## 0.0.4

### Patch Changes

-   3601672: SVG export is now available.

    \`\`\`javascript
    ChainIconBase64(id: string)
    SymbolIconBase64(id: string)
    ApiProviderLogoBase64(id: string)
    \`\`\`

    \`\`\`html
    <img src = { ChainIconBase64('43114') } width = { 50} height = { 50} alt = '' />
    <img src = { SymbolIconBase64('BTC') } width={50} height={50} alt='' />
    <img src = { ApiProviderLogoBase64('nodary') } width={50} height={50} alt='' />
    \`\`\`

    You can now call these functions to get svg file as base64 string.

## 0.0.3

### Patch Changes

-   ede55ad: Null check added

## 0.0.2

### Patch Changes

-   6a0ab5d: Package name changed to @api3/logos

## 0.0.1

### Patch Changes

-   0ed4fd3: Test release
-   b1ab864: initial release
-   6f06f87: Test Release


`;

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
            <Markdown
                remarkPlugins={[]}
                children={markdown}
                className={'markdown-body'}
                components={{
                    code(props) {
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                            <SyntaxHighlighter
                                {...rest}
                                PreTag="div"
                                children={String(children).replace(/\n$/, '')}
                                language={match[1]}
                                style={dracula}
                            />
                        ) : (
                            <code {...rest} className={className}>
                                {children}
                            </code>
                        );
                    }
                }}
            />
        </VStack>
    );
};

export default DocsView;
