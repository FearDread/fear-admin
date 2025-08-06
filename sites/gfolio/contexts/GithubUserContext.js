
import React, { createContext, useContext, useEffect, useState } from "react";

const GithubUserContext = createContext();



export const useGithubUserContext = () => useContext(GithubUserContext);


const GithubUserContextProvider = ({ children }) => {
  const [GithubUserData, setGithubUserData] = useState(false);

  async function fetchGithubUserData() {
    const response = await fetch(`https://api.github.com/users/FearDread`);
    const data = await response.json();
    console.log('github data = ', data)
    setGithubUserData(data);
  }

  useEffect(() => {
    fetchGithubUserData();
  }, []);

  const data = GithubUserData;

  return (
    <GithubUserContext.Provider value={data}>
      {children}
    </GithubUserContext.Provider>
  );
}

export default GithubUserContextProvider;