import React, { useEffect, useState } from 'react'
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Droppable } from 'react-drag-and-drop';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable as DroppableList, Draggable } from "react-beautiful-dnd";
import FormElement from './FormElement';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { API_ROUTES } from '@/constants/api';
import { queryClient } from '@/app/App';
import { useFetch, usePatch } from '@/utils/hooks/useApi';
import { get } from 'lodash';
import { useRouter } from 'next/navigation';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const Content = ({ preview, id, leftSidebarOpen, setLeftSidebarOpen, setEmailList, setFormData, handlePreviewToggle }) => {
    const router = useRouter();
    const [formState, setFormState] = useState([]);
    const [editDialog, setEditDialog] = useState({
        open: false,
        data: null,
        editOptions: null
    });
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const dispatch = useDispatch();

    const formFieldsTypes = [
        {
            label: 'Text',
            name: 'text',
            type: 'text',
            placeholder: 'Enter text',
        },
        {
            label: 'Email',
            name: 'email',
            type: 'email',
            placeholder: 'Enter email',
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password',
            placeholder: 'Enter password',
        },
        {
            label: 'Number',
            name: 'number',
            type: 'number',
            placeholder: 'Enter number',
        },
        {
            label: 'Date',
            name: 'date',
            type: 'date',
            placeholder: 'Select date',
        },
        {
            label: 'Time',
            name: 'time',
            type: 'time',
            placeholder: 'Select time',
        },
        {
            label: 'Telephone',
            name: 'telephone',
            type: 'tel',
            placeholder: 'Enter telephone number',
        },
        {
            label: 'URL',
            name: 'url',
            type: 'url',
            placeholder: 'Enter URL',
        },
        {
            label: 'Color',
            name: 'color',
            type: 'color',
            placeholder: 'Select color',
        },
        // {
        //     label: 'Range',
        //     name: 'range',
        //     type: 'range',
        //     min: '0',
        //     max: '100',
        // },
        // {
        //     label: 'File Upload',
        //     name: 'file',
        //     type: 'file',
        // },
    ];

    const { data } = useFetch(id, `${API_ROUTES["getFormByID"]}/${id}`, {}, {
        enabled: Boolean(id)
    });

    const { mutate: updateFormMutate, isPending: updateFormIsPending } = usePatch(`${API_ROUTES["updateForm"]}/${id}`, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-forms"] });
            queryClient.invalidateQueries({ queryKey: [id] });
            dispatch(
                showMessage({
                    message: 'Form has been saved successfully',
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'success'
                })
            )
            router?.push(`/user-forms`);
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

    // handle show / hide icon on hover
    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);

    // handle show / hide edit field dialog
    const handleClickOpen = (data) => setEditDialog({
        open: true,
        data: data,
        editOptions: data.options ? data.options : null
    });

    const handleClose = () => setEditDialog({
        open: false,
        data: null,
        editOptions: null
    });

    const handleChange = (event) => setFormState((pre) => (
        pre.map(element => {
            if (event.target.name === element.key + element.id) {
                return {
                    ...element,
                    attributes: {
                        ...element.attributes,
                        text: event.target.value
                    }

                }
            } else return element;
        })
    ));

    const handleDelete = (id) => setFormState((pre) => (pre.filter(element => (element.key + element.id) != id)));

    // handle save the form data
    const saveFormData = (data) => {
        updateFormMutate({ description: JSON.stringify(data) })
    }

    const handleAddOption = () => setEditDialog((pre) => ({
        ...pre,
        data: {
            ...pre.data,
            options: [
                ...pre.editOptions,
                {
                    id: pre.editOptions.length + 1,
                    label: "",
                    value: "",
                    extras: null
                }
            ]
        },
        editOptions: [
            ...pre.editOptions,
            {
                id: pre.editOptions.length + 1,
                label: "",
                value: "",
                extras: null
            }
        ]
    }));

    const handleChangeEditOption = (e, id) => setEditDialog(prevState => ({
        ...prevState,
        editOptions: [...prevState.editOptions.map(option => {
            if (option.id === id) {
                return {
                    ...option,
                    [e.target.name]: e.target.value
                };
            }
            return option;
        })]
    }));

    const handleDeleteOption = (id) => setEditDialog((pre) => ({
        ...pre,
        data: {
            ...pre.data,
            options: [...pre.editOptions.filter(element => element.id != id).map((element, i) => ({ ...element, id: i + 1 }))]
        },
        editOptions: [...pre.editOptions.filter(element => element.id != id).map((element, i) => ({ ...element, id: i + 1 }))]
    }))

    const handleEditFields = () => {
        setFormState((pre) => ([...pre.map(element => {
            if (element.id === editDialog.data.id) {
                if (editDialog.data.options) {
                    return {
                        ...editDialog.data,
                        options: editDialog.editOptions,
                    }
                } else return {
                    ...editDialog.data,
                }
            } else return element;
        })]));
        handleClose();
    }

    const handleOnDrop = (type) => {
        switch (type) {
            case 'text_entry':
                setFormState((pre) => ([
                    ...pre,
                    {
                        "id": pre.length + 1,
                        "key": "first_name",
                        "type": "TextField",
                        "attributes": {
                            "width": "match_parent",
                            "height": "wrap_content",
                            "label": "Name",
                            "text": "",
                            "textColor": "#FF0000",
                            "maxLengthOfChar": null,
                            "inputType": "text",
                            "display_format": null,
                            "saveRestoreLabel": null,
                            "saveRestoreDisable": null,
                            "saveRestoreVisible": null,
                            "cancelClearLabel": null,
                            "cancelClearDisable": null,
                            "cancelClearVisible": null,
                            "dropLabel": null,
                            "dropDisable": null,
                            "dropVisible": null
                        },
                        "validations": [
                            {
                                "type": "Name",
                                "condition": null,
                                "message": "Please enter first name"
                            }
                        ],
                        "options": null,
                        "is_required": true
                    }
                ]))
                break;

            case 'number_entry':
                setFormState((pre) => ([
                    ...pre,
                    {
                        "id": pre.length + 1,
                        "key": "age",
                        "type": "TextField",
                        "attributes": {
                            "width": "match_parent",
                            "height": "wrap_content",
                            "label": "Age",
                            "text": "",
                            "textColor": "#FF0000",
                            "maxLengthOfChar": null,
                            "inputType": "number",
                            "display_format": null,
                            "saveRestoreLabel": null,
                            "saveRestoreDisable": null,
                            "saveRestoreVisible": null,
                            "cancelClearLabel": null,
                            "cancelClearDisable": null,
                            "cancelClearVisible": null,
                            "dropLabel": null,
                            "dropDisable": null,
                            "dropVisible": null
                        },
                        "validations": [
                            {
                                "type": "Age",
                                "condition": null,
                                "message": "Please enter your age"
                            }
                        ],
                        "options": null,
                        "is_required": true
                    }
                ]))
                break;

            case 'email_entry':
                setFormState((pre) => ([
                    ...pre,
                    {
                        "id": pre.length + 1,
                        "key": "email",
                        "type": "TextField",
                        "attributes": {
                            "width": "match_parent",
                            "height": "wrap_content",
                            "label": "Email",
                            "text": "",
                            "textColor": "#FF0000",
                            "maxLengthOfChar": null,
                            "inputType": "email",
                            "display_format": null,
                            "saveRestoreLabel": null,
                            "saveRestoreDisable": null,
                            "saveRestoreVisible": null,
                            "cancelClearLabel": null,
                            "cancelClearDisable": null,
                            "cancelClearVisible": null,
                            "dropLabel": null,
                            "dropDisable": null,
                            "dropVisible": null
                        },
                        "validations": [
                            {
                                "type": "Email",
                                "condition": null,
                                "message": "Please enter your email"
                            }
                        ],
                        "options": null,
                        "is_required": true
                    }
                ]))
                break;

            case 'choise':
                setFormState((pre) => ([
                    ...pre,
                    {
                        "id": pre.length + 1,
                        "key": "gender",
                        "type": "ChoiceRadioButton",
                        "attributes": {
                            "width": null,
                            "height": null,
                            "label": "Gender",
                            "text": null,
                            "textColor": null,
                            "maxLengthOfChar": null,
                            "inputType": null,
                            "display_format": null,
                            "saveRestoreLabel": null,
                            "saveRestoreDisable": null,
                            "saveRestoreVisible": null,
                            "cancelClearLabel": null,
                            "cancelClearDisable": null,
                            "cancelClearVisible": null,
                            "dropLabel": null,
                            "dropDisable": null,
                            "dropVisible": null
                        },
                        "validations": [
                            {
                                "type": "ChoiceSingle",
                                "condition": null,
                                "message": "Please select gender"
                            }
                        ],
                        "options": [
                            {
                                "id": 1,
                                "label": "Male",
                                "value": "male",
                                "extras": null
                            },
                            {
                                "id": 2,
                                "label": "Female",
                                "value": "female",
                                "extras": null
                            }
                        ],
                        "is_required": true
                    }
                ]))
                break;

            case 'drop_down_menu':
                setFormState((pre) => ([
                    ...pre,
                    {
                        "id": pre.length + 1,
                        "key": "city",
                        "type": "DropdownMenu",
                        "attributes": {
                            "width": "match_parent",
                            "height": "wrap_content",
                            "label": "City",
                            "text": null,
                            "textColor": "#FF0000",
                            "maxLengthOfChar": null,
                            "inputType": null,
                            "display_format": null,
                            "saveRestoreLabel": null,
                            "saveRestoreDisable": null,
                            "saveRestoreVisible": null,
                            "cancelClearLabel": null,
                            "cancelClearDisable": null,
                            "cancelClearVisible": null,
                            "dropLabel": null,
                            "dropDisable": null,
                            "dropVisible": null
                        },
                        "validations": null,
                        "options": [
                            {
                                "id": 1,
                                "label": "Indore",
                                "value": "indore",
                                "extras": null
                            },
                            {
                                "id": 2,
                                "label": "Bhopal",
                                "value": "bhopal",
                                "extras": null
                            },
                            {
                                "id": 3,
                                "label": "Ujjain",
                                "value": "ujjain",
                                "extras": null
                            }
                        ],
                        "is_required": false
                    }
                ]))
                break;

            case 'checkbox':
                setFormState((pre) => ([
                    ...pre,
                    {
                        "id": pre.length + 1,
                        "key": "hobbies",
                        "type": "ChoiceCheckBox",
                        "attributes": {
                            "width": null,
                            "height": null,
                            "label": "Hobbies",
                            "text": null,
                            "hint": null,
                            "textColor": null,
                            "maxLengthOfChar": null,
                            "inputType": null,
                            "display_format": null,
                            "saveRestoreLabel": null,
                            "saveRestoreDisable": null,
                            "saveRestoreVisible": null,
                            "cancelClearLabel": null,
                            "cancelClearDisable": null,
                            "cancelClearVisible": null,
                            "dropLabel": null,
                            "dropDisable": null,
                            "dropVisible": null
                        },
                        "validations": null,
                        "options": [
                            {
                                "id": 1,
                                "label": "Learning",
                                "value": "learning",
                                "extras": null
                            },
                            {
                                "id": 2,
                                "label": "Photography",
                                "value": "photography",
                                "extras": null
                            },
                            {
                                "id": 3,
                                "label": "Dance",
                                "value": "dance",
                                "extras": null
                            },
                            {
                                "id": 4,
                                "label": "Drawing",
                                "value": "drawing",
                                "extras": null
                            },
                            {
                                "id": 5,
                                "label": "Writing",
                                "value": "writing",
                                "extras": null
                            },
                        ],
                        "is_required": false
                    }
                ]))
                break;

            case 'button':
                setFormState((pre) => ([
                    ...pre,
                    {
                        "id": pre.length + 1,
                        "key": "form_buttons",
                        "type": "FormButtons",
                        "attributes": {
                            "width": "match_parent",
                            "height": "wrap_content",
                            "text": null,
                            "hint": null,
                            "textColor": null,
                            "maxLengthOfChar": null,
                            "inputType": null,
                            "display_format": null,
                            "saveRestoreLabel": "Save",
                            "saveRestoreDisable": false,
                            "saveRestoreVisible": true,
                            "cancelClearLabel": "Cancel",
                            "cancelClearDisable": false,
                            "cancelClearVisible": true,
                            "dropLabel": "Drop",
                            "dropDisable": false,
                            "dropVisible": true
                        },
                        "validations": null,
                        "options": null,
                        "is_required": false
                    }
                ]))
                break;

            default: return
                break;
        }

    }

    // Function to update list on drop
    const handleDrop = (droppedItem) => {
        // Ignore drop outside droppable container
        if (!droppedItem.destination) return;
        var updatedList = [...formState];
        // Remove dragged item
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        // Add dropped item
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        // Update State
        setFormState(updatedList);
    };

    const handleDropOptions = (droppedItem) => {
        // Ignore drop outside droppable container
        if (!droppedItem.destination) return;
        var updatedList = [...(editDialog.editOptions ?? [])];
        // Remove dragged item
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        // Add dropped item
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        // Update State
        setEditDialog((pre) => ({
            ...pre,
            data: {
                ...pre.data,
                options: [...updatedList]
            },
            editOptions: [...updatedList]
        }));
    };

    useEffect(() => {
        const description = get(data, "result.description");
        const emails = get(data, "result.email");
        Array.isArray(emails) && emails.length > 0 && setEmailList(emails)
        setFormData(()=>get(data, "result"))
        if (description) {
            try {
                // Check if it is already an object
                const parseData = typeof description === "string"
                    ? JSON.parse(description)
                    : description;

                if (parseData) {
                    setFormState(parseData);
                }
            } catch (error) {
                console.error("Failed to parse JSON:", error, description);
            }
        }
    }, [data]);

    return (
        <>
            {
                !preview && (
                    <Grid container columnSpacing={3} className="w-full m-auto">
                        <Grid item sm={12} className="flex justify-end border h-fit py-[0.5rem] sticky z-999 top-0 bg-gray-100 px-[1rem] border-b-[#80808069]">
                            <Box className="flex justify-between w-full">
                                <Button variant="contained" className="p-bg-color" onClick={handlePreviewToggle}>Edit</Button>
                                <Button variant="contained" className="p-bg-color" disabled={(formState.length || !updateFormIsPending) ? false : true} onClick={() => saveFormData(formState)}>Save</Button>
                            </Box>
                        </Grid>
                        <Grid item sm={12} padding={"12px 24px"}>
                            <form className='m-w-[1200px] m-auto'>
                                {
                                    formState.map((ele, i) => (
                                        <Grid container alignItems={'center'} className="my-8" spacing={2} key={ele.type + "_" + i}>
                                            <FormElement element={ele} handleChange={handleChange} preview={preview} />
                                        </Grid>
                                    ))
                                }
                            </form>
                        </Grid>
{/* 
                        <Grid item sm={4}>
                            <Grid className="mb-12" sx={{
                                height: '60vh',
                                overflow: 'scroll'
                            }}>
                                <pre className="language-js p-24">{JSON.stringify(formState, null, 2)}</pre>
                            </Grid>
                        </Grid> */}
                    </Grid>
                )
            }

            {
                preview && <div className="w-full min-h-full flex flex-auto flex-col">
                    <Box item sm={12} className="flex border py-[0.5rem] sticky top-0 bg-gray-100 z-30 px-[1rem] border-b-[#80808069] justify-between">
                        <IconButton
                            onClick={(ev) => setLeftSidebarOpen(!leftSidebarOpen)}
                            aria-label="toggle left sidebar"
                            size="large"
                            title={leftSidebarOpen ? "Close ToolBox" : "Open ToolBox"}
                        >
                            <FuseSvgIcon>{leftSidebarOpen ? "material-solid:close" : "material-solid:menu"}</FuseSvgIcon>
                        </IconButton>
                        <Button variant="contained" className="p-bg-color" disabled={formState?.length > 1 ? false: true} onClick={handlePreviewToggle}>Preview</Button>
                    </Box>
                    <Box className="w-full min-h-full flex flex-auto flex-col p-12">
                    <Droppable
                        types={['form_ele']}
                        onDrop={(data) => handleOnDrop(data['form_ele'])}
                    >
                        Drop Here
                    </Droppable>
                    <DragDropContext onDragEnd={handleDrop}>
                        <DroppableList droppableId="list-container">
                            {(provided) => (
                                <div
                                    className="list-container w-full mx-auto max-w-[1200px]"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {
                                        formState.map((ele, i) => (
                                            <Draggable key={ele.type + "_" + i} draggableId={ele.type + "_" + i} index={i}>
                                                {(provided) => (
                                                    <Grid container alignItems={'center'} className="my-8" spacing={2}
                                                        ref={provided.innerRef}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        onMouseEnter={() => handleMouseEnter(i)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        <FormElement element={ele} handleChange={handleChange} preview={preview} handleDelete={handleDelete} handleEdit={handleClickOpen} hoveredIndex={hoveredIndex} index={i} />
                                                    </Grid>
                                                )}
                                            </Draggable>
                                        ))
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </DroppableList>
                        </DragDropContext>
                    </Box>
                </div>
            }

            <Dialog open={editDialog.open} onClose={handleClose} fullWidth>
                <DialogTitle>Edit Field</DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={2}>
                        {
                            (editDialog.data && editDialog.data.type == 'TextField') && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            margin="dense"
                                            id="label"
                                            label="Label"
                                            type="text"
                                            value={editDialog.data.attributes.label}
                                            onChange={(e) => setEditDialog({
                                                ...editDialog,
                                                data: {
                                                    ...editDialog.data,
                                                    attributes: {
                                                        ...editDialog.data.attributes,
                                                        label: e.target.value
                                                    }
                                                }
                                            })}
                                            fullWidth
                                            variant="standard"
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="edit-select-label">Type</InputLabel>
                                            <Select
                                                labelId="edit-select-label"
                                                name='inputType'
                                                value={editDialog.data.attributes.inputType}
                                                label={editDialog.data.attributes.label}
                                                onChange={(e) => setEditDialog({
                                                    ...editDialog,
                                                    data: {
                                                        ...editDialog.data,
                                                        attributes: {
                                                            ...editDialog.data.attributes,
                                                            // label: e.target.value,
                                                            inputType: e.target.value
                                                        }
                                                    }
                                                })}
                                                variant="standard"
                                            >
                                                {
                                                    (formFieldsTypes ?? []).map((option, i) => (
                                                        <MenuItem key={option.type + i} value={option.type}>{option.label}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormGroup>
                                            <FormControlLabel control={
                                                <Checkbox
                                                    checked={editDialog.data.is_required}
                                                    onChange={(e) => {
                                                        setEditDialog({
                                                            ...editDialog,
                                                            data: {
                                                                ...editDialog.data,
                                                                is_required: e.target.checked
                                                            }
                                                        })
                                                    }}
                                                />
                                            } label="Is Required" />
                                        </FormGroup>
                                    </Grid>
                                </>
                            )
                        }
                        {
                            (editDialog.data && ((editDialog.data.type == 'ChoiceRadioButton') || (editDialog.data.type == 'ChoiceCheckBox') || (editDialog.data.type == 'DropdownMenu'))) && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            margin="dense"
                                            id="label"
                                            label="Label"
                                            type="text"
                                            value={editDialog.data.attributes['label']}
                                            onChange={(e) => {
                                                const isCheckbox = editDialog.data.type === 'ChoiceCheckBox';
                                                const currentText = editDialog.data.attributes.text ?? [];

                                                const newText = isCheckbox
                                                    ? currentText.includes(e.target.value)
                                                        ? currentText.filter((value) => value !== e.target.value) 
                                                        : [...currentText, e.target.value]
                                                    : e.target.value;

                                                setEditDialog({
                                                    ...editDialog,
                                                    data: {
                                                        ...editDialog.data,
                                                        attributes: {
                                                            ...editDialog.data.attributes,
                                                            ['label']: e.target.value,
                                                            ['text']: newText,
                                                        },
                                                    },
                                                });
                                            }}
                                            fullWidth
                                            variant="standard"
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container columnSpacing={2}>
                                            <Grid item xs={12} className="flex items-center justify-between mb-[1rem]">
                                                <Typography className="text-14 font-700" variant="h3">
                                                    Options
                                                </Typography>
                                                <IconButton aria-label="add" size="small" onClick={() => handleAddOption()}>
                                                    <AddIcon fontSize="inherit" />
                                                </IconButton>
                                            </Grid>

                                            <DragDropContext onDragEnd={handleDropOptions}>
                                                <DroppableList droppableId="list-option-container">
                                                    {(provided) => (
                                                        <Grid
                                                            item xs={12}
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                        >
                                                            {
                                                                (editDialog.data.options && editDialog.data.options.length > 0) && (editDialog.data.options ?? []).map((opt, i) => (
                                                                    <Draggable key={opt.label + opt.id} draggableId={opt.label + opt.id} index={i}>
                                                                        {(provided) => (

                                                                            <Grid item xs={12} className="flex items-center justify-between mb-[1rem]" gap={3}
                                                                                ref={provided.innerRef}
                                                                                {...provided.dragHandleProps}
                                                                                {...provided.draggableProps}
                                                                                onMouseEnter={() => handleMouseEnter(i + 'option')}
                                                                                onMouseLeave={handleMouseLeave}>
                                                                                {preview && <DragIndicatorIcon className={hoveredIndex === (i + 'option') ? "mr-8" : "visibile_off mr-8"} />}
                                                                                <TextField
                                                                                    margin="dense"
                                                                                    name="label"
                                                                                    label="Label"
                                                                                    type="text"
                                                                                    value={editDialog.editOptions[i].label}
                                                                                    onChange={(e) => handleChangeEditOption(e, opt.id)}
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    required
                                                                                />
                                                                                {/* <TextField
                                                                                    margin="dense"
                                                                                    name="value"
                                                                                    label="Value"
                                                                                    type="text"
                                                                                    value={editDialog.editOptions[i].value}
                                                                                    onChange={(e) => handleChangeEditOption(e, opt.id)}
                                                                                    fullWidth
                                                                                    variant="standard"
                                                                                    required
                                                                                /> */}
                                                                                <IconButton aria-label="delete" size='small' onClick={() => handleDeleteOption(opt.id)}>
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        )}
                                                                    </Draggable>
                                                                ))
                                                            }
                                                            {provided.placeholder}
                                                        </Grid>
                                                    )}
                                                </DroppableList>
                                            </DragDropContext>
                                        </Grid>

                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormGroup>
                                            <FormControlLabel control={
                                                <Checkbox
                                                    checked={editDialog.data.is_required}
                                                    onChange={(e) => {
                                                        setEditDialog({
                                                            ...editDialog,
                                                            data: {
                                                                ...editDialog.data,
                                                                is_required: e.target.checked
                                                            }
                                                        })
                                                    }}
                                                />
                                            } label="Is Required" />
                                        </FormGroup>
                                    </Grid>
                                </>
                            )
                        }
                        {
                            (editDialog.data && editDialog.data.type == 'FormButtons') && (
                                <>
                                    <Grid item xs={12}>
                                        <Grid container columnSpacing={2} className='mb-16'>
                                            <Grid item xs={12} className="flex items-center justify-between">
                                                <Typography className="text-14 font-700" variant="h3">
                                                    Save Button
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    margin="dense"
                                                    label="Label"
                                                    type="text"
                                                    value={editDialog.data.attributes.saveRestoreLabel}
                                                    onChange={(e) => setEditDialog({
                                                        ...editDialog,
                                                        data: {
                                                            ...editDialog.data,
                                                            attributes: {
                                                                ...editDialog.data.attributes,
                                                                saveRestoreLabel: e.target.value
                                                            }
                                                        }
                                                    })}
                                                    fullWidth
                                                    variant="standard"
                                                    required
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormGroup>
                                                    <FormControlLabel control={
                                                        <Checkbox
                                                            checked={editDialog.data.attributes.saveRestoreDisable}
                                                            onChange={(e) => setEditDialog({
                                                                ...editDialog,
                                                                data: {
                                                                    ...editDialog.data,
                                                                    attributes: {
                                                                        ...editDialog.data.attributes,
                                                                        saveRestoreDisable: e.target.checked
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    } label="Is Disable" />
                                                </FormGroup>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormGroup>
                                                    <FormControlLabel control={
                                                        <Checkbox
                                                            checked={editDialog.data.attributes.saveRestoreVisible}
                                                            onChange={(e) => setEditDialog({
                                                                ...editDialog,
                                                                data: {
                                                                    ...editDialog.data,
                                                                    attributes: {
                                                                        ...editDialog.data.attributes,
                                                                        saveRestoreVisible: e.target.checked
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    } label="Is Visible" />
                                                </FormGroup>
                                            </Grid>
                                        </Grid>

                                        <Grid container columnSpacing={2} className='mb-16'>
                                            <Grid item xs={12} className="flex items-center justify-between">
                                                <Typography className="text-14 font-700" variant="h3">
                                                    Cancel Button
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    margin="dense"
                                                    label="Label"
                                                    type="text"
                                                    value={editDialog.data.attributes.cancelClearLabel}
                                                    onChange={(e) => setEditDialog({
                                                        ...editDialog,
                                                        data: {
                                                            ...editDialog.data,
                                                            attributes: {
                                                                ...editDialog.data.attributes,
                                                                cancelClearLabel: e.target.value
                                                            }
                                                        }
                                                    })}
                                                    fullWidth
                                                    variant="standard"
                                                    required
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormGroup>
                                                    <FormControlLabel control={
                                                        <Checkbox
                                                            checked={editDialog.data.attributes.cancelClearDisable}
                                                            onChange={(e) => setEditDialog({
                                                                ...editDialog,
                                                                data: {
                                                                    ...editDialog.data,
                                                                    attributes: {
                                                                        ...editDialog.data.attributes,
                                                                        cancelClearDisable: e.target.checked
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    } label="Is Disable" />
                                                </FormGroup>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormGroup>
                                                    <FormControlLabel control={
                                                        <Checkbox
                                                            checked={editDialog.data.attributes.cancelClearVisible}
                                                            onChange={(e) => setEditDialog({
                                                                ...editDialog,
                                                                data: {
                                                                    ...editDialog.data,
                                                                    attributes: {
                                                                        ...editDialog.data.attributes,
                                                                        cancelClearVisible: e.target.checked
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    } label="Is Visible" />
                                                </FormGroup>
                                            </Grid>
                                        </Grid>

                                        <Grid container columnSpacing={2} className='mb-16'>
                                            <Grid item xs={12} className="flex items-center justify-between">
                                                <Typography className="text-14 font-700" variant="h3">
                                                    Drop Button
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    margin="dense"
                                                    label="Label"
                                                    type="text"
                                                    value={editDialog.data.attributes.dropLabel}
                                                    onChange={(e) => setEditDialog({
                                                        ...editDialog,
                                                        data: {
                                                            ...editDialog.data,
                                                            attributes: {
                                                                ...editDialog.data.attributes,
                                                                dropLabel: e.target.value
                                                            }
                                                        }
                                                    })}
                                                    fullWidth
                                                    variant="standard"
                                                    required
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormGroup>
                                                    <FormControlLabel control={
                                                        <Checkbox
                                                            checked={editDialog.data.attributes.dropDisable}
                                                            onChange={(e) => setEditDialog({
                                                                ...editDialog,
                                                                data: {
                                                                    ...editDialog.data,
                                                                    attributes: {
                                                                        ...editDialog.data.attributes,
                                                                        dropDisable: e.target.checked
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    } label="Is Disable" />
                                                </FormGroup>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormGroup>
                                                    <FormControlLabel control={
                                                        <Checkbox
                                                            checked={editDialog.data.attributes.dropVisible}
                                                            onChange={(e) => setEditDialog({
                                                                ...editDialog,
                                                                data: {
                                                                    ...editDialog.data,
                                                                    attributes: {
                                                                        ...editDialog.data.attributes,
                                                                        dropVisible: e.target.checked
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    } label="Is Visible" />
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleEditFields}>save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Content;