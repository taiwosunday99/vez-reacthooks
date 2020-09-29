import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100
  }
}));
// const userInfo = localStorage.getItem('userReg');
const ProfileDetails = ({ className, user, ...rest }) => {
  console.log('user', user)
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
          <Typography
            className={classes.name}
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.name}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body1"
          >
          <p>
          {user.userEmail}
          </p>
            
            {' '}
            <Link
              component={RouterLink}
              to="/pricing"
            >
            <p>
            {/* {user.orgId} */}
            </p>
              
            </Link>
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        {/* <Button
          fullWidth
          variant="text"
        >
          Remove picture
        </Button> */}
      </CardActions>
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default ProfileDetails;
