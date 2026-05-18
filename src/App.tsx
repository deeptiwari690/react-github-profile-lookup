import { useState, useRef } from "react";
import type { GitHubUser } from "./types";
import { fetchGithubUser } from "./utils/fetch-github-user";
import { LookupForm } from "./components/LookupForm.";
import { ProfileCard } from "./components/ProfileCard";
import "./App.css";

export function App() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [srStatus, setSrStatus] = useState("");
  const srStatusTimeout = useRef<number | null>(null);

  function handleInputChange() {
    setIsCardVisible(false);
  }

  function handleTransitionEnd() {
    if (!isCardVisible) {
      setStatus("idle");
    }
  }

  function setFetchError(message: string) {
    setFetchErrorMessage(message);
    setSrStatus(message);
  }

  async function handleLookup(username: string) {
    const cached = localStorage.getItem(`github-user-${username}`);
    if (cached) {
      const cachedData = JSON.parse(cached) as GitHubUser;
      setUserData(cachedData);
      setStatus("success");
      requestAnimationFrame(() => setIsCardVisible(true));
      setSrStatus(`Profile loaded: ${cachedData.name || cachedData.login}`);
      clearTimeout(srStatusTimeout.current ?? undefined);
      srStatusTimeout.current = setTimeout(() => setSrStatus(""), 3000);
      return;
    }
    setStatus("loading");
    requestAnimationFrame(() => setIsCardVisible(true));
    try {
      const data = await fetchGithubUser(username);
      localStorage.setItem(`github-user-${username}`, JSON.stringify(data));
      setUserData(data);
      setStatus("success");
      setSrStatus(`Profile loaded: ${data.name || data.login}`);
      clearTimeout(srStatusTimeout.current ?? undefined);
      srStatusTimeout.current = setTimeout(() => setSrStatus(""), 3000);
    } catch (error) {
      if (error instanceof TypeError) {
        setFetchError("Something went wrong. Check your internet connection and try again");
      } else if (error instanceof Error) {
        if (error.message.includes("404")) setFetchError("No GitHub user found with that username");
        else if (error.message.includes("403"))
          setFetchError("Github rate limit reached. Please wait a moment and try again");
        else if (error.message.includes("500")) setFetchError("Github is experiencing issues. Please try again later");
        else if (error.message.includes("503"))
          setFetchError("Github is temporarily unavailable. Please try again later");
        else setFetchError("An unexpected error occurred. Please try again");
      }
      setStatus("error");
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
        {srStatus}
      </p>
      <ProfileCard
        status={status}
        userData={userData}
        fetchErrorMessage={fetchErrorMessage}
        isCardVisible={isCardVisible}
        onTransitionEnd={handleTransitionEnd}
      />
    </div>
  );
}
