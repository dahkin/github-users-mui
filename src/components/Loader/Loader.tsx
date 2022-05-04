import React, { FC } from 'react';

// MUI
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

interface Props {
  loading: boolean;
}

export const Loader: FC<Props> = ({ loading }) => {
  return (
    <Backdrop sx={{ color: 'background.paper', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
