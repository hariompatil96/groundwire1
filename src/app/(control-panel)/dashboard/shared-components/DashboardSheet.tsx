'use client';

import React, { useEffect, useState } from 'react';
import { Box} from '@mui/material';
import "@/styles/date-range-picker.css"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFetch, usePost } from '@/utils/hooks/useApi';
import { API_ROUTES } from '@/constants/api';
import { queryClient } from '@/app/App';
import { get } from 'lodash';
import { fetchAdAccountsAndStats, fetchAnalyticsData, initialState, schema } from "./common"
import ReportsList from './ReportsList';
import Filters from './Filters';
import LiveDataList from './LiveDataList';


function DashboardSheet() {
    const [platforms, setPlatforms] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [reports, setReports] = useState({});
    const [reportError, setReportError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [liveReports, setLiveReports] = useState([]);

    const {
        control,
        setValue,
        handleSubmit,
        watch,
        formState,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialState,
    });

    const { isValid, dirtyFields, errors, touchedFields } = formState;

    const values = watch();

    const { data: platformList, isLoading, error } = useFetch("platform-list-sheet", `${API_ROUTES["getPlatformListSheet"]}`, {}, {
        enabled: true
    }, true);


    const { data: campaignList, isLoading: campaignLoading, error: campaignError } = useFetch(`${values?.platforms?.id}-sheet`, `${API_ROUTES["getCampaignListSheet"]}/${values?.platforms?.id}`, {}, {
        enabled: Boolean(values?.platforms?.id && values?.platforms?.id !== "All")
    }, true);

    const { mutate: applyFilterMutate, isPending, error: submitError } = usePost(API_ROUTES["getCampaignSheet"], {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["get-data-sheet"] });
            if (data?.result?.status) {
                setReportError(false)
                setReports(data.result.totals)
            } else {
                setReportError(true)
            }
        },
        onError: (error) => {
            console.error(error)
            setReportError(true)
        },
    }, {}, true);

    useEffect(() => {
        if (platformList) {
            setPlatforms([{ id: "All", name: "All" }, ...get(platformList, "result.data", [])]);
            dirtyFields.platforms = true;
        }
        if (campaignList) {
            setCampaigns(() => [{ id: "All", name: "All" }, ...get(campaignList, "result.data", [])]);
            const allCampaigns = [{ id: "All", name: "All" }, ...get(campaignList, "result.data", [])]?.map((campaign) => campaign);
            setValue("campaigns", allCampaigns, { shouldDirty: true, shouldValidate: true })
            dirtyFields.campaigns = true;
        }
    }, [platformList, campaignList])


    const handleCampaignChange = (event, selectedCampaigns) => {
        const isAllSelected = selectedCampaigns.some((campaign) => campaign.id === "All");
        const isCheckboxAllSelected = values?.campaigns?.some((campaign) => campaign.id === "All");
        const allAlreadySelected = selectedCampaigns?.length === campaigns?.length;
        if (!isAllSelected && isCheckboxAllSelected) {
            setValue("campaigns", []);
            return;
        }
        if (isAllSelected && !allAlreadySelected) {
            setValue("campaigns", campaigns, { shouldDirty: true, shouldValidate: true });
        } else if (isAllSelected && allAlreadySelected) {
            setValue("campaigns", []);
        } else {
            setValue("campaigns", selectedCampaigns);
        }
    };

    const onSubmit = async(data) => {
        if (values?.filterType === "dateRange") {
            const formatDate = (date) => {
                const d = new Date(date);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            };
            const campaignIds = data.campaigns?.length
                ? data.campaigns
                    .filter((campaign) => campaign.id !== "All")
                    .map((campaign) => Number(campaign.id))
                : "";

            const payload = {
                platformid: data.platforms?.id === "All" ? "" : data.platforms?.id,
                campaignid: campaignIds,
                startDate: formatDate(data.dateRange[0].startDate),
                endDate: formatDate(data.dateRange[0].endDate),
            };
            applyFilterMutate(payload);
        }
        else {
            if (values?.platforms?.name === "Facebook") {
              setLoading(true);
              try {
                  const campaignIds = values?.campaigns?.length
                      ? values.campaigns.filter((campaign) => campaign.id !== "All")
                      : [];
                  const data = await fetchAdAccountsAndStats(campaignIds);
                  setLiveReports(data);
              } catch (error) {
                  console.error("Error fetching Facebook data:", error);
              } finally {
                setLoading(false); 
              }
            }
            else if (values?.platforms?.name === "GA4") {
              try {
                setLoading(true);
                const data = await fetchAnalyticsData();
                setLiveReports(data);
            } catch (error) {
                console.error("Error fetching GA4 data:", error);
            } finally {
              setLoading(false); 
            }
            }
        }
    };

    useEffect(() => {
        onSubmit(values);
    }, [])

    useEffect(()=>{
        if(values?.filterType === "dateRange"){
          setPlatforms([{ id: "All", name: "All" }, ...get(platformList, "result.data", [])]);
            dirtyFields.platforms = true;
        }else if(values?.filterType === "live"){
          setPlatforms(()=>[...get(platformList, "result.data", [])]);
          if(values?.platforms?.name === "All"){
            setValue("platforms",get(platformList, "result.data", [])[0])
          }
          dirtyFields.platforms = true;
        }
      }, [values?.filterType])

    useEffect(() => {
        setLiveReports([]);
      }, [values?.platforms])

    return (
        <div>
           <Filters
              formStates={{
                  errors: formState.errors,
                  isValid: formState.isValid,
                  dirtyFields: formState.dirtyFields,
                  onSubmit,
                  control,
                  values,
                  handleSubmit,
                  setValue
              }}
              campaingData={{
                  campaignList,
                  campaignLoading,
                  handleCampaignChange
              }}
              platforms={platforms}
              isPending={values?.filterType !== "dateRange" ? loading : isPending}
          />
            {submitError || reportError ?
        <Box className="text-xl font-bold text-center mt-24 mx-4 h-[180px]">No data found for the specified dates.</Box>
        : values?.filterType  === "dateRange" ?<ReportsList values={values} reports={reports} /> : <LiveDataList values={values} reports={liveReports} platforms={values?.platforms}/>
          }
        </div>
    );
}

export default DashboardSheet;

