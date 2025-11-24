'use client';

import React, { useEffect, useState } from 'react';
import {
    Box, TextField, Button, Typography, Grid, Autocomplete,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import "@/styles/date-range-picker.css"
import { Controller, useForm } from 'react-hook-form'; 
import AnalyticEmbed from '@/components/analitic-embed/AnalyticEmbed';
import AnalyticEmbed2 from '@/components/analitic-embed/AnalyticEmbed2';
import AnalyticEmbed3 from '@/components/analitic-embed/AnalyticEmbed3';
import AnalyticEmbed4 from '@/components/analitic-embed/AnalyticEmbed4'; 
import { reportItems } from '../AnalyticBuilder';
import { useFetch } from '@/utils/hooks/useApi';
import { API_ROUTES } from '@/constants/api';
import { get } from 'lodash';
import { highlightCountryList, highlightUSStateList } from '@/utils/utils';

function AnalyticMain({ control, errors, watch, setValue, formState, analyticData }) {
    const [platforms, setPlatforms] = useState([]);
    const [preview, setPreview] = useState(false);

    const values = watch();
    const { dirtyFields } = formState;

    const { data: platformList } = useFetch(
        "platform-list",
        `${API_ROUTES["getPlatformList"]}`,
        {},
        { enabled: true },
        true
    );

    const isSelectionValid = Boolean(
        values?.reportItems?.length > 0 &&
        values?.platforms?.id
    );

    
    useEffect(() => {
        const savedData = localStorage.getItem('analyticForm');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                
                Object.keys(parsedData).forEach(key => {
                    setValue(key, parsedData[key]);
                });
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }, [setValue]);

    
    useEffect(() => {
        if (values && Object.keys(values).length > 0) {
            localStorage.setItem('analyticForm', JSON.stringify(values));
        }
    }, [values]);

    useEffect(() => {
        if (!isSelectionValid && preview) {
            setPreview(false);
        }
    }, [values?.reportItems, isSelectionValid]);

    useEffect(() => {
        if (platformList) {
            setPlatforms([{ id: "All", name: "All" }, ...get(platformList, "result.data", [])]);
            dirtyFields.platforms = true;
        }
    }, [platformList]);

    useEffect(() => {
        const embedOption = values?.embedOption;
        const currentItems = values?.reportItems || [];
        const professionsOfFaith = reportItems[reportItems.length - 1];
        const alreadyIncluded = currentItems.some(item => item.id === professionsOfFaith.id);

        if ((embedOption === "map" || embedOption === "both") && !alreadyIncluded) {
            setValue("reportItems", [...currentItems, professionsOfFaith], { shouldValidate: true });
        }
    }, [values?.embedOption, values?.reportItems]);

    console.log("values", values)


    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Typography variant="h4" padding="20px 3rem">Analytics Embed Options</Typography>

                <form className='flex flex-col justify-center gap-8'>
                    <Grid container px={2} gap={3} justifyContent={"center"}>
                        
                        
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name="platforms"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={platforms}
                                        getOptionLabel={(option) => option?.name || ""}
                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                        onChange={(e, value) => field.onChange(value || null)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Platform"
                                                variant="outlined"
                                                fullWidth
                                                error={!!errors?.platforms}
                                                helperText={errors?.platforms?.message}
                                                className="rs-autocomplete"
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name="reportItems"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.reportItems}>
                                        <InputLabel required>Report Items</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            label="Report Items"
                                            value={field.value?.map(item => item.name) || []}
                                            onChange={(e) => {
                                                const selectedNames = e.target.value;
                                                const selectedItems = reportItems.filter(item =>
                                                    selectedNames.includes(item.name)
                                                );
                                                field.onChange(selectedItems);
                                            }}
                                            className="rs-autocomplete"
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {reportItems?.map((item) => (
                                                <MenuItem key={item.id} value={item.name}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.reportItems && (
                                            <Typography color="error" variant="caption" className="mt-1">
                                                {errors.reportItems.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name="colorScheme"
                                control={control}
                                defaultValue="default"
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Color Scheme</InputLabel>
                                        <Select label="Color Scheme" {...field}>
                                            <MenuItem value="light">Light</MenuItem>
                                            <MenuItem value="dark">Dark</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name="embedOption"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.embedOption}>
                                        <InputLabel required>Embed Option</InputLabel>
                                        <Select
                                            {...field}
                                            label="Embed Option"
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="rs-autocomplete"
                                        >
                                            <MenuItem value="report">Analytics Report</MenuItem>
                                            <MenuItem value="map">Map</MenuItem>
                                            <MenuItem value="both">Both</MenuItem>
                                        </Select>
                                        {errors.embedOption && (
                                            <Typography color="error" variant="caption" className="mt-1">
                                                {errors.embedOption.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        
                        {(values?.embedOption === "map" || values?.embedOption === "both") && (
                            <Grid item xs={12} sm={5}>
                                <Controller
                                    name="highlightCountry"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            onChange={(_, value) => field.onChange(value)}
                                            options={highlightCountryList}
                                            getOptionLabel={(option) => option?.name || ""}
                                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Country"
                                                    className="rs-autocomplete"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        
                        {values?.highlightCountry?.id === "United States" && values?.embedOption !== "report" && (
                            <Grid item xs={12} sm={5}>
                                <Controller
                                    name="state_name"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            onChange={(_, value) => field.onChange(value)}
                                            options={highlightUSStateList}
                                            getOptionLabel={(option) => option?.name || ""}
                                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="US State"
                                                    className="rs-autocomplete"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                       
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name="selectedEmbed"
                                control={control}
                                
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Select Template</InputLabel>
                                        <Select
                                            {...field}
                                            label="Select Embed Version"
                                        >
                                            <MenuItem value="1">Template 1</MenuItem>
                                            <MenuItem value="2">Template 2</MenuItem>
                                            <MenuItem value="3">Template 3</MenuItem>
                                            <MenuItem value="4">Template 4</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        
                        <Grid item className="flex justify-between" xs={12} sm={5}>
                            <Grid item xs={12} sm={5.5}>
                                <Controller
                                    name="width"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            label="Width (px)"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            type="number"
                                            fullWidth
                                            error={!!errors?.width}
                                            helperText={errors?.width?.message}
                                            required
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={5.5}>
                                <Controller
                                    name="height"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            label="Height (px)"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            type="number"
                                            fullWidth
                                            error={!!errors?.height}
                                            helperText={errors?.height?.message}
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    
                    <Button
                        type="button"
                        className={"p-bg-color"}
                        disabled={!isSelectionValid}
                        sx={{
                            width: "fit-content",
                            margin: "auto",
                            opacity: isSelectionValid ? 1 : 0.5,
                            cursor: isSelectionValid ? 'pointer' : 'not-allowed'
                        }}
                        onClick={() => setPreview(!preview)}
                    >
                        {preview ? "Hide" : "Preview"}
                    </Button>
                </form>

                
                {preview && (
                    <>
                        {values.selectedEmbed === "1" && (
                            <AnalyticEmbed isEmbed={false} values={values} analyticData={analyticData} />
                        )}
                        {values.selectedEmbed === "2" && (
                            <AnalyticEmbed2 isEmbed={false} values={values} analyticData={analyticData} />
                        )}
                        {values.selectedEmbed === "3" && (
                            <AnalyticEmbed3 isEmbed={false} values={values} analyticData={analyticData} />
                        )}
                        {values.selectedEmbed === "4" && (
                            <AnalyticEmbed4 isEmbed={false} values={values} analyticData={analyticData} />
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}

export default AnalyticMain;