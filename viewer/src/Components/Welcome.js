import SymbolsView from './SymbolsView';
import ChainsView from './ChainsView';
import ApiProviderView from './ApiProviderView';
import MissingLogosView from './MissingLogosView';
import Docs from './Docs';
import { VStack, Text, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

const Welcome = () => {
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
            overflow={'scroll'}
        >
            <Text fontSize="2xl" fontWeight="bold" ml={2}>
                @api3/logos
            </Text>
            <Text fontSize="md" ml={2}>
                Welcome to @api3/logos package viewer. This package contains logos for chains and symbols that are
                supported by API3
            </Text>
            <Tabs>
                <TabList>
                    <Tab>Symbols</Tab>
                    <Tab>Chains</Tab>
                    <Tab>ApiProviders</Tab>
                    <Tab>Missing</Tab>
                    <Tab>Docs</Tab>
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
                        <MissingLogosView />
                    </TabPanel>
                    <TabPanel>
                        <Docs />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
};

export default Welcome;
