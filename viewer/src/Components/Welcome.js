import SymbolsView from './SymbolsView';
import ChainsView from './ChainsView';
import ApiProviderView from './ApiProviderView';
import Docs from './Docs';
import Changelog from './ChangeLog';
import { useState } from 'react';
import { VStack, Text, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

const Welcome = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <VStack
            p={10}
            bgColor={'white'}
            borderRadius={'sm'}
            boxShadow="md"
            spacing={5}
            width={'95vw'}
            maxWidth={'1100px'}
            alignItems={'left'}
            justifyItems={'center'}
        >
            <Text fontSize="2xl" fontWeight="bold" ml={2}>
                @api3/logos
            </Text>
            <Text fontSize="md" ml={2}>
                Welcome to @api3/logos package viewer. This package contains logos for chains and symbols that supported
                by API3
            </Text>
            <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
                <TabList>
                    <Tab>Symbols</Tab>
                    <Tab>Chains</Tab>
                    <Tab>ApiProviders</Tab>
                    <Tab>Docs</Tab>
                    <Tab>Changelog</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SymbolsView />
                    </TabPanel>
                    <TabPanel>
                        <ChainsView />
                    </TabPanel>
                    <TabPanel>
                        <ApiProviderView />
                    </TabPanel>
                    <TabPanel>
                        <Docs />
                    </TabPanel>
                    <TabPanel>
                        <Changelog />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
};

export default Welcome;
