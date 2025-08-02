import { Center, SimpleGrid, Spinner } from "@chakra-ui/react";
import Repo from "../components/Repo";
import { useGitHubReposContext } from "../context/GitHubReposContext";
import GSEO from "../components/GSEO";
import Pagination from "../components/Pagination";

const Repos = () => {
  const {
    filteredRepos,
    prevPage,
    nextPage,
    handlePageChange,
    totalNoOfPages,
    currentPage,
    loading,
  } = useGitHubReposContext();

  if (loading) return <Spinner size="xl" />;

  return (
    <>
      <GSEO title="My Repos" />
      <SimpleGrid columns={[1, 2]} spacingX="10" spacingY="8" pt={10}>
        {filteredRepos.map((repo) => (
          <Repo
            key={repo.name}
            repoName={repo.name}
            progLang={repo.language}
            stars={repo.stargazers_count}
          />
        ))}
      </SimpleGrid>
      <Center mb={10}>
        <Pagination
          onPageChange={handlePageChange}
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          totalNoOfPages={totalNoOfPages}
        />
      </Center>
    </>
  );
}