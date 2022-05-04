import React, { Dispatch, FC, SetStateAction } from 'react';
import { UserAPI } from '../../types';
import { UsersList } from '../UsersList/UsersList';
import { Loader } from '../Loader/Loader';
import { getFullUsersInfo } from '../../utils';

// MUI
import Container from '@mui/material/Container';

interface Props {
  setSearchValue: Dispatch<SetStateAction<string>>;
  setFavouritesUsers: Dispatch<SetStateAction<string[]>>;
  favouritesUsers: string[];
  deletedUsers: string[];
  setDeletedUsers: Dispatch<SetStateAction<string[]>>;
}

export const UsersPage: FC<Props> = ({
  setSearchValue,
  setFavouritesUsers,
  favouritesUsers,
  deletedUsers,
  setDeletedUsers,
}) => {
  const [users, setUsers] = React.useState<UserAPI[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    // Clean search field
    setSearchValue('');

    // Get users list
    fetch('https://api.github.com/users', {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        // Fetch extra info for each user
        getFullUsersInfo(data, setUsers, setLoading, favouritesUsers, deletedUsers);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      {!loading ? (
        <UsersList
          users={users}
          setUsers={setUsers}
          setFavouritesUsers={setFavouritesUsers}
          setDeletedUsers={setDeletedUsers}
        />
      ) : (
        <Loader loading={loading} />
      )}
    </Container>
  );
};
