import { useState } from "react";
import { validateGithubUsername } from "../utils/validate-github-username";
import "./lookupForm.css";

interface Props {
  onLookup: (username: string) => void;
  onInputChange: () => void;
}

export function LookupForm({ onLookup, onInputChange }: Props) {
  const [username, setUsername] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>(null);
  const [hasValidationError, setHasValidationError] = useState(false);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateGithubUsername(username);
    if (error) {
      setValidationErrorMessage(error);
      setHasValidationError(true);
      return;
    }
    setValidationErrorMessage(null);
    setHasValidationError(false);
    onLookup(username);
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    onInputChange();
    setUsername(newValue);
    if (hasValidationError) {
      setValidationErrorMessage(validateGithubUsername(newValue));
    }
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
