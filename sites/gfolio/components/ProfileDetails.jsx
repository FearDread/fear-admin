import React from 'react';
import classNames from 'clsx'
import useGithubStats from 'react-github-user-stats';
import GitHubCalendar from 'react-github-calendar';
import Reveal from '@/components/Reveal';
import LoadingDots from "@/components/LoadingDots";

const ProfileDetails = ({projects}) => {
  const gituser = "FearDread";
  const { error, loading, userData } = useGithubStats(gituser);

  if (loading) {
    return <LoadingDots />;
  }

  if (error) {
    return <LoadingDots text={error} />;
  }

  if (!userData) {
    return <LoadingDots />;
  }

  console.log('github data = ', userData);
  return (
    <>
      <h5> My Open-Source Projects </h5>
      <div className="relative mx-auto w-full text-center">
        <Reveal
        delay={1000}
        animation="fade-in slide-in-top"
        className="prose absolute -bottom-4 left-1/2 z-20 w-full -translate-x-1/2"
      >
        <h1 className="text-gradient-500 m-0 text-7xl drop-shadow-md md:text-8xl">{userData.username}</h1>
      </Reveal>
      <Reveal
        animation="fade-in zoom-in"
        className="relative left-1/2 h-72 w-72 -translate-x-1/2 md:bottom-0 md:h-76 md:w-76"
      >
        <img src={userData.avatar_url}
          className={classNames(
            'h-full w-full rounded-full',
            'bg-gradient-to-tr from-alpha-600 via-beta to-accent'
          )}
        />
      </Reveal>
      </div>

      <div className="text-center mt-4 grid grid-cols-fluid gap-4 [--tw-fluid-col-min:15rem] md:mt-12 md:gap-6">

          <p>{userData.name}</p>
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>

        </div>
        <Reveal
      animation="fade-in scale-x"
      className="mx-auto h-px max-w-5xl bg-gradient-to-r from-accent via-beta to-alpha"
    />
    <br />
    <GitHubCalendar username={gituser} />
    </>
  );
};

export default ProfileDetails;