/* eslint-disable import/no-extraneous-dependencies */
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { isUnexpectedError } from '@/utilities/helpers';

function useHandleApiResponse(error, isSuccess, successMessage) {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isSuccess && successMessage) {
      enqueueSnackbar(successMessage, { variant: 'success' });
    }

  }, [isSuccess, successMessage, enqueueSnackbar]);

  useEffect(() => {
    if (error) {
      if (isUnexpectedError(error)) {
        enqueueSnackbar('An unexpected error occurred. Please try again.', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar(
          error?.data?.non_field_errors?.[0] || 'Something went wrong',
          { variant: 'error' }
        );
      }
    }
  }, [error, enqueueSnackbar]);

  return null;
}

export default useHandleApiResponse;
