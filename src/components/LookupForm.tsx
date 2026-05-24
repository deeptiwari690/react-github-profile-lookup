import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { validateGitHubUsername } from "../utils/validate-github-username";
import "./LookupForm.css";

type Props = {
  onLookup: (username: string) => void;
  onInputChange: () => void;
};

export function LookupForm({ onLookup, onInputChange }: Props) {
  const [username, setUsername] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>(null);
  const [hasSubmitError, setHasSubmitError] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateGitHubUsername(username);
    if (error) {
      setValidationErrorMessage(error);
      setHasSubmitError(true);
      return;
    }
    setHasSubmitError(false);
    onLookup(username);
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;
    setUsername(inputValue);
    if (hasSubmitError) {
      setValidationErrorMessage(validateGitHubUsername(inputValue));
    }
    onInputChange();
  }

  return (
    <form className="lookup-form" noValidate onSubmit={handleSubmit}>
      <label htmlFor="username" className="sr-only">
        Username
      </label>
      <div className="lookup-form__controls">
        <input
          type="text"
          className="lookup-form__input"
          id="username"
          placeholder="Enter username"
          autoFocus
          autoComplete="off"
          required
          onChange={handleInput}
          value={username}
          aria-invalid={validationErrorMessage !== null}
        />
        <button className="btn" type="submit">
          Look up
        </button>
      </div>
      <p className="lookup-form__error" role="alert">
        {validationErrorMessage}
      </p>
    </form>
  );
}
