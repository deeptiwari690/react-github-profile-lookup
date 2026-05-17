import type { GitHubUser } from "../types";
import "./ProfileCard.css";

interface Props {
  status: "idle" | "loading" | "success" | "error";
  userData: GitHubUser | null;
  fetchErrorMessage: string | null;
  isCardVisible: boolean;
  onTransitionEnd: () => void;
}

function ProfileCardLoading() {
  return (
    <div className="profile-card-skeleton">
      <div className="profile-card-skeleton__banner shimmer shimmer-muted">
        <div className="profile-card-skeleton__avatar shimmer" />
      </div>
      <div className="profile-card-skeleton__body">
        <div className="profile-card-skeleton__info">
          <div className="profile-card-skeleton__title shimmer" />
          <div className="profile-card-skeleton__subtitle shimmer" />
        </div>
        <div className="profile-card-skeleton__stats">
          <div className="profile-card-skeleton__stat">
            <div className="profile-card-skeleton__stat-inner">
              <div className="profile-card-skeleton__stat-value shimmer" />
              <div className="profile-card-skeleton__stat-label shimmer" />
            </div>
          </div>
          <div className="profile-card-skeleton__stat">
            <div className="profile-card-skeleton__stat-inner">
              <div className="profile-card-skeleton__stat-value shimmer" />
              <div className="profile-card-skeleton__stat-label shimmer" />
            </div>
          </div>
          <div className="profile-card-skeleton__stat">
            <div className="profile-card-skeleton__stat-inner">
              <div className="profile-card-skeleton__stat-value shimmer" />
              <div className="profile-card-skeleton__stat-label shimmer" />
            </div>
          </div>
        </div>
      </div>
      <div className="profile-card-skeleton__btn shimmer" />
    </div>
  );
}

function ProfileCardError({ fetchErrorMessage }: { fetchErrorMessage: string }) {
  return (
    <div className="profile-card__error-outer">
      <div className="profile-card__error-inner">
        <svg className="profile-card__error-icon icon-md icon-stroke" aria-hidden="true">
          <use href="./icons.svg#icon-error" />
        </svg>
        <p className="profile-card__error">{fetchErrorMessage}</p>
      </div>
    </div>
  );
}

function ProfileCardSuccess({ userData }: { userData: GitHubUser }) {
  return (
    <div className="profile-card__success">
      <div className="profile-card__banner" aria-hidden="true">
        <img alt="" src={userData.avatar_url} className="profile-card__avatar" width={128} height={128} />
      </div>
      <div className="profile-card__body">
        <hgroup className="profile-card__info">
          <h2 className="profile-card__title" tabIndex={-1}>
            {userData.name || userData.login}
          </h2>
          <p className="profile-card__subtitle">{userData.company || userData.location || userData.login}</p>
        </hgroup>
        <ul className="profile-card__stats" role="list">
          <li className="profile-card__stat">
            <div className="profile-card__stat-value-group">
              <svg className="profile-card__stat-icon icon-md icon-fill" aria-hidden="true">
                <use href="./icons.svg#icon-repo" />
              </svg>
              <span className="profile-card__stat-value">{userData.public_repos}</span>
            </div>
            <span className="profile-card__stat-label">Repos</span>
          </li>
          <li className="profile-card__stat">
            <div className="profile-card__stat-value-group">
              <svg className="profile-card__stat-icon icon-md icon-fill" aria-hidden="true">
                <use href="./icons.svg#icon-follower" />
              </svg>
              <span className="profile-card__stat-value">{userData.followers}</span>
            </div>
            <span className="profile-card__stat-label">Followers</span>
          </li>
          <li className="profile-card__stat">
            <div className="profile-card__stat-value-group">
              <svg className="profile-card__stat-icon icon-md icon-fill" aria-hidden="true">
                <use href="./icons.svg#icon-following" />
              </svg>
              <span className="profile-card__stat-value">{userData.following}</span>
            </div>
            <span className="profile-card__stat-label">Following</span>
          </li>
        </ul>
      </div>
      <a href={userData.html_url} className="btn profile-card__link" rel="noopener noreferrer" target="_blank">
        View on GitHub
      </a>
    </div>
  );
}

export function ProfileCard(props: Props) {
  if (props.status === "idle") return null;

  return (
    <div
      className={`profile-card ${props.isCardVisible ? "profile-card--visible" : ""}`}
      onTransitionEnd={props.onTransitionEnd}
    >
      {props.status === "loading" && <ProfileCardLoading />}
      {props.status === "error" && <ProfileCardError fetchErrorMessage={props.fetchErrorMessage!} />}
      {props.status === "success" && <ProfileCardSuccess userData={props.userData!} />}
    </div>
  );
}
