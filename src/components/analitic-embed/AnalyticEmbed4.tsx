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
    icon: <LanguageIcon fontSize="large" className="text-primary" />,
    key: "impressions",
  },
  "Website Views": {
    icon: <PlayCircleOutlineIcon fontSize="large" className="text-primary" />,
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
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1);
  return isIOS || isIPad;
};


interface AnalyticEmbedProps {
  values: Values;
  isEmbed?: boolean;
  analyticData?: AnalyticData;
}

const AnalyticEmbed4: React.FC<AnalyticEmbedProps> = ({
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
      className={` flex flex-col justify-start items-center max-w-[1200px] my-5 mx-auto
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
      <div className="w-full h-full overflow-auto px-0 mt-0">
        <div className="flex flex-col gap-6 mt-0">
          
          {(values?.embedOption === "map" || values?.embedOption === "both") && (
            <div
              ref={mapContainerRef}
              className="relative w-full mt-0 px-0"
              aria-hidden={isFullscreenMap}
            >
              <div className="min-h-[300px] overflow-hidden shadow-lg border border-gray-200 bg-white dark:bg-gray-900">
                <MapComponent
                  locations={reports?.locations || []}
                  highlightCountry={values?.highlightCountry?.name}
                  highlightUSState={values?.state_name?.name}
                  isDarkMode={values?.colorScheme === "dark"}
                  mapHeight="400px"
                />
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

          
          {(values?.embedOption === "report" ||
            values?.embedOption === "both" ||
            values?.embedOption === "map") && (
            <div className="w-full flex justify-center">
              {showFilter && (
                <div className="w-full max-w-[900px] px-4">
                  <DateFilter
                    onFilterChange={handleFilterChange}
                    currentFilter={currentFilter.type}
                  />
                </div>
              )}
            </div>
          )}

          
          {(values?.embedOption === "report" ||
            values?.embedOption === "both" ||
            values?.embedOption === "map") && (
            <div className="w-full flex items-center justify-center p-2 px-6 gap-4">
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
          )}

          
          {(values?.embedOption === "report" ||
            values?.embedOption === "both" ||
            values?.embedOption === "map") && (
            <div className="w-full flex justify-center px-4">
              <div
                className={`grid gap-4 p-2 px-1 rounded-xl max-w-[900px] w-full`}
                style={{ gridTemplateColumns: `repeat(${selectedReports.length}, 1fr)` }}
              >
                {selectedReports.length === 0 && (
                  <div className="w-full text-center text-sm text-gray-500 col-span-full">
                    No report items selected.
                  </div>
                )}

                {selectedReports.map((report, index) => {
                  const cfg = metricIcons[report.name];
                  if (!cfg) return null;

                  const value = reports?.[cfg.key] || 0;

                  return (
                    <div
                      key={report.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col gap-1 items-center"
                    >
                      
                      <div className="flex h-15 w-15 items-center justify-center rounded-lg   text-teal-700 dark:text-white">
                        {cfg.icon}
                      </div>

                      
                      <div className="flex flex-col">
                        <span className="text-sm px-5 font-bold break-words">
                          {report.name}
                        </span>
                        <span className="text-xl px-5 font-extrabold text-teal-700 tracking-tight">
                          {formatNumber(value)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
            </div>
            
          )}
        </div>
        <div className="text-center text-sm mt-10">
                <p>
                  Numbers are updated hourly, except for <strong>TikTok</strong>{" "}
                  which is typically 1–2 days behind.
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
              mapHeight="100vh"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticEmbed4;
