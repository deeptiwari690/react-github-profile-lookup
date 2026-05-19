# GitHub Profile Lookup — React + TypeScript

[View live →](https://deeptiwari690.github.io/react-github-profile-lookup/)

A rebuild of the vanilla TS GitHub Profile Lookup project, now in React.

---

## Architecture

### Folder Structure

```
src/
  App.tsx                      — root component, owns all fetch state
  App.css                      — App layout + header styles
  main.tsx                     — mounts App to #root
  types.ts                     — GitHubUser interface
  components/
    LookupForm.tsx             — form, input, validation
    LookupForm.css
    ProfileCard.tsx            — loading / error / success states
    ProfileCard.css
  utils/
    fetch-github-user.ts       — pure async function, calls GitHub API
    validate-github-username.ts — pure validation function
  global-styles/
    base.css
    tokens.css
    utils.css
```

### Data Flow

```
User types → LookupForm (owns: username, errorMessage, hasValidationError)
User submits → onLookup(username) callback fires → App.handleLookup()
App fetches → updates status, userData, errorMessage, isCardVisible, srStatus
App passes state down as props → ProfileCard renders the right state
```

### State — who owns what

| State | Lives in | Why |
|---|---|---|
| `username` | `LookupForm` | only the form needs it |
| `validationErrorMessage` | `LookupForm` | only the form needs it |
| `hasValidationError` | `LookupForm` | controls real-time validation mode |
| `status` | `App` | shared between form (trigger) and card (display) |
| `userData` | `App` | passed to ProfileCard |
| `fetchErrorMessage` | `App` | passed to ProfileCard |
| `isCardVisible` | `App` | controls CSS transition class |
| `srStatus` | `App` | screen reader announcement |

---

## Key Patterns

### Controlled input
Input value lives in state (`username`), not in the DOM. Read via `event.target.value` on change, write via `setUsername`.

### Props as callbacks
`LookupForm` doesn't know about fetching. It calls `onLookup(username)` — a callback passed from `App`. `App` decides what to do with the username.

### Status-driven rendering
`ProfileCard` renders nothing, a skeleton, an error, or the profile — based on the `status` prop. No conditional DOM manipulation.

### Fade transition
1. Input change → `setIsCardVisible(false)` → CSS class removed → card fades out
2. `transitionend` → `handleTransitionEnd()` → `setStatus("idle")` → ProfileCard returns null → unmounts
3. New lookup → `setStatus("loading")` → ProfileCard mounts → `requestAnimationFrame(() => setIsCardVisible(true))` → CSS class added → card fades in

The `requestAnimationFrame` defers the class addition so the element mounts first, then transitions — same two-frame pattern as the vanilla version.

### Cache
Check `localStorage` before fetching. Cache hit → skip loading state, serve instantly. Cache miss → fetch, store result, show.

### Screen reader announcements
`srStatus` state drives a `role="alert"` paragraph. Success → announces profile name for 3 seconds. Fetch error → announces error message. `useRef` stores the timeout ID so rapid lookups cancel the previous timeout before starting a new one.

---

## React concepts used

| Concept | Where |
|---|---|
| `useState` | all state variables |
| `useRef` | `srStatusTimeout` — persists across renders, no re-render on change |
| Props (data) | `userData`, `status`, `errorMessage` → ProfileCard |
| Props (callbacks) | `onLookup`, `onInputChange`, `onTransitionEnd` → LookupForm, ProfileCard |
| Conditional rendering | ProfileCard returns null when idle |
| Event handling | `onSubmit`, `onChange`, `onTransitionEnd` |
| CSS class toggling | `isCardVisible` drives `profile-card--visible` class |
