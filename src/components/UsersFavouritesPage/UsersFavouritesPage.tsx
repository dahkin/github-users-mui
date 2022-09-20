import React, { Dispatch, FC, SetStateAction } from 'react';
import { UsersList } from '../UsersList/UsersList';
import { Loader } from '../Loader/Loader';
import { UserAPI } from '../../types';

// MUI
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

interface Props {
  setSearchValue: Dispatch<SetStateAction<string>>;
  favouritesUsers: string[];
  setFavouritesUsers: Dispatch<SetStateAction<string[]>>;
  deletedUsers: string[];
  setDeletedUsers: Dispatch<SetStateAction<string[]>>;
}

export const UsersFavouritesPage: FC<Props> = ({
  setSearchValue,
  favouritesUsers,
  setFavouritesUsers,
  deletedUsers,
  setDeletedUsers,
}) => {
  const [users, setUsers] = React.useState<UserAPI[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const userRequests = (users: string[]): Promise<UserAPI>[] =>
    users.map((user) => fetch(`https://api.github.com/users/${user}`).then((res) => res.json()));

  React.useEffect(() => {
    // Clean search field
    setSearchValue('');

    // Get favourites users info
    if (favouritesUsers.length > 0) {
      Promise.allSettled(userRequests(favouritesUsers))
        .then((res) => {
          res.forEach((result) => {
            if (result.status === 'fulfilled') {
              setUsers((prevItems) => [
                ...prevItems,
                {
                  id: result.value.id,
                  avatar_url: result.value.avatar_url,
                  company: result.value.company,
                  repos: result.value.public_repos,
                  login: result.value.login,
                  public_repos: result.value.public_repos,
                  isFavourite: true,
                  isDeleted: deletedUsers.includes(result.value.login),
                },
              ]);
              setLoading(false);
            }
          });
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Container maxWidth="lg">
      {!loading ? (
        <>
          <Typography variant="h3" sx={{ mt: 3, mb: 0 }}>
            Избранные пользователи
          </Typography>
          {favouritesUsers.length > 0 ? (
            <UsersList
              users={users}
              setUsers={setUsers}
              setFavouritesUsers={setFavouritesUsers}
              setDeletedUsers={setDeletedUsers}
              hideFavourites
            />
          ) : (
            <Typography paragraph variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
              В вашем списке ничего нет…
            </Typography>
          )}
        </>
      ) : (
        <Loader loading={loading} />
      )}
    </Container>
  );
};
