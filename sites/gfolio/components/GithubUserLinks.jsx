import { HStack, Text } from "@chakra-ui/react";
import { BiLink, BiMap } from "react-icons/bi";

const GithubUserLinks = ({ webUrl, location }) => {
  return (
    <HStack spacing={8}>
      <a href={webUrl} target="_blank" rel="noopener noreferrer">
        <HStack>
          <BiLink />
          <Text as="span">My portfolio</Text>
        </HStack>
      </a>
      <HStack>
        <BiMap />
        <Text as="span">{location}</Text>
      </HStack>
    </HStack>
  );
}

export default GithubUserLinks;