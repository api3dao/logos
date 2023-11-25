import { VStack, Flex, Text } from '@chakra-ui/react';
import * as Api3Chains from '@api3/chains';
import Feeds from './data/feeds.json'

const Welcome = () => {

  const getSymbols = () => {
    return [...new Set(Feeds.map((feed) => feed.name.split('/')).flat())];
  }

  return (
    <VStack
      p={10}
      bgColor={"white"}
      borderRadius={'sm'}
      boxShadow={"md"}
      spacing={5}
      width={'450px'}
      maxWidth={'1000px'}
      alignItems={'left'}
      justifyItems={'left'}
    >

      {
        getSymbols().map((feed, index) => {
          return (
            <Flex p={3} boxShadow={"md"} bgColor={"white"} key={index} alignItems="center" justifyContent="left">
              <Text fontSize="xl" fontWeight="bold" ml={2}>
                {feed}
              </Text>
            </Flex>
          );
        })
      }
      {
        Api3Chains.CHAINS.map((chain) => {
          return (
            <Flex p={3} boxShadow={"md"} bgColor={"white"} key={chain.name} alignItems="center" justifyContent="left">
              <Text fontSize="xl" fontWeight="bold" ml={2}>
                {chain.name}
              </Text>
              <Text fontSize="xl" ml={2}>
                {chain.id}
              </Text>
            </Flex>
          );
        })
      }
    </VStack>
  );
};

export default Welcome;
