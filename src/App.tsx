import { useState, useRef } from "react";
import { ZodError } from "zod";
import type { GitHubUser } from "./types";
import { fetchGitHubUser } from "./utils/fetch-github-user";
import { LookupForm } from "./components/LookupForm";
import { ProfileCard } from "./components/ProfileCard";
import "./App.css";

export function App() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsCardVisible] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState("");
  const srAnnouncementTimeoutId = useRef<number>(null);

  function scheduleSrAnnouncementReset() {
    clearTimeout(srAnnouncementTimeoutId.current ?? undefined);
    srAnnouncementTimeoutId.current = setTimeout(() => setSrAnnouncement(""), 3000);
  }

  function setFetchError(errorMessage: string) {
    setFetchErrorMessage(errorMessage);
    setSrAnnouncement(errorMessage);
    scheduleSrAnnouncementReset();
  }

  async function handleLookup(username: string) {
    const rawCachedData = localStorage.getItem(`github-user-${username.toLowerCase()}`);

    if (rawCachedData) {
      const parsedCachedData = JSON.parse(rawCachedData) as GitHubUser;
      setUserData(parsedCachedData);
      setStatus("success");
      requestAnimationFrame(() => setIsCardVisible(true));
      setSrAnnouncement(`Profile loaded: ${parsedCachedData.name || parsedCachedData.login}`);
      scheduleSrAnnouncementReset();
      return;
    }

    setStatus("loading");
    requestAnimationFrame(() => setIsCardVisible(true));

    try {
      const fetchedData = await fetchGitHubUser(username);
      localStorage.setItem(`github-user-${fetchedData.login}`, JSON.stringify(fetchedData));
      setUserData(fetchedData);
      setStatus("success");
      setSrAnnouncement(`Profile loaded: ${fetchedData.name || fetchedData.login}`);
      scheduleSrAnnouncementReset();
    } catch (error) {
      if (error instanceof TypeError) {
        setFetchError("Something went wrong. Check your internet connection and try again");
      } else if (error instanceof ZodError) {
        setFetchError("Received unexpected data from GitHub. Please try again");
      } else if (error instanceof Error) {
        if (error.message.includes("404")) {
          setFetchError("No GitHub user found with that username");
        } else if (error.message.includes("403")) {
          setFetchError("Github rate limit reached. Please wait a moment and try again");
        } else if (error.message.includes("500")) {
          setFetchError("Github is experiencing issues. Please try again later");
        } else if (error.message.includes("503")) {
          setFetchError("Github is temporarily unavailable. Please try again later");
        } else {
          setFetchError("An unexpected error occurred. Please try again");
        }
      }
      setStatus("error");
    }
  }

  function handleInputChange() {
    setIsCardVisible(false);
  }

  function handleTransitionEnd() {
    if (!isVisible) {
      setStatus("idle");
    }
  }

  return (
    <div className="page-layout">
      <header className="header">
        <svg className="header__icon icon-lg icon-stroke" aria-hidden="true">
          <use href="./icons.svg#icon-github" />
        </svg>
        <h1 className="header__heading">GitHub Profile Lookup</h1>
      </header>
      <LookupForm onLookup={handleLookup} onInputChange={handleInputChange} />
      <p className="sr-only" role="alert">
        {srAnnouncement}
      </p>
      <ProfileCard
        userData={userData}
        fetchErrorMessage={fetchErrorMessage}
        status={status}
        isVisible={isVisible}
        onTransitionEnd={handleTransitionEnd}
      />
    </div>
  );
}
