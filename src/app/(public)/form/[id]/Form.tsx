'use client'

import {
    Button,
    Grid,
    TextField,
    FormControl,
    FormControlLabel,
    Radio,
    Box,
    RadioGroup,
    FormLabel,
    InputLabel,
    Select,
    MenuItem,
    FormGroup,
    Checkbox,
    Typography,
    CircularProgress
} from "@mui/material";
import { FormContainer, SubmitButton } from "./styles/formStyles.ts"
import { useEffect, useMemo, useState } from "react";
import { APIRequest } from "@/utils/APIRequest.js";
import { API_ROUTES } from "@/constants/api.js";
import { useFetch, usePost } from "@/utils/hooks/useApi.js";
import FuseLoading from '@fuse/core/FuseLoading';
import { useDispatch } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";


export default function Form(props) {
    const id = props.params.id;

    const [formValues, setFormValues] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const dispatch = useDispatch();

    const validateField = (value, isRequired) =>
        isRequired && (!value || value.length === 0) ? ["This field is required."] : [];

    const handleInputChange = (label, value, isRequired) => {
        setFormValues((prev) => ({ ...prev, [label]: value }));
        setValidationErrors((prev) => ({
            ...prev,
            [label]: validateField(value, isRequired),
        }));
    };

    const validateForm = () => {
        const errors = {};
        formData.forEach(({ attributes: { label }, is_required }) => {
            const fieldErrors = validateField(formValues[label], is_required);
            if (fieldErrors.length > 0) errors[label] = fieldErrors;
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const { mutate, isPending: submitLoading, error: submitError, isSuccess } = usePost(API_ROUTES["submitForm"], {
        onSuccess: (data) => {
            dispatch(
                showMessage({
                    message: data?.message,
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'success'
                }))
            setFormValues({})
            setIsSubmitted(true);
        },
        onError: (submitError) => {
            console.error("Error:", submitError);
            dispatch(
                showMessage({
                    message: "Failed to submit form.",
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'error'
                }))
        },
    });


    const toCamelCase = (str) =>
        str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
                index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, "");
    
    const transformKeysToCamelCase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = toCamelCase(key);
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let parentHostname;
        try {
            parentHostname = window.parent.location.hostname;
        } catch (error) {
            console.error("Unable to access parent site's hostname:", error);
            parentHostname = null;
        }
        if (validateForm()) {
            const transformedFormValues = transformKeysToCamelCase(formValues);

            const payload = {
                formId: id,
                formValue: transformedFormValues
            };
    
            if (parentHostname) {
                payload.formSite = parentHostname;
            }
    
            mutate(payload);
        }
        else dispatch(showMessage({ message: "Please fill up all required fields!", variant: "error" }));
    };

    useEffect(() => {
        document.body.style.backgroundColor = "white";
        return () => {
          document.body.style.backgroundColor = "";
        };
      }, []);

    const renderElement = (element) => {
        const { type, attributes, options, id: elementId, is_required } = element;
        const { label, inputType } = attributes;
        const value = formValues[label] || "";

        const commonProps = {
            fullWidth: true,
            label,
            value,
            onChange: (e) => handleInputChange(label, e.target.value, is_required),
            error: !!validationErrors[label]?.length,
            helperText: validationErrors[label]?.[0] || "",
        };

        switch (type) {
            case "TextField":
                return (
                    <Grid item xs={12} md={8} key={elementId}>
                        <TextField
                            {...commonProps}
                            type={inputType || "text"}
                            InputLabelProps={{ shrink: ["date", "time"].includes(inputType) || undefined }}
                            required={is_required}
                        />
                    </Grid>
                );

            case "ChoiceRadioButton":
                return (
                    <Grid item xs={12} md={8} key={elementId}>
                        <FormControl>
                            <FormLabel>{label}</FormLabel>
                            <RadioGroup
                                row
                                name={label}
                                value={value}
                                onChange={(e) => handleInputChange(label, e.target.value, is_required)}
                                required={is_required}
                            >
                                {options?.map(({ id, label: optionLabel }) => (
                                    <FormControlLabel
                                        key={id}
                                        value={optionLabel.replace(/\s+/g, '')}
                                        control={<Radio />}
                                        label={optionLabel}
                                    />
                                ))}
                            </RadioGroup>
                            {validationErrors[label]?.[0] && (
                                <Typography color="error" variant="body2">
                                    {validationErrors[label]?.[0]}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>
                );

            case "DropdownMenu":
                return (
                    <Grid item xs={12} md={8} key={elementId}>
                        <FormControl fullWidth>
                            <InputLabel>{label}</InputLabel>
                            <Select {...commonProps} required={is_required}>
                                {options?.map(({ id, label: optionLabel }) => (
                                    <MenuItem key={id} value={optionLabel.replace(/\s+/g, '')}>
                                        {optionLabel}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                );

            case "ChoiceCheckBox":
                return (
                    <Grid item xs={12} md={8} key={elementId}>
                        <FormControl component="fieldset">
                            <FormLabel>{label}</FormLabel>
                            <FormGroup>
                                {options?.map(({ id, label: optionLabel }) => (
                                    <FormControlLabel
                                        key={id}
                                        control={
                                            <Checkbox
                                                checked={(value || []).includes(optionLabel)}
                                                onChange={(e) => {
                                                    const currentValues = new Set(value || []);
                                                    e.target.checked
                                                        ? currentValues.add(optionLabel)
                                                        : currentValues.delete(optionLabel);
                                                    handleInputChange(label, Array.from(currentValues), is_required);
                                                }}
                                            />
                                        }
                                        label={optionLabel}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Grid>
                );

            default:
                return null;
        }
    };

    const { data, isLoading, error } = useFetch(
        "getFormByID",
        `${API_ROUTES.getFormByID}/${id}`,
        {},
        { enabled: !!id }
    );

    useEffect(() => {
        if (data?.result?.description) {
            try {
                const parsedDescription = JSON.parse(data.result.description);
                setFormData(parsedDescription);

                const initialValues = parsedDescription.reduce((acc, field) => {
                    const { label } = field.attributes;
                    if (field.type === "ChoiceCheckBox") {
                        acc[label] = field.options?.filter((o) => o.default)?.map((o) => o.label) || [];
                    } else if (["ChoiceRadioButton", "DropdownMenu"].includes(field.type)) {
                        acc[label] = field.options?.find((o) => o.default)?.label || "";
                    } else {
                        acc[label] = field.attributes.text || "";
                    }
                    return acc;
                }, {});

                setFormValues(initialValues);
            } catch (err) {
                console.error("Failed to parse form description:", err);
            }
        }
    }, [data]);

    useEffect(() => {
        const allRequiredFieldsValid = formData.every(
            ({ attributes: { label }, is_required }) =>
                !is_required || (formValues[label] && formValues[label].length > 0)
        );
        setIsFormValid(allRequiredFieldsValid);
    }, [formValues, formData]);

    if (isLoading) return <FuseLoading />;
    if (error) return <div>Error: {error.message}</div>;

    return <div>
        <FormContainer onSubmit={handleSubmit}>
            {isSubmitted ?
                <>
                <Typography className="h1" textAlign="center" mb={3}>{data?.result?.submitMessage}</Typography>
                </>
            :<>
            <Typography className="h1" textAlign="center" mb={3}>{data?.result?.formName}</Typography>
            <Grid container gap={1} justifyContent="center" alignItems="center">
                {formData.map(renderElement)}
            </Grid>
            <Button
                variant='contained'
                type="submit"
                disabled={!isFormValid || submitLoading} 
                sx={{...SubmitButton}}
            >
                {submitLoading ? <CircularProgress size={20} /> : "Submit"}
            </Button>
                </>
            }
        </FormContainer>
    </div>
}