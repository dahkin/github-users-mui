import React, { Dispatch, FC, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { RepoAPI, UserFullAPI } from '../../types';
import { numberUnit, numberFormat } from '../../utils';

// MUI
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';

interface Props {
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const UserProfilePage: FC<Props> = ({ setSearchValue }) => {
  // Get login
  const { login }: { login?: string } = useParams();

  const [user, setUser] = React.useState<UserFullAPI | null>(null);
  const [repos, setRepos] = React.useState<RepoAPI[] | null>(null);
  const [loadingRepos, setLoadingRepos] = React.useState<boolean>(true);
  const [errorRepos, setErrorRepos] = React.useState<string>('');

  React.useEffect(() => {
    // Clean search field
    setSearchValue('');

    setLoadingRepos(true);

    // Fetch user info
    fetch(`https://api.github.com/users/${login}`, {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });

    // Fetch user repos info
    fetch(`https://api.github.com/users/${login}/repos`, {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message || data.length === 0) {
          setErrorRepos('Репозитории не найдены');
        }
        setRepos(data);
        setLoadingRepos(false);
      })
      .catch(() => {
        setErrorRepos('Ошибка, попробуйте еще раз');
        setLoadingRepos(false);
      });
  }, [login]);

  // Not render if user is empty
  if (user === null) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Avatar src={user.avatar_url} alt={user.login} sx={{ width: 150, height: 150 }} />
        <Stack>
          <Typography variant="h5" sx={{ mb: { xs: 1, sm: 0 } }}>
            {user.name && user.name + ', '}
            {user.login}
          </Typography>
          <Typography paragraph sx={{ mb: { xs: 1, sm: 0, color: grey[400] } }}>
            {numberFormat(user.followers, 1)} {numberUnit(user.followers, ['подписчик', 'подписчика', 'подписчиков'])}
            {` · `}
            {numberFormat(user.following, 1)} {numberUnit(user.following, ['подписка', 'подписки', 'подписок'])}
            {user.blog && (
              <>
                {` · `}
                <Link href={user.blog} target="_blank" rel="noreferrer">
                  {user.blog}
                </Link>
              </>
            )}
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ mt: 4 }}>
        {!loadingRepos ? (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" sx={{ mb: { xs: 1, sm: 0 } }}>
                Репозитории
              </Typography>
              {repos && repos.length > 0 && (
                <Link
                  href={`https://github.com/${login}?tab=repositories`}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ typography: 'body2' }}
                >
                  Все репозитории
                </Link>
              )}
            </Stack>

            <Box sx={{ mb: 3, mt: 3 }}>
              {!errorRepos ? (
                <Grid container spacing={2}>
                  {repos &&
                    repos.map((item) => (
                      <Grid item xs={12} md={6} lg={4} key={item.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Link href={item.html_url} target="_blank" rel="noreferrer" sx={{ typography: 'body2' }}>
                              {item.name}
                            </Link>
                            <Typography paragraph sx={{ color: grey[400], mb: 0, mt: 1 }} variant="caption">
                              {item.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <Typography paragraph sx={{ mb: { xs: 1, sm: 0 } }}>
                  {errorRepos}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Typography variant="h5" sx={{ mb: { xs: 1, sm: 0 } }}>
            Загрузка репозиториев...
          </Typography>
        )}
      </Box>
    </Container>
  );
};
