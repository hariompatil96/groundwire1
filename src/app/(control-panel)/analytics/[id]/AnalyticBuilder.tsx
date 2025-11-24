    'use client';

import { Button, CircularProgress, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import AnalyticMain from "./shared-component/AnalyticMain";
import Root from "@/components/Root";
import BackButton from "@/components/back-button/BackButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { API_ROUTES } from "@/constants/api";
import { usePatch } from "@/utils/hooks/useApi";
import { queryClient } from "@/app/App";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useRouter } from "next/navigation";
import { useFetch } from '@/utils/hooks/useApi';
import { useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import AnalyticSettingDialog from "./shared-component/AnalyticSettingDialog";
import { openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const schema = yup.object().shape({
    platforms: yup
        .object()
        .nullable()
        .required("Platform is required")
        .typeError("Required"),
    
    reportItems: yup
        .array()
        .of(
            yup.object()
        )
        .min(1, "At least one report item must be selected.")
        .required("Report items are required."),
    colorScheme: yup.string().nullable(),
    
    embedOption: yup.string().required("Required"),
    width: yup
        .number()
        .typeError("Width must be a number")
        .required("Required")
        .max(1200, "Maximum width will be 1200px")
        .min(300, "Minimum width will be 300px"),
    height: yup
        .number()
        .typeError("Height must be a number")
        .required("Required").min(400, "Minimum height will be 400px"),
});

export const reportItems = [
    { id: 1, name: 'Impressions' },
    { id: 2, name: 'Website Views' },
    { id: 3, name: 'Professions of Faith' },
];

function AnalyticBuilder(props) {
    const dispatch = useDispatch();
    const id = props.params.id
    const router = useRouter();
    const [analyticData, setAnalyticData] = useState({})
    const { control, handleSubmit, setValue, formState, watch } = useForm({
        mode: "all",
        resolver: yupResolver(schema),
        defaultValues: {
            platforms: { id: "All", name: "All" },
            
            reportItems: [],
            colorScheme: "",
            embedOption: "",
            highlightCountry: null,
            height: 600,
            width: 600,
            state_name: null,
            selectedEmbed: "1"
        },
    });

    const { errors, isValid } = formState;
    const { data, isLoading, error } = useFetch(id, `${API_ROUTES["getAnalyticByID"]}/${id}`, {}, {
        enabled: Boolean(id)
    });

    const { mutate: updateAnalyticMutate, isPending: updateAnalyticIsPending } = usePatch(`${API_ROUTES["updateAnalytic"]}/${id}`, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-analytic"] });
            queryClient.invalidateQueries({ queryKey: [id] });
            dispatch(
                showMessage({
                    message: 'Analytic saved successfully',
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'success'
                })
            )
            router?.push(`/analytics`);
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

    const onSubmit = (data: any) => {
        if (isValid) {
            updateAnalyticMutate({ data })
        }
    };

    useEffect(() => {
        if (data) {
            setAnalyticData(() => data?.result)
            const fetchedData = data.result.data;
            
            setValue("reportItems", fetchedData?.reportItems || [
                { id: 1, name: 'Impressions' },
                { id: 2, name: 'Website Views' },
                { id: 3, name: 'Professions of Faith' },
            ]);
            setValue("platforms", fetchedData?.platforms || { id: "All", name: "All" });
            setValue("colorScheme", fetchedData?.colorScheme || "light");
            setValue("embedOption", fetchedData?.embedOption || "report");
            setValue("highlightCountry", fetchedData?.highlightCountry || "");
            setValue("width", fetchedData?.width || 600);
            setValue("height", fetchedData?.height || 600);
            setValue("state_name", fetchedData?.state_name || "");
            setValue("selectedEmbed", fetchedData?.selectedEmbed || "1");
        }
    }, [data]);


    const handleClickAnalyticSetting = () => {
        dispatch(openDialog({
            children: <AnalyticSettingDialog id={props.params.id} analyticData={analyticData} />,
            maxWidth: 'lg'
        }))
    }

    if (isLoading) return <FuseLoading />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Root
            header={
                <div className="w-full py-8 flex justify-between items-center">
                    <div className="flex items-center justify-center gap-[6px]">
                        <BackButton route="/analytics" />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <IconButton
                            onClick={(ev) => handleClickAnalyticSetting()}
                            aria-label="Settings"
                            size="large"
                            title="Analytic Setting"
                        >
                            <FuseSvgIcon>material-solid:settings</FuseSvgIcon>
                        </IconButton>
                        <Button className="p-bg-color" disabled={updateAnalyticIsPending || !isValid} variant='contained' onClick={handleSubmit(onSubmit)}>
                            {updateAnalyticIsPending ? <CircularProgress size={20} /> : "Save"}
                        </Button>
                    </div>
                </div>
            }
            content={
                <div className="w-full">
                    <AnalyticMain control={control} isValid={isValid} errors={errors} watch={watch} id={id} setValue={setValue} formState={formState} analyticData={analyticData}/>
                </div>
            }
            scroll="content"
        />
    );
}

export default AnalyticBuilder;
