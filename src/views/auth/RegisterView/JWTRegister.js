import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Card,
  CardContent,
  FormHelperText,
  TextField,
  Typography,
  Link,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// import axios from 'axios';
// import authProvider from '../../../contexts/JWTAuthContext';
import { useHistory } from 'react-router-dom';

// const userInfo = localStorage.getItem('userReg');

const useStyles = makeStyles(() => ({
  root: {}
}));

const JWTRegister = ({ className, ...rest }) => {
  const classes = useStyles();
  const { register } = useAuth();
  const { isAuthenticated } = useAuth();

  const isMountedRef = useIsMountedRef();
  const history = useHistory();

  return (
    <Formik
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
        mobile: '',
        password: '',
        policy: false,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        firstName: Yup.string()
          .min(2)
          .max(64)
          .required('First Name is required'),
        lastName: Yup.string()
          .min(2)
          .max(64)
          .required('Last Name is required'),
        password: Yup.string()
          .min(8)
          .max(32)
          .required('Password is required'),
        policy: Yup.boolean().oneOf([true], 'This field must be checked')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const resp = await register(values);
          if (isMountedRef.current && resp.isSuccess) {
            localStorage.setItem('userReg', JSON.stringify(resp.data));
            setStatus({ success: true });
            setSubmitting(true);
            history.push('/app/account');
          } else {
            console.error(resp);
            setStatus({ success: false });
            setErrors({ submit: resp.data.responseMessage });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
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
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="First Name"
            margin="normal"
            name="firstName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.firstName}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Last Name"
            margin="normal"
            name="lastName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.lastName}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Mobile"
            margin="normal"
            name="mobile"
            onBlur={handleBlur}
            onChange={handleChange}
            type="number"
            value={values.mobile}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
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
          <Box alignItems="center" display="flex" mt={2} ml={-1}>
            <Checkbox
              checked={values.policy}
              name="policy"
              onChange={handleChange}
            />
            <Typography variant="body2" color="textSecondary">
              I have read the{' '}
              <Link component="a" href="#" color="secondary">
                Terms and Conditions
              </Link>
            </Typography>
          </Box>
          {Boolean(touched.policy && errors.policy) && (
            <FormHelperText error>{errors.policy}</FormHelperText>
          )}
          {errors.submit && (
            <Card bgColor="secondary">
              <CardContent>
                <Typography variant="body2" color="error" component="p">
                  {errors.submit}
                </Typography>
              </CardContent>
            </Card>
            // <Box mt={3}>
            //   <FormHelperText error>{errors.submit}</FormHelperText>
            // </Box>
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
              Register
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTRegister.propTypes = {
  className: PropTypes.string
};

export default JWTRegister;
