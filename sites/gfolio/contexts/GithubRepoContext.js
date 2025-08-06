import { createContext, useContext, useEffect, useState } from "react";
const GitHubReposContext = createContext();

export const useGitHubReposContext = () => useContext(GitHubReposContext);

const GithubReposContext = ({ children }) => {
  const [GitHubReposData, setGitHubReposData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalNoOfPages = 5;

  const fetchGitHubReposData = async () => {
    setLoading(true);
    
    await fetch(`https://api.github.com/users/nefejames/repos`)
        .then((response) => {
            setGitHubReposData(response.json());
            setLoading(false);
        })
        .catch((error) => { console.log('Github repo error' , error); });
  }

  useEffect(() => {
    fetchGitHubReposData();
  }, []);

  //start pagination functionality setup
  const getPaginationData = (arr, currentPage = 1, reposPerPage) => {
    const start = currentPage * reposPerPage - reposPerPage;
    const data = [...arr].splice(start, reposPerPage);
    return data;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const prevPage = () => {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage((prev) => prev - 1);
  };

  const nextPage = () => {
    if (currentPage >= totalNoOfPages) {
      return;
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const filteredRepos = getPaginationData(GitHubReposData, currentPage, 6);
  //end pagination functionality setup

  const data = {
    filteredRepos,
    prevPage,
    nextPage,
    handlePageChange,
    totalNoOfPages,
    currentPage,
    loading,
  };
  return (
    <GitHubReposContext.Provider value={data}>
      {children}
    </GitHubReposContext.Provider>
  );
}

export default GithubReposContext;