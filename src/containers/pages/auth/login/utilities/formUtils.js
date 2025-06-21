import * as Yup from 'yup';

export const initialValues = {
  account: '',
  username: '',
  password: '',
};

export const validationSchema = Yup.object().shape({
  account: Yup.string().required('Account is required'),

  username: Yup.string().required('Username is required'),

  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
});
