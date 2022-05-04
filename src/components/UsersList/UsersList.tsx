import React, { Dispatch, FC, SetStateAction } from 'react';
import { UserAPI } from '../../types';
import { Link as RouterLink } from 'react-router-dom';
import { numberDeclination } from '../../utils';

// MUI
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { grey, blue } from '@mui/material/colors';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type Props = {
  users: UserAPI[];
  setUsers: Dispatch<SetStateAction<UserAPI[]>>;
  setFavouritesUsers: Dispatch<SetStateAction<string[]>>;
  setDeletedUsers: Dispatch<SetStateAction<string[]>>;
  hideFavourites?: boolean;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const UsersList: FC<Props> = ({ users, setUsers, setFavouritesUsers, setDeletedUsers, hideFavourites }) => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [deletedItem, setDeletedItem] = React.useState<UserAPI | null>();

  // Colors
  const favouritesColor = blue[50];
  const defaultColor = 'background.paper';

  // Add to favourites
  const addToFavourites = (item: UserAPI) => {
    setUsers((prevItems) => prevItems.map((obj) => (obj === item ? { ...obj, isFavourite: !item.isFavourite } : obj)));
    setFavouritesUsers((prevItems) =>
      !item.isFavourite ? [...prevItems, item.login] : prevItems.filter((user) => user !== item.login)
    );
  };

  // Delete user
  const deleteItem = (item: UserAPI) => {
    setUsers((prevItems) => prevItems.map((obj) => (obj === item ? { ...obj, isDeleted: !item.isDeleted } : obj)));
    setOpenModal(false);
    setDeletedItem(null);
    setOpenAlert(true);
    // Add to deleted list
    setDeletedUsers((prevItems) => [...prevItems, item.login]);
    // Remove from favourites list
    setFavouritesUsers((prevItems) => (item.isFavourite ? prevItems.filter((user) => user !== item.login) : prevItems));
  };

  // Confirm delete action with a modal
  const confirmDelete = (item: UserAPI) => {
    setDeletedItem(item);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => setOpenModal(false);

  // Close alert
  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3, mt: 3 }}>
        {users.map((item: UserAPI) => (
          <Fade
            in={!item.isDeleted && !(hideFavourites && !item.isFavourite)}
            timeout={400}
            unmountOnExit
            key={item.id}
          >
            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: item.isFavourite ? favouritesColor : defaultColor,
                }}
              >
                <CardHeader
                  avatar={<Avatar src={item.avatar_url} alt={item.login} sx={{ width: 56, height: 56 }} />}
                  sx={{ alignItems: 'initial' }}
                  action={
                    <ButtonGroup>
                      <IconButton
                        aria-label={!item.isFavourite ? 'Add to favourites' : 'Remove from favourites'}
                        onClick={() => addToFavourites(item)}
                      >
                        {item.isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton aria-label="Delete item" onClick={() => confirmDelete(item)}>
                        <DeleteIcon />
                      </IconButton>
                    </ButtonGroup>
                  }
                  title={
                    <Link component={RouterLink} to={`/users/${item.login}`}>
                      {item.login}
                    </Link>
                  }
                  subheader={
                    <>
                      <Typography paragraph sx={{ color: grey[400], mb: 0, mt: 1 }} variant="caption">
                        {item.repos != null &&
                          item.repos +
                            ' ' +
                            numberDeclination(item.repos, ['репозиторий', 'репозитория', 'репозиториев'])}
                      </Typography>
                      {item.company && (
                        <Typography paragraph sx={{ color: grey[400], mb: 0, mt: 1 }} variant="caption">
                          {item.company}
                        </Typography>
                      )}
                    </>
                  }
                />
              </Card>
            </Grid>
          </Fade>
        ))}
      </Grid>

      {deletedItem && (
        <Dialog open={openModal} onClose={handleCloseModal} aria-labelledby="alert-modal-title">
          <DialogTitle id="alert-dialog-title" sx={{ minWidth: '350px' }}>
            Delete user &quot;{deletedItem.login}&quot;?
          </DialogTitle>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseModal} color="error">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteItem(deletedItem)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar autoHideDuration={1000} open={openAlert} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          User was deleted!
        </Alert>
      </Snackbar>
    </>
  );
};
