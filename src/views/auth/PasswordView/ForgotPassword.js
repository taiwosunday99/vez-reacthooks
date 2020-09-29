import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
// import wait from 'src/utils/wait';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ForgotPassword = ({ className, ...rest }) => {
    // console.log(user)
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { reset }  = useAuth();
  const isMountedRef = useIsMountedRef();

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required')
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          // await wait(500);
          const response = await reset(values)
          if (isMountedRef.current && response.isSuccess) {
            console.log('Response-Data: ', response)
            console.log('values: ', values)
            resetForm();
          setStatus({ success: true });
          setSubmitting(true);
          enqueueSnackbar(`A password reset link has been sent to  ${values.email} The link will expire in 15 minutes. 
          Note: This is just a SIMULATION...No email was sent!`, {
            variant: 'success'
          });
          } else {
            console.error(response.data);
            setStatus({ success: false });
            setErrors({ submit: response.data.responseMessage });
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
        <form onSubmit={handleSubmit}>
          <Card
            className={clsx(classes.root, className)}
            {...rest}
          >
            <CardHeader title="Enter Your Registered Email Address" />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={4}
                  sm={6}
                  xs={12}
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
                </Grid>
              </Grid>
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>
                    {errors.submit}
                  </FormHelperText>
                </Box>
              )}
            </CardContent>
            <Divider />
            <Box
              p={2}
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                color="secondary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          </Card>
          <button><a href="/">GO BACK TO HOMEPAGE?</a></button>
        </form>
      )}
    </Formik>
  );
};

ForgotPassword.propTypes = {
  className: PropTypes.string
};

export default ForgotPassword;
