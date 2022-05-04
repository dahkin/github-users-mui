import { UserAPI } from './types';
import { Dispatch, SetStateAction } from 'react';

export const userRequests = (users: UserAPI[]): Promise<UserAPI>[] =>
  users.map((user) =>
    fetch(`https://api.github.com/users/${user.login}`, {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    }).then((res) => res.json())
  );

export const getFullUsersInfo = (
  users: UserAPI[],
  setUsers: Dispatch<SetStateAction<UserAPI[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  favouritesUsers: string[],
  deletedUsers: string[]
): void => {
  Promise.allSettled(userRequests(users)).then((res) => {
    res.forEach((result) => {
      if (result.status === 'fulfilled') {
        setUsers((prevItems) =>
          prevItems.map((obj) =>
            obj.login === result.value.login
              ? {
                  ...obj,
                  company: result.value.company,
                  repos: result.value.public_repos,
                  isFavourite: favouritesUsers.includes(obj.login),
                  isDeleted: deletedUsers.includes(obj.login),
                }
              : obj
          )
        );
        setLoading(false);
      }
    });
  });
};

export const numberFormat = (num: number, digits: number): string | number => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
};

export const numberDeclination = (n: number, text_forms: string[]): string => {
  n = Math.abs(n) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) {
    return text_forms[2];
  }
  if (n1 > 1 && n1 < 5) {
    return text_forms[1];
  }
  if (n1 == 1) {
    return text_forms[0];
  }
  return text_forms[2];
};

export const numberUnit = (number: number, valueList: string[]): string =>
  number < 1000 ? numberDeclination(number, valueList) : valueList[2];
