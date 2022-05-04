import React, { FC, useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Header } from '../Header/Header';
import { UsersPage } from '../UsersPage/UsersPage';
import { UserProfilePage } from '../UserProfilePage/UserProfilePage';
import { UsersSearchPage } from '../UsersSearchPage/UsersSearchPage';
import { UsersFavouritesPage } from '../UsersFavouritesPage/UsersFavouritesPage';

// MUI
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';

const baseGlobalStyles = (
  <GlobalStyles
    styles={{
      body: { backgroundColor: '#fff' },
      margin: 0,
    }}
  />
);

export const App: FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [favouritesUsers, setFavouritesUsers] = React.useState<string[]>([]);
  const [deletedUsers, setDeletedUsers] = React.useState<string[]>([]);

  // Get location path
  const { pathname } = useLocation();

  // Scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <CssBaseline />
      {baseGlobalStyles}
      <Header searchValue={searchValue} setSearchValue={setSearchValue} favouritesUsers={favouritesUsers} />

      <Switch>
        <Route path="/users/:login">
          <UserProfilePage setSearchValue={setSearchValue} />
        </Route>
        <Route path="/search">
          <UsersSearchPage
            setFavouritesUsers={setFavouritesUsers}
            favouritesUsers={favouritesUsers}
            deletedUsers={deletedUsers}
            setDeletedUsers={setDeletedUsers}
          />
        </Route>
        <Route path="/favourites">
          <UsersFavouritesPage
            setSearchValue={setSearchValue}
            favouritesUsers={favouritesUsers}
            setFavouritesUsers={setFavouritesUsers}
            deletedUsers={deletedUsers}
            setDeletedUsers={setDeletedUsers}
          />
        </Route>
        <Route path="/">
          <UsersPage
            setSearchValue={setSearchValue}
            setFavouritesUsers={setFavouritesUsers}
            favouritesUsers={favouritesUsers}
            deletedUsers={deletedUsers}
            setDeletedUsers={setDeletedUsers}
          />
        </Route>
      </Switch>
    </>
  );
};
