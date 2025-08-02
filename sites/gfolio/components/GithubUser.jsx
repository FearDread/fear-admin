
import { Link } from "react-router-dom";
import GithubUserAnalytics from "./GithubUserAnalytics";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useGithubUserContext } from "../contexts/GithubUserContext";
import { chakra } from "@chakra-ui/react";
import { Loader } from "./Loader/Loader";
import { NextSeo } from 'next-seo';
import "react-lazy-load-image-component/src/effects/blur.css";

const GithubUser = () => {
  const data = useGithubUserContext();
  const ChakraLink = chakra(Link);
  const ChakraLazyLoadImage = chakra(LazyLoadImage);
  if (!data) return <Loader size="xl" />;

  return (
    <>
      <NextSeo
        title="nefejames - GitHub profile"
        description="Front end web developer and technical writer - always learning - nefejames"
      />
      <Card>
        <Flex>
          <Box width={["full", "300px"]}>
            <ChakraLazyLoadImage
              src={data.avatar_url}
              placeholderSrc={"author-profile-picture.jpg"}
            />
            <Text as="span" mt={3} display="inline-block" color="teal.900">
              @{data.login}
            </Text>
          </Box>
          <VStack spacing={7} alignItems="start">
            <VStack spacing={5} alignItems="start">
              <VStack>
                <Text>
                  {data.name}
                </Text>
              </VStack>
              <Text as="p">{data.bio}</Text>
            </VStack>
            <GithubUserAnalytics
              noOfRepos={data.public_repos}
              noOfFollowers={data.followers}
              noOfFollowing={data.following}
            />
            
            <ChakraLink to="/repos" w="full">
              <Button>View my Repos</Button>
            </ChakraLink>
          </VStack>
        </Flex>
      </Card>
    </>
  );
}

export default GithubUser;