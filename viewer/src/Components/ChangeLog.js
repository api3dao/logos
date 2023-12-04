import { Text, VStack } from '@chakra-ui/react';
import Markdown from 'react-markdown'
import '../md.css'

const DocsView = () => {
    const markdown = `# @api3/logos

## 0.0.5

### Patch Changes

-   a835657: - JSDoc annotations added to \`beta-logos\` package.
    -   \`beta - logos\` package now exports \`Logo\` as svg string.
    -   \`beta - logos\` package now exports \`Logo\` as React component.
    -   Package size reduced.

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
    <img src={SymbolIconBase64('BTC')} width={50} height={50} alt='' />
    <img src={ApiProviderLogoBase64('nodary')} width={50} height={50} alt='' />
     \`\`\`

    You can now call these functions to get svg file as base64 string.

## 0.0.3

### Patch Changes

-   ede55ad: Null check added

## 0.0.2

### Patch Changes

-   6a0ab5d: Change name

## 0.0.1

### Patch Changes

-   0ed4fd3: Test release
-   b1ab864: initial release
-   6f06f87: Test Release

`


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
            <Text fontSize="xl" fontWeight="bold" ml={2}>Change Log</Text>
            <Markdown className={"markdown-body"} >{markdown}</Markdown>
        </VStack>
    );
};

export default DocsView;
