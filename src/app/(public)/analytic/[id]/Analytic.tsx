'use client'

import "@/styles/date-range-picker.css"
import React from "react";
import { API_ROUTES } from "@/constants/api.js";
import { useFetch } from "@/utils/hooks/useApi.js";
import FuseLoading from '@fuse/core/FuseLoading';
import AnalyticEmbed from "@/components/analitic-embed/AnalyticEmbed";


export default function Analytic(props) {
    const id = props.params.id;

    const { data, isLoading, error } = useFetch(id, `${API_ROUTES["getAnalyticByID"]}/${id}`, {}, {
        enabled: Boolean(id)
    });

    const values = data?.result?.data;

    if (isLoading) return <FuseLoading />;
    if (error) return <div>Error: {error.message}
        <h1>Analytic not found</h1>
    </div>;

    return <AnalyticEmbed values={values} isEmbed={true} analyticData={data?.result} />
}