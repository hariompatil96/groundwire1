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
  if (typeof window === "") return false;
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

const AnalyticEmbed3: React.FC<AnalyticEmbedProps> = ({
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

  
  return (
    <div
      className={`py-10 flex flex-col justify-start items-center max-w-[1200px] my-5 mx-auto
      ${
        !isEmbed
          ? `${values?.colorScheme === "light" ? "bg-white" : "bg-gray-800 text-white"} 
             shadow-xl shadow-black rounded-xl`
          : `border border-dotted border-gray-300 rounded-xl 
             ${values?.colorScheme === "light" ? "bg-white" : "bg-gray-800 text-white"}`
      }`}
      style={{
        maxWidth: `${resolvedWidth}px`,
        width: "100%",
        height: `${resolvedHeight}px`,
        minWidth: "300px",
        minHeight: "400px",
      }}
    >
      <div className="w-full h-full overflow-auto px-0 pb-6">
        <div className="flex flex-wrap gap-6">
          
          {(values?.embedOption === "report" ||
            values?.embedOption === "both") && (
            <div
              className={`w-full lg:${
                values?.embedOption === "both" && resolvedWidth >= 900
                  ? "5/12"
                  : "full"
              } flex flex-col gap-6`}
            >
              
              {showFilter && (
                <DateFilter
                  onFilterChange={handleFilterChange}
                  currentFilter={currentFilter.type}
                />
              )}

              
              <div className="flex items-center justify-center p-6 px-6 gap-6">
                <h5 className="text-xl sm:text-2xl font-semibold tracking-tight text-center">
                  {analyticData?.analyticName}{" "}
                  {selectedReports?.find((r) => r?.id === 3)
                    ? "- Professions of Faith"
                    : ""}
                </h5>

                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="p-2 rounded-lg bg-gray-100 border border-gray-300 hover:bg-gray-200"
                >
                  <FilterAlt
                    fontSize="medium"
                    className={showFilter ? "text-blue-600" : "text-gray-600"}
                  />
                </button>
              </div>

              
              <div className="flex items-center gap-3 p-4 px-3 rounded-xl">
                {selectedReports.map((report, index) => {
                  const cfg = metricIcons[report.name];
                  if (!cfg) return null;

                  const value = reports?.[cfg.key] || 0;

                  return (
                    <div
                      key={report.id}
                      className={`flex-1 border border-gray-200 rounded-lg p-4 flex flex-col gap-1 items-center ${
                        index !== selectedReports.length - 1
                          ? " border-gray-300 dark:border-gray-600 px-4"
                          : ""
                      }`}
                    >
                      
                      <div className="flex h-15 w-15 gap-[50px] items-center justify-center rounded-lg   text-teal-700 dark:text-white">
                        {cfg.icon}
                      </div>

                     
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold px-5 ${values?.colorScheme === "dark" ? "text-white" : "text-black"}`}>
                          {report.name}
                        </span>
                        <span className="text-xl items-center font-extrabold text-teal-700 dark:text-white px-6">
                          {formatNumber(value)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          
          {(values?.embedOption === "map" ||
            values?.embedOption === "both") && (
            <div
              ref={mapContainerRef}
              className={`relative w-full lg:${
                values?.embedOption === "both" && resolvedWidth >= 900
                  ? "7/12"
                  : "full"
              } mt-3 lg:mt-0`}
            >
              
              {values?.embedOption === "map" && (
                <>
                  {showFilter && (
                    <DateFilter
                      onFilterChange={handleFilterChange}
                      currentFilter={currentFilter.type}
                    />
                  )}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h5 className="text-xl sm:text-2xl font-semibold text-center tracking-tight">
                      {analyticData?.analyticName}
                    </h5>

                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      className="p-2 rounded-lg bg-gray-100 border border-gray-300 hover:bg-gray-200"
                    >
                      <FilterAlt
                        fontSize="small"
                        className={
                          showFilter ? "text-blue-600" : "text-gray-600"
                        }
                      />
                    </button>
                  </div>
                </>
              )}

              
              <div className="min-h-[300px] overflow-hidden shadow-lg border border-gray-200 bg-white dark:bg-gray-900">
                <MapComponent
                  locations={reports?.locations || []}
                  highlightCountry={values?.highlightCountry?.name}
                  highlightUSState={values?.state_name?.name}
                  isDarkMode={values?.colorScheme === "dark"}
                  mapHeight="400px"
                />
              </div>
              <div className={`text-center text-sm mt-10 mb-0 ${values?.colorScheme === "dark" ? "text-white" : "text-black"}`}>
                <p>
                  Numbers are updated hourly, except for{" "}
                  <strong>TikTok</strong> which is typically 1–2 days behind.
                </p>
                <p>
                  Powered By{" "}
                  <img
                    src="/assets/images/logo/gwLogo.png"
                    alt="GW Logo"
                    className="inline-block h-20 w-20 ml-2"
                  />
                </p>
              </div>

              
              {isIOSMobile() && isEmbed && (
                <button
                  onClick={handleFullscreen}
                  className="absolute top-3 right-3 w-10 h-10 bg-white shadow flex items-center justify-center hover:bg-gray-200 z-50"
                >
                  <Fullscreen className="text-gray-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      
      {isFullscreenMap && (
        <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-white dark:bg-gray-800">
          <button
            onClick={handleCloseFullscreen}
            className="fixed top-2 right-2 w-10 h-10 bg-white rounded shadow flex items-center justify-center hover:bg-gray-200"
          >
            <Close className="text-gray-600" />
          </button>

          <div className="w-full h-full">
            <MapComponent
              locations={reports?.locations || []}
              highlightCountry={values?.highlightCountry?.name}
              highlightUSState={values?.state_name?.name}
              isDarkMode={values?.colorScheme === "dark"}
              mapHeight="80vh"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticEmbed3;
