import React from 'react'
import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { usePost } from '@/utils/hooks/useApi'
import { DialogCloseButton } from '@/components/ConfirmationDialog'
import { queryClient } from '@/app/App'
import { API_ROUTES } from '@/constants/api'
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice'
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice'
import { useRouter } from 'next/navigation'
import { get } from 'lodash'

// Define your validation schema using Yup
const schema = yup.object({
    formName: yup.string().required("Required.")
});

const defaultValues = { formName: "" };

const AddForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const emailForm = useForm({
        mode: 'all',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { reset, control, handleSubmit, formState } = emailForm;
    const { isValid, dirtyFields, errors } = formState;

    const { mutate: createformMutate, isPending } = usePost(API_ROUTES["createForm"], {
        onSuccess: (response) => {
            reset();
            queryClient.invalidateQueries({ queryKey: ["get-forms"] });
            dispatch(closeDialog());
            dispatch(
                showMessage({
                    message: `Form has been successfully created.`,
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'success'
                })
            )
            router?.push(`/user-forms/${get(response, "result.id")}`);
        },
        onError: (error) => {
            dispatch(
                showMessage({
                    message: error ?? 'Something went wrong',
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'error'
                })
            )

        },
    });

    const createForm = (values) => {
        const updatedValues = {
            ...values,
            description: ""
        };

        createformMutate(updatedValues);
    };

    const submit = () => {
        dispatch(closeDialog());
        router?.push("/user-forms/add");
    }

    return (
        <>
            <DialogCloseButton handleClose={() => dispatch(closeDialog())} />
            <DialogTitle
                sx={{
                    background: "#fff",
                    color: "#000",
                    minHeight: '55px',
                    borderBottom: '1px solid #ddd'
                }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 500, }}>Add Form</Typography>
            </DialogTitle>
            <form onSubmit={handleSubmit(createForm)}>
                <DialogContent className='w-[400px] p-0'>
                    <Grid container className='p-24' spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="formName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={!!errors?.formName}
                                        required
                                        helperText={errors?.formName?.message}
                                        label="Form Name"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ borderTop: '1px solid #ddd' }} className='px-24 w-full'>
                    <Button
                        variant='outlined'
                        className="p-color"
                        onClick={() => dispatch(closeDialog())}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant='outlined'
                        className="p-color"
                        type="submit"
                        disabled={_.isEmpty(dirtyFields) || !isValid || isPending}
                    >
                        {isPending ? <CircularProgress size={20} /> : "Submit"}
                    </Button>
                </DialogActions>
            </form>
        </>
    )
}

export default AddForm;
