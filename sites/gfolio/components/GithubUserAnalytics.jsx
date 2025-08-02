import { Flex, Text, VStack } from "@chakra-ui/react";

export default function GithubUserAnalytics({
  noOfRepos,
  noOfFollowers,
  noOfFollowing,
}) {
  return (
    <Flex>
      <VStack spacing={-1}>
        <Text as="span">Repos</Text>
        <Text as="span" fontWeight="bold" fontSize="xl">
          {noOfRepos}
        </Text>
      </VStack>
      <VStack spacing={-1}>
        <Text as="span">Followers</Text>
        <Text as="span" fontWeight="bold" fontSize="xl">
          {noOfFollowers}
        </Text>
      </VStack>
      <VStack spacing={-1}>
        <Text as="span">Following</Text>
        <Text as="span" fontWeight="bold" fontSize="xl">
          {noOfFollowing}
        </Text>
      </VStack>
    </Flex>
  );
}