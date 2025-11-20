
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const FormElement = ({ element, handleChange, preview, handleDelete, handleEdit, hoveredIndex, index }) => {

    switch (element.type) {
        case 'TextField':
            return (<>
                <Grid item xs={preview ? 11 : 12} className="flex items-center justify-between">
                    {preview && <DragIndicatorIcon className={hoveredIndex === index ? "mr-8" : "visibile_off mr-8"} />}
                    <TextField fullWidth label={element.attributes.label} type={element.attributes.inputType} value={element.attributes.text} name={element.key + element.id}
                        onChange={(e) => handleChange(e)} required={element.is_required}
                        InputLabelProps={{
                            shrink: element.attributes.inputType === "date" || element.attributes.inputType === "time" || undefined,
                        }}
                    />
                </Grid>
                {
                    preview && (
                        <>
                            <Grid item xs={1} className="flex items-center justify-between pl-0">
                                <IconButton aria-label="edit" onClick={() => handleEdit(element)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => handleDelete(element.key + element.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </>
                    )
                }
            </>
            );

        case 'ChoiceRadioButton':
            return (
                <>
                    <Grid item xs={preview ? 11 : 12} className="flex">
                        {preview && <DragIndicatorIcon className={hoveredIndex === index ? "mr-8" : "visibile_off mr-8"} />}
                        <FormControl fullWidth>
                            <FormLabel id={"radio-buttons-group" + element.id}>{element.attributes.label}</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby={"radio-buttons-group" + element.id}
                                name={element.key + element.id}
                                value={element.attributes.text}
                                onChange={(e) => handleChange(e)}
                            >
                                 <Grid container>
                                {
                                        (element?.options ?? []).map(option => (
                                        <Grid item xs={4}>
                                        <FormControlLabel key={option.id} value={option.value} control={<Radio />} label={option.label} />
                                        </Grid>
                                    ))
                                }
                                </Grid>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {
                        preview && (
                            <>
                                <Grid item xs={1} className="flex items-center justify-between pl-0">
                                    <IconButton aria-label="edit" onClick={() => handleEdit(element)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleDelete(element.key + element.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </>
                        )
                    }
                </>
            );

        case 'DropdownMenu':
            return (
                <>
                    <Grid item xs={preview ? 11 : 12} className="flex items-center justify-between">
                        {preview && <DragIndicatorIcon className={hoveredIndex === index ? "mr-8" : "visibile_off mr-8"} />}
                        <FormControl fullWidth>
                            <InputLabel id={"select-label" + element.id}>{element.attributes.label}</InputLabel>
                            <Select
                                labelId={"select-label" + element.id}
                                name={element.key + element.id}
                                value={element.attributes.text}
                                label={element.attributes.label}
                                onChange={(e) => handleChange(e)}
                            >
                                {
                                    (element?.options ?? []).map(option => (
                                        <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    {
                        preview && (
                            <>
                                <Grid item xs={1} className="flex items-center justify-between pl-0">
                                    <IconButton aria-label="edit" onClick={() => handleEdit(element)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleDelete(element.key + element.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </>
                        )
                    }
                </>
            );

        case 'ChoiceCheckBox':
            return (
                <>
                    <Grid item xs={preview ? 11 : 12}>
                        {preview && <DragIndicatorIcon className={hoveredIndex === index ? "mr-8" : "visibile_off mr-8"} />}
                        <FormControl component="fieldset" variant="standard">
                            <FormLabel component="legend">{element.attributes.label}</FormLabel>
                            <FormGroup>
                                {
                                    (element?.options ?? []).map(option => (
                                        <FormControlLabel
                                            key={option.id}
                                            control={
                                                <Checkbox name={element.key + element.id} value={option.value} />
                                            }
                                            label={option.label}
                                        />
                                    ))
                                }
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    {
                        preview && (
                            <>
                                <Grid item xs={1} className="flex items-center justify-between pl-0">
                                    <IconButton aria-label="edit" onClick={() => handleEdit(element)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleDelete(element.key + element.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </>
                        )
                    }
                </>
            );

        case 'FormButtons':
            return (

                <>
                    <Grid item xs={preview ? 11 : 12} className="flex items-center justify-between">
                        {preview && <DragIndicatorIcon className={hoveredIndex === index ? "mr-8" : "visibile_off mr-8"} />}
                        <Grid container display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} rowSpacing={2}>
                            <Grid item width={'100%'}>
                                {element.attributes.saveRestoreVisible && <Button variant="contained" color="secondary" fullWidth disabled={element.attributes.saveRestoreDisable}>{element.attributes.saveRestoreLabel}</Button>}
                            </Grid>
                            <Grid item width={'100%'}>
                                {element.attributes.cancelClearVisible && <Button variant="text" fullWidth disabled={element.attributes.cancelClearDisable}>{element.attributes.cancelClearLabel}</Button>}
                            </Grid>
                            <Grid item width={'100%'}>
                                {element.attributes.dropVisible && <Button variant="text" fullWidth color="error" disabled={element.attributes.dropDisable}>{element.attributes.dropLabel}</Button>}
                            </Grid>
                        </Grid>
                    </Grid>
                    {
                        preview && (
                            <>
                                <Grid item xs={1} className="flex items-center justify-between pl-0">
                                    <IconButton aria-label="edit" onClick={() => handleEdit(element)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleDelete(element.key + element.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </>
                        )
                    }
                </>
            );

        default: break;
    }
}

export default FormElement;