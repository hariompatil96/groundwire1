"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Close,
  Fullscreen,
  FilterAlt,
  Language as LanguageIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Church as ChurchIcon,
} from "@mui/icons-material";

import {
  Box,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";

import DateFilter, { FilterPayload } from "./DateFilter";
import MapComponent from "./MapComponent";
import { formatNumber } from "@/app/(control-panel)/dashboard/shared-components/common";
import { usePost } from "@/utils/hooks/useApi";
import { API_ROUTES } from "@/constants/api";
import { queryClient } from "@/app/App";

type ColorScheme = "light" | "dark";

type ReportItem = {
  id: number;
  name: string;
};

type LocationItem = {
  lat: number;
  lng: number;
  count?: number;
  label?: string;
};

type Values = {
  embedOption?: "map" | "report" | "both";
  platforms?: { id: string; name?: string };
  highlightCountry?: { id?: string; name?: string };
  state_name?: { id?: string; name?: string };
  colorScheme?: ColorScheme;
  width?: number;
  height?: number;
  reportItems?: ReportItem[];
};

type AnalyticData = {
  analyticName?: string;
};

type ReportsResponse = {
  impressions?: number;
  sessions?: number;
  pofs?: number;
  locations?: LocationItem[];
};

const metricIcons: Record<
  string,
  {
    icon: React.ReactNode;
    key: keyof ReportsResponse;
  }
> = {
  Impressions: {
    icon: (
      <LanguageIcon fontSize="large" className="text-primary" />
    ),
    key: "impressions",
  },
  "Website Views": {
    icon: (
      <PlayCircleOutlineIcon fontSize="large" className="text-primary" />
    ),
    key: "sessions",
  },
  "Professions of Faith": {
    icon: <ChurchIcon fontSize="large" className="text-primary" />,
    key: "pofs",
  },
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US").format(date);

const isIOSMobile = () => {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipod/.test(userAgent);
  const isIPad =
    /ipad/.test(userAgent) ||
    (navigator.platform === "MacIntel" &&
      (navigator as any).maxTouchPoints > 1);
  return isIOS || isIPad;
};

interface AnalyticEmbedProps {
  values: Values;
  isEmbed?: boolean;
  analyticData?: AnalyticData;
}

const AnalyticEmbed2: React.FC<AnalyticEmbedProps> = ({
  values,
  isEmbed = false,
  analyticData,
}) => {
  const [reports, setReports] = useState<ReportsResponse>({});
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const today = new Date();
  const router = useRouter();

  const [currentFilter, setCurrentFilter] = useState<{
    type: string;
    startDate: string;
    endDate: string;
  }>({
    type: "currentMonth",
    startDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    endDate: formatDate(today),
  });

  const { mutate: reportsMutate } = usePost<ReportsResponse>(
    `${API_ROUTES["getReports"]}`,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["get-reports"] });
        if (data?.result?.status) {
          setReports(data?.result?.totals || {});
        } else {
          setReports((data as any) || {});
        }
      },
      onError: (err) => console.error("Reports error:", err),
    },
    {},
    true
  );

  const handleFilterChange = (filter: FilterPayload) => {
    setCurrentFilter({
      type: filter.type,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });

    const payload: any = {
      startDate: filter.startDate,
      endDate: filter.endDate,
      platform:
        values?.platforms?.id === "All"
          ? ""
          : values?.platforms?.name?.toLowerCase(),
      isMap: values?.embedOption === "map" || values?.embedOption === "both",
    };

    if (values?.embedOption !== "report") {
      payload.highlightCountry = values?.highlightCountry?.id;
      if (values?.highlightCountry?.id === "United States") {
        payload.state_name = values?.state_name?.id;
      }
    }

    reportsMutate(payload);
  };

  const handleFullscreen = () => {
    const iframe = (window as any).frameElement || document.documentElement;

    if (iframe.requestFullscreen) iframe.requestFullscreen();
    else if ((iframe as any).webkitRequestFullscreen)
      iframe.webkitRequestFullscreen();

    setIsFullscreenMap(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if ((document as any).webkitExitFullscreen)
      document.webkitExitFullscreen();

    setIsFullscreenMap(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenMap(false);
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    reportsMutate({
      startDate: currentFilter.startDate,
      endDate: currentFilter.endDate,
      platform:
        values?.platforms?.id === "All"
          ? ""
          : values?.platforms?.name?.toLowerCase(),
      isMap: values?.embedOption !== "report",
      highlightCountry: values?.highlightCountry?.id,
      ...(values?.highlightCountry?.id === "United States"
        ? { state_name: values?.state_name?.id }
        : {}),
    });
  }, [values]);

  useEffect(() => {
    if (isEmbed) {
      document.body.style.backgroundColor =
        values?.colorScheme === "light" ? "white" : "#424242";
    }
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isEmbed, values?.colorScheme]);

  const resolvedWidth = Math.max(values?.width || 600, 300);
  const resolvedHeight = Math.max(values?.height || 600, 400);

  const selectedReports = values?.reportItems || [];

  
  const leftBarWidth = (resolvedWidth * 3) / 12; 

  return (
    <div
      className={`py-10 my-5 mx-auto max-w-[1200px] rounded-xl  overflow-hidden relative
      ${values?.colorScheme === "light" ? "bg-white" : "bg-gray-900 text-white"}`}
      style={{
        width: `${resolvedWidth}px`,
        minWidth: 300,
        minHeight: 400,
        height: `${resolvedHeight}px`,
      }}
    >
      
      <div
        className={`flex flex-col gap-6 p-6 ${values?.colorScheme === "light" ? "bg-white" : "bg-gray-900 text-white"} overflow-y-auto`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${leftBarWidth}px`,
          height: `${resolvedHeight}px`,
          zIndex: 10,
        }}
      >
        <h5 className={`text-lg font-semibold ${values?.colorScheme === "light" ? "text-black" : "text-white"}`}>
          {analyticData?.analyticName}{" "}
          {selectedReports?.find((r) => r?.id === 3)
            ? "- Professions of Faith"
            : ""}
        </h5>

        {showFilter && (
          <DateFilter
            onFilterChange={handleFilterChange}
            currentFilter={currentFilter.type}
          />
        )}

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-100 text-teal-700 hover:bg-teal-200 mx-auto"
        >
          <FilterAlt className="text-teal-700" />
          Filters
        </button>

        {selectedReports.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400">No report items selected.</div>
        )}
        {selectedReports.map((report) => {
          const cfg = metricIcons[report.name];
          if (!cfg) return null;
          const value = reports?.[cfg.key] ?? 0;
          return (
            <div
              key={report.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-1"
            >
              <div className="flex items-center text-teal-700 justify-center mb-2">
                {cfg.icon}
              </div>
              <span className={`text-lg text-center ${values?.colorScheme === "light" ? "text-black" : "text-white"}`}>{report.name}</span>
              <span className="text-xl text-center font-bold text-teal-700 dark:text-white truncate">{formatNumber(value)}</span>
            </div>
          );
        })}

        <Box
          className="rounded-xl py-3 bg-gray-100 dark:bg-gray-700 text-center text-sm text-gray-600 dark:text-gray-300 max-w-[600px] mx-auto"
          sx={{ px: 2 }}
        >
          <Typography className="text-xs">
            <strong>Note:</strong> Numbers are updated hourly, except for <strong>TikTok</strong> which is typically 1–2 days behind.
          </Typography>
        </Box>
        <Grid item xs={12} mt={2} display="flex" justifyContent="center" alignItems="center" gap="0.5rem">
          <Typography className="text-sm font-medium dark:text-gray-300">
            Powered by
          </Typography>
          <Avatar src="/assets/images/logo/gwLogo.png" alt="Ground Wire" sx={{ width: 32, height: 32 }} />
        </Grid>
      </div>

      
      <div
        className="relative p-0 mt-0"
        style={{
          marginLeft: `${leftBarWidth}px`,
          width: `calc(100% - ${leftBarWidth}px)`,
          height: `${resolvedHeight}px`,
        }}
      >
        <MapComponent
          locations={reports?.locations || []}
          highlightCountry={values?.highlightCountry?.name}
          highlightUSState={values?.state_name?.name}
          isDarkMode={values?.colorScheme === "dark"}
          mapHeight={`${resolvedHeight}px`}
        />
      </div>
    </div>
  );
};

export default AnalyticEmbed2;
