import React, { useState } from "react";
import {
    DialogCloseButton,
} from "@/components/ConfirmationDialog";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { closeDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { queryClient } from "@/app/App";
import { API_ROUTES } from "@/constants/api";
import { usePatch } from "@/utils/hooks/useApi";

export default function ViewEditSubmissionDialog({ id, rowData }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(rowData?.formValue || {});
    const [isEditable, setIsEditable] = useState(false);

    const handleInputChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };


    const { mutate, isPending } = usePatch(`${API_ROUTES["updateFormSubmission"]}/${rowData["id"]}`, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-form-Submissions"] });
            queryClient.invalidateQueries({ queryKey: [id] });
            dispatch(
                showMessage({
                    message: "Submission saved successfully.",
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'success'
                })
            )
            dispatch(closeDialog());
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


    const handleSave = () => {
        mutate({formValue: formData});
        setIsEditable(false);
    };

    return (
        <>
            <DialogCloseButton handleClose={() => dispatch(closeDialog())} />
            <DialogTitle>{isEditable ? "Edit" : "Submission" } Details</DialogTitle>
            <DialogContent
                className="w-[600px] p-12 pt-0"
                style={{
                    maxHeight: "70vh", 
                    overflowY: "auto", 
                }}
            >
                <Box mb={2}>
                    <Typography variant="h6" fontSize="1rem" gutterBottom>
                        Submission ID: {rowData["id"]}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {Object.entries(formData).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <TextField
                                label={key}
                                value={Array.isArray(value) ? value.join(", ") : value}
                                onChange={(e) =>
                                    handleInputChange(
                                        key,
                                        Array.isArray(value)
                                            ? e.target.value.split(",").map((item) => item.trim())
                                            : e.target.value
                                    )
                                }
                                fullWidth
                                variant="outlined"
                                inputProps={{
                                    readOnly: !isEditable, 
                                }}
                                sx={{
                                    input: {
                                        color: !isEditable ? "grey" : "black",
                                    },
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                {isEditable && <Button onClick={() => setIsEditable(!isEditable)} variant="outlined" className="p-color">
                    Cancel
                </Button>}
                {isEditable ? (
                    <Button
                        onClick={handleSave}
                        variant="outlined"
                        className="p-color"
                        disabled={isPending}
                    >
                        {isPending ? <CircularProgress size={20} /> : "Save"}
                    </Button>
                ) : (
                    <Button
                        onClick={() => setIsEditable(true)}
                         variant="outlined"
                        className="p-color"
                    >
                        Edit
                    </Button>
                )}
            </DialogActions>
        </>
    );
}
