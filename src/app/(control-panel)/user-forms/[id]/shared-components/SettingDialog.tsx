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
    formName: yup.string().required("Form Name is required"),
    submissionMessage: yup.string().required("Submission message is required"),
    emailInput: yup
        .string()
        .email("Invalid email address format"),
});

export default function SettingDialog({ id, emailList, setEmailList, formData }) {
    const dispatch = useDispatch();
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emails, setEmails] = useState(emailList || []);

    const handleEmailInputChange = (e) => {
        setEmailInput(e.target.value.trim());
        emailError && setEmailError("");
    };

    const {
        control,
        handleSubmit,
        setError,
        watch,
        resetField,
        formState: { errors },
    } = useForm({
        defaultValues: {
            formName: formData?.formName || "",
            submissionMessage: formData?.submitMessage || "",
            emailInput: "",
        },
        resolver: yupResolver(schema),
    });

    const validateEmail = (email) => {
        const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return regex.test(email);
    };

    const handleAddEmail = () => {
        switch (true) {
            case emailInput === formData?.defaultMail:
            setEmailError("Default recipient email cannot be added again.");
            break;
            case emails.includes(emailInput):
                setEmailError("This email is already added.");
                break;
            case !validateEmail(emailInput):
                setEmailError("Invalid email address format.");
                break;
            default:
                setEmails((prevEmails) => [...prevEmails, emailInput]);
                setEmailInput("");
                break;
        }
    };

    const { mutate, isPending } = usePatch(`${API_ROUTES["updateForm"]}/${id}`, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-forms"] });
            queryClient.invalidateQueries({ queryKey: [id] });
            dispatch(
                showMessage({
                    message: "Email settings saved successfully.",
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

    const handleRemoveEmail = (emailToRemove) => {
        setEmails((prevEmails) => prevEmails.filter((email) => email !== emailToRemove));
    };

    const onSubmit = (data) => {
        mutate({
            email: emails,
            formName: data.formName,
            submitMessage: data.submissionMessage,
        });
        setEmailList(emails);
    };

    return (
        <>
            <DialogCloseButton handleClose={() => dispatch(closeDialog())} />
            <DialogTitle>Form Setting</DialogTitle>
            <DialogContent className='w-[500px] p-12'>
                <Grid container rowSpacing={2}>
                    {/* Form Name */}
          <Grid item xs={12}>
                        <Controller
                            name="formName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="dense"
                                    label="Form Name"
                                    fullWidth
                                    variant="outlined"
                                    error={!!errors.formName}
                                    helperText={errors.formName?.message}
                                />
                            )}
                        />
                    </Grid>
                    {/* Submission Message */}
                    <Grid item xs={12}>
                        <Controller
                            name="submissionMessage"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="dense"
                                    label="Submission Message"
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" color="textSecondary">
                            Notifications are sent to the email below. Add more recipients if needed.
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="textPrimary" mt={1}>
                            {formData?.defaultMail}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="email"
                                label="Recipient Email(s)"
                                type="text"
                                value={emailInput}
                                onChange={handleEmailInputChange}
                                fullWidth
                                variant="outlined"
                                required
                                error={!!emailError}
                                helperText={emailError || ""}
                            />
                             <Button
                            onClick={handleAddEmail}
                            variant="contained"
                            className="p-bg-color"
                            disabled={!emailInput}
                            sx={{ mt: 1 }}
                        >
                            Add Email
                        </Button>
                        </Grid>
                    {/* Email List */}
                    {emails.length > 0 && (
                        <Grid item xs={12}>
                            <List>
                                {emails.map((email, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <IconButton
                                                title={"Remove Email"}
                                                edge="end"
                                                onClick={() => handleRemoveEmail(email)}
                                            >
                                                <FuseSvgIcon>material-solid:delete</FuseSvgIcon>
                                            </IconButton>
                                        }
                                    >
                                        {email}
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" className="p-color" onClick={() => dispatch(closeDialog())}>Cancel</Button>
                <Button variant="outlined" className="p-color" onClick={handleSubmit(onSubmit)}>
                    {isPending ? <CircularProgress size={20} /> : "Save"}
                </Button>
            </DialogActions>
        </>
    );
}