export interface UserAPI {
  id: string;
  avatar_url: string;
  login: string;
  repos: number;
  company: string;
  public_repos: number;
  isFavourite: boolean;
  isDeleted: boolean;
}

export interface UserFullAPI {
  id: string;
  avatar_url: string;
  login: string;
  name: string;
  repos_url: string;
  blog: string;
  following: number;
  followers: number;
}

export interface RepoAPI {
  id: string;
  html_url: string;
  description: string;
  name: string;
}

export interface LocationState {
  search: string;
}
