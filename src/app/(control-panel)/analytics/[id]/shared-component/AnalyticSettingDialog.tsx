import { queryClient } from "@/app/App";
import { DialogCloseButton } from "@/components/ConfirmationDialog";
import { API_ROUTES } from "@/constants/api";
import { usePatch } from "@/utils/hooks/useApi";
import { closeDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField, List, ListItem, IconButton, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    analyticName: yup.string().required("Analytic Name is required"),
});

export default function AnalyticSettingDialog({ id, analyticData }) {
    const dispatch = useDispatch();
    const {
        control,
        handleSubmit,
        setError,
        watch,
        resetField,
        formState: { errors },
    } = useForm({
        defaultValues: {
            analyticName: analyticData?.analyticName || "",
        },
        resolver: yupResolver(schema),
    });

    const { mutate: updateAnalyticMutate, isPending: updateAnalyticIsPending } = usePatch(`${API_ROUTES["updateAnalytic"]}/${id}`, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-analytic"] });
            queryClient.invalidateQueries({ queryKey: [id] });
            dispatch(
                showMessage({
                    message: 'Analytic edited successfully',
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'success'
                })
            )
            dispatch(closeDialog())
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


    const onSubmit = (data) => {
        updateAnalyticMutate({
            analyticName: data.analyticName,
        });
    };

    return (
        <>
            <DialogCloseButton handleClose={() => dispatch(closeDialog())} />
            <DialogTitle>Analytic Setting</DialogTitle>
            <DialogContent className='w-[500px] p-12'>
                <Grid container rowSpacing={2}>
                    {/* Analytic Name */}
          <Grid item xs={12}>
                        <Controller
                            name="analyticName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="dense"
                                    label="Analytic Name"
                                    fullWidth
                                    variant="outlined"
                                    error={!!errors.analyticName}
                                    helperText={errors.analyticName?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" className="p-color" onClick={() => dispatch(closeDialog())}>Cancel</Button>
                <Button variant="outlined" className="p-color" onClick={handleSubmit(onSubmit)}>
                    {updateAnalyticIsPending ? <CircularProgress size={20} /> : "Save"}
                </Button>
            </DialogActions>
        </>
    );
}