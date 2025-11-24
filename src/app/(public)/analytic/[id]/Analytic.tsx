'use client'

import "@/styles/date-range-picker.css";
import React from "react";
import { API_ROUTES } from "@/constants/api";
import { useFetch } from "@/utils/hooks/useApi";
import FuseLoading from '@fuse/core/FuseLoading';
import AnalyticEmbed from "@/components/analitic-embed/AnalyticEmbed";
import AnalyticEmbed2 from "@/components/analitic-embed/AnalyticEmbed2";
import AnalyticEmbed3 from "@/components/analitic-embed/AnalyticEmbed3";
import AnalyticEmbed4 from "@/components/analitic-embed/AnalyticEmbed4";

export default function Analytic(props) {
  const id = props.params.id;

  const { data, isLoading, error } = useFetch(
    id,
    `${API_ROUTES["getAnalyticByID"]}/${id}`,
    {},
    { enabled: Boolean(id) }
  );

  const values = data?.result?.data;

  if (isLoading) return <FuseLoading />;
  if (error)
    return (
      <div>
        Error: {error.message}
        <h1>Analytic not found</h1>
      </div>
    );

  
  const selected = values?.selectedEmbed ?? values?.templateVersion ?? "1";
  const selectedStr = String(selected);

  
  
  if (selectedStr === "2") {
    return <AnalyticEmbed2 values={values} isEmbed={true} analyticData={data?.result} />;
  }

  if (selectedStr === "3") {
    return <AnalyticEmbed3 values={values} isEmbed={true} analyticData={data?.result} />;
  }

  if (selectedStr === "4") {
    return <AnalyticEmbed4 values={values} isEmbed={true} analyticData={data?.result} />;
  }

  return <AnalyticEmbed values={values} isEmbed={true} analyticData={data?.result} />;
}
