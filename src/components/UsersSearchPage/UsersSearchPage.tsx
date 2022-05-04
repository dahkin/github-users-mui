import React, { Dispatch, FC, SetStateAction } from 'react';
import { UsersList } from '../UsersList/UsersList';
import { Loader } from '../Loader/Loader';
import { useLocation } from 'react-router-dom';
import { UserAPI, LocationState } from '../../types';
import { getFullUsersInfo } from '../../utils';

// MUI
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

interface Props {
  setFavouritesUsers: Dispatch<SetStateAction<string[]>>;
  favouritesUsers: string[];
  deletedUsers: string[];
  setDeletedUsers: Dispatch<SetStateAction<string[]>>;
}

export const UsersSearchPage: FC<Props> = ({ setFavouritesUsers, favouritesUsers, deletedUsers, setDeletedUsers }) => {
  // Get search query
  const location = useLocation<LocationState>();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');

  const [users, setUsers] = React.useState<UserAPI[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Fetch users by query
  React.useEffect(() => {
    // Clean search field
    setLoading(true);

    // Search users by query
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.items);
        // Break if there are no results
        if (data.total_count === 0) {
          setLoading(false);
          return;
        }
        // Fetch extra info for each user
        getFullUsersInfo(data.items, setUsers, setLoading, favouritesUsers, deletedUsers);
      });
  }, [query]);

  return (
    <Container maxWidth="lg">
      {!loading ? (
        <>
          <Typography variant="h3" sx={{ mt: 3, mb: 0 }}>
            Пользователи по запросу: {query}
          </Typography>
          {users.length > 0 ? (
            <UsersList
              users={users}
              setUsers={setUsers}
              setFavouritesUsers={setFavouritesUsers}
              setDeletedUsers={setDeletedUsers}
            />
          ) : (
            <Typography paragraph variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
              Ничего не найдено
            </Typography>
          )}
        </>
      ) : (
        <Loader loading={loading} />
      )}
    </Container>
  );
};
