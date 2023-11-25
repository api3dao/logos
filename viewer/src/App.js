import { VStack, Flex } from '@chakra-ui/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Welcome from './Components/Welcome';

const App = () => {
  return (
    <HashRouter>
      <Header />
      <Flex h="calc(100vh - 90px)" spacing={0} p={5} alignItems={'stretch'} flexDirection={'row'}>
        <VStack width={'100%'} alignItems={'center'}>
          <Routes>
            <Route path="/" element={<Welcome />} />
          </Routes>
        </VStack>
      </Flex>
    </HashRouter>
  );
};

export default App;
