import React, { FC, FormEvent, Dispatch, SetStateAction, useRef } from 'react';
import { NavLink, Route, Switch, RouteComponentProps, useHistory, Link as RouterLink } from 'react-router-dom';

// MUI
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';

interface MatchParams {
  login: string;
}

interface Props {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  favouritesUsers: string[];
}

export const Header: FC<Props> = ({ searchValue, setSearchValue, favouritesUsers }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = inputRef.current?.value;
    if (!value?.trim().length) {
      return;
    }
    setSearchValue(value);
    history.push(`/search?query=${value}`);
  };

  // Toolbar styles
  const AppToolbar = styled(Toolbar)<ToolbarProps>(({ theme }) => ({
    padding: theme.spacing(2, 0),
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0),
      flexWrap: 'nowrap',
    },
  }));

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <AppToolbar>
            <Typography variant="h6" noWrap component="div" sx={{ mb: { xs: 1, sm: 0 } }}>
              <NavLink to="/">Пользователи гитхаба</NavLink>
            </Typography>
            <Switch>
              <Route
                path="/users/:login"
                render={(props: RouteComponentProps<MatchParams>) => (
                  <Typography variant="h6" sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
                    {'// '}
                    <a className="header__navigation-link header__navigation-link--user">{props.match.params.login}</a>
                  </Typography>
                )}
              />
              <Route path="/search">
                <Typography variant="h6" sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
                  {'// '}
                  <a className="header__navigation-link header__navigation-link--user">Поиск</a>
                </Typography>
              </Route>
            </Switch>
            <Box sx={{ flexGrow: 1 }} />
            <Stack
              sx={{
                width: { xs: '100%', sm: 310 },
              }}
              direction="row"
            >
              {/* Search  */}
              <Paper
                component="form"
                sx={{
                  flex: '1 1 auto',
                  ml: { xs: 0, sm: 2 },
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onSubmit={onSubmit}
              >
                <InputBase
                  type="search"
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Поиск пользователей"
                  inputProps={{
                    'aria-label': 'Поиск пользователей',
                  }}
                  inputRef={inputRef}
                  defaultValue={searchValue}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="Search">
                  <SearchIcon />
                </IconButton>
              </Paper>
              {/* Link to favourites page  */}
              <IconButton
                component={RouterLink}
                to="/favourites"
                size="large"
                aria-label="Show favourites"
                color="inherit"
              >
                <Badge badgeContent={favouritesUsers.length} color="error">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Stack>
          </AppToolbar>
        </Container>
      </AppBar>
    </>
  );
};
