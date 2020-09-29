import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Link,
  // FormHelperText,
  TextField,
  makeStyles
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// import axios from 'axios';

const useStyles = makeStyles(() => ({
  root: {}
}));

const JWTLogin = ({ className, state, ...rest }) => {
  const classes = useStyles();
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const history = useHistory();

  return (
    <Formik
      initialValues={{
        email: 'demo@vezeti.net',
        password: 'Password123',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        password: Yup.string()
          .max(255)
          .required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response = await login(values);
          if (isMountedRef.current && response.isSuccess) {
            setStatus({ success: true });
            setSubmitting(true);
            history.push('/app/account');
          } else {
            console.error(response.data);
            setStatus({ success: false });
            setErrors({ submit: response.data.responseMessage });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            autoFocus
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {errors.submit && (
            <Card bgcolor="secondary">
              <CardContent>
                <Typography variant="body2" color="error" component="p">
                  {errors.submit}
                </Typography>
              </CardContent>
            </Card>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Log In
            </Button>
          </Box>
          {/* <Box mt={2}>
          <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    console.info("I'm a button.");
                  }}
                      >
                  Forgot Password?
                </Link>
                </Box> */}
          <Box mt={2}>
            <Alert severity="info">
              <div>
                Use <b>demo@vezeti.net</b> and password <b>Password123</b>
              </div>
            </Alert>
          </Box>
          <button><a href="/password">Forgot Password?</a></button>
        </form>
      )}
      
    </Formik>
  );
};

JWTLogin.propTypes = {
  className: PropTypes.string
};

export default JWTLogin;
