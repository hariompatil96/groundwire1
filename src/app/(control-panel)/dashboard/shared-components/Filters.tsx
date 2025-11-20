import {
  Divider,
  Autocomplete,
  Checkbox,
  Chip,
  Button,
  CircularProgress,
  Grid,
  Popper,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { get } from "lodash";
import React, { useRef, useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { DateRangePicker } from "react-date-range";
import { initialState, isEmpty } from "./common";

const Filters = ({
  platforms,
  formStates,
  campaingData,
  isPending,
  onPlatformChange,
}) => {
  const { campaignList, campaignLoading } = campaingData;
  const {
    isValid,
    dirtyFields,
    errors,
    control,
    onSubmit,
    values,
    handleSubmit,
    setValue,
  } = formStates;

  const popperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleInputClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const formatDate = (date) => new Intl.DateTimeFormat("en-US").format(date);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popperRef.current &&
        !popperRef.current.contains(event.target) &&
        !anchorEl?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl]);

  const tabValue =
    values.platforms?.id || (platforms.length > 0 ? platforms[0].id : "");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container alignItems="center" spacing={2} px={2} py={1}>
        <Grid item xs={12}>
          <Controller
            name="platforms"
            control={control}
            render={({ field }) => (
              <Tabs
                value={field.value?.id || ""}
                onChange={(e, newValue) => {
                  const selectedPlatform =
                    platforms.find((p) => p.id === newValue) || null;
                  field.onChange(selectedPlatform);
                  if (newValue === "all") {
                    setValue("campaigns", [{ id: "all", name: "All" }], {
                      shouldDirty: true,
                    });
                  }
                  if (onPlatformChange) {
                    onPlatformChange(selectedPlatform);
                  }
                }}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  style: {
                    height: 3,
                    borderRadius: 3,
                    backgroundColor: "#1769aa",
                  },
                }}
                sx={{
                  "& .MuiTab-root": {
                    minWidth: 70,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    color: "primary",
                  },
                  "& .Mui-selected": { color: "primary" },
                  "& .MuiTabs-flexContainer": { gap: 1 },
                }}
              >
                {platforms.map((platform) => (
                  <Tab
                    key={platform.id}
                    label={platform.name}
                    value={platform.id}
                  />
                ))}
              </Tabs>
            )}
          />
        </Grid>

        {/* Campaign + Date Picker + Button */}
        <Grid item xs={12} container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Controller
              name="campaigns"
              control={control}
              render={({ field }) => {
                // compute options (ensure 'All' is first)
                const allOptions = [
                  { id: "all", name: "All" },
                  ...get(campaignList, "result.data", []),
                ];

                const handleCampaignsChange = (
                  event,
                  newValue,
                  reason,
                  details
                ) => {
                  const clicked = details?.option;
                  const allOptions = [
                    { id: "all", name: "All" },
                    ...get(campaignList, "result.data", []),
                  ];
                  const totalCampaigns = allOptions.filter(
                    (o) => o.id !== "all"
                  );
                  const prev = field.value || [];

                  // Defensive: if no clicked option (keyboard etc.)
                  if (!clicked) {
                    const filtered = (newValue || []).filter(
                      (v) => v.id !== "all"
                    );
                    field.onChange(filtered);
                    setValue("campaigns", filtered, { shouldDirty: true });
                    return;
                  }

                  // Case 1: clicked "All"
                  if (clicked.id === "all") {
                    const selectingAll = (newValue || []).some(
                      (v) => v.id === "all"
                    );
                    if (selectingAll) {
                      field.onChange(allOptions);
                      setValue("campaigns", allOptions, { shouldDirty: true });
                    } else {
                      field.onChange([]);
                      setValue("campaigns", [], { shouldDirty: true });
                    }
                    return;
                  }

                  // Case 2: clicked a normal campaign
                  const filtered = (newValue || []).filter(
                    (v) => v.id !== "all"
                  );

                  // if after this, all non-All campaigns are selected → include All
                  const allSelected = filtered.length === totalCampaigns.length;

                  const finalValue = allSelected
                    ? [...filtered, { id: "all", name: "All" }]
                    : filtered;

                  field.onChange(finalValue);
                  setValue("campaigns", finalValue, { shouldDirty: true });
                };

                return (
                  <Autocomplete
                    {...field}
                    multiple
                    options={[
                      { id: "all", name: "All" },
                      ...get(campaignList, "result.data", []),
                    ]}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    value={field.value || []}
                    loading={campaignLoading}
                    disabled={!values?.platforms?.id}
                    onChange={handleCampaignsChange}
                    sx={{
                      minWidth: 220,
                      fontSize: "1.0rem",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        height: 45,
                      },
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li
                        {...props}
                        key={option.id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Checkbox
                          checked={
                            selected ||
                            (Array.isArray(field.value) &&
                              field.value.some((val) => val.id === option.id))
                          }
                          sx={{ "&.Mui-checked": { color: "#018594" } }}
                        />
                        {option.name}
                      </li>
                    )}
                    renderTags={(value, getTagProps) => {
                      if (value.length > 2) {
                        return [
                          <Chip
                            key="more"
                            label={`${value.length} selected`}
                            title={
                              Array.isArray(value)
                                ? value.map((val) => val.name).join(", ")
                                : ""
                            }
                          />,
                        ];
                      }
                      return value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.name}
                          {...getTagProps({ index })}
                        />
                      ));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="All Campaigns"
                        variant="outlined"
                      />
                    )}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="dateRange"
              control={control}
              render={({ field }) => (
                <>
                  <TextField
                    value={`${formatDate(field.value[0].startDate)} - ${formatDate(field.value[0].endDate)}`}
                    onClick={handleInputClick}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        height: 45,
                      },
                    }}
                    label="Date Range"
                  />
                  <Popper
                    open={open}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                  >
                    <div ref={popperRef}>
                      <DateRangePicker
                        onChange={(item) => {
                          setValue("dateRange", [item.selection]);
                          field.onChange([item.selection]);
                        }}
                        showSelectionPreview
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={field.value}
                        direction="horizontal"
                        rangeColors={["#1769aa"]}
                      />
                    </div>
                  </Popper>
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} md="auto">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ height: 40, minWidth: 120, borderRadius: 2 }}
              disabled={
                isEmpty(dirtyFields) ||
                !isValid ||
                isPending ||
                !isEmpty(errors)
              }
            >
              {isPending ? <CircularProgress size={22} /> : "Apply Filters"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Filters;
