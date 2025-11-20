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

const schema = yup.object({
    analyticName: yup.string().required("Required.")
});

const defaultValues = { analyticName: "" };

const AddAnalytic = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const emailForm = useForm({
        mode: 'all',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { reset, control, handleSubmit, formState } = emailForm;
    const { isValid, dirtyFields, errors } = formState;

    const { mutate: createAnalyticMutate, isPending } = usePost(API_ROUTES["createAnalytic"], {
        onSuccess: (response) => {
            reset();
            queryClient.invalidateQueries({ queryKey: ["get-analytic"] });
            dispatch(closeDialog());
            dispatch(
                showMessage({
                    message: `Analytic created successfully.`,
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'success'
                })
            )
            router?.push(`/analytics/${get(response, "result.id")}`);
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

    const createAnalytic = (values) => {
        const updatedValues = {
            ...values,
            data: {
                reportItems: [
                    { id: 1, name: 'Impressions' },
                    { id: 2, name: 'Website Views' },
                    { id: 3, name: 'Professions of Faith' },
                ],
                platforms: { id: "All", name: "All" },
                colorScheme: "light",
                embedOption: "report",
                width: "600",
                height: "600",
            }
        };

        createAnalyticMutate(updatedValues);
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
                <Typography variant="h6" component="div" sx={{ fontWeight: 500, }}>Add Analytic</Typography>
            </DialogTitle>
            <form onSubmit={handleSubmit(createAnalytic)}>
                <DialogContent className='w-[400px] p-0'>
                    <Grid container className='p-24' spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="analyticName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={!!errors?.analyticName}
                                        required
                                        helperText={errors?.analyticName?.message}
                                        label="analytic Name"
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

export default AddAnalytic;
