import { formatNumber, ImageWrapperStyles, ImgStyles, ReportImgHeading } from '@/app/(control-panel)/dashboard/shared-components/common';
import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFetch, usePost } from '@/utils/hooks/useApi';
import { API_ROUTES } from '@/constants/api';
import { queryClient } from '@/app/App';
import DateFilter from './DateFilter';
import MapComponent from './MapComponent';
import { useRouter } from 'next/navigation';
import { Close, Fullscreen } from '@mui/icons-material';


const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};

const isIOSMobile = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipod/.test(userAgent);
  const isIPad = /ipad/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  return isIOS;
};

const AnalyticEmbed = ({ values, isEmbed, analyticData }) => {
  const [reports, setReports] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false); 

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const router = useRouter();

  const [currentFilter, setCurrentFilter] = useState({
    type: "currentMonth",
    startDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    endDate: formatDate(today),
  });

  const { mutate: reportsMutate, isPending: reportLoading, error: reportError } = usePost(`${API_ROUTES["getReports"]}`, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get-reports"] });
      if (data?.result?.status) {
        setReports(data?.result?.totals)
      } else {
      }
    },
    onError: (error) => {
      console.error(error)
    },
  }, {}, true);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    reportsMutate({
      startDate: filter?.startDate,
      endDate: filter?.endDate,
      
      platform: values?.platforms?.id === "All" ? "" : values?.platforms?.name?.toLowerCase(),
      isMap: values?.embedOption === "map" || values?.embedOption === "both",
      ...((values?.embedOption === "map" || values?.embedOption === "both") ? { highlightCountry: values?.highlightCountry?.id } : {}),
      ...((values?.embedOption === "map" || values?.embedOption === "both") && values?.highlightCountry?.id === 'United States' ? { state_name: values?.state_name?.id } : {})
    });
  };

  const selectedReports = values?.reportItems || [];

  const metricConfig = {
    'Impressions': {
      icon: `/assets/images/reporting/${values?.colorScheme === "light" ? "GlobeIcon.png" : "whiteGlobeIcon.png"}`,
      key: 'impressions',
      imgStyle: ImgStyles
    },
    'Website Views': {
      icon: `/assets/images/reporting/${values?.colorScheme === "light" ? "phoneIcon1.png" : "whitePhoneIcon.png"}`,
      key: 'sessions',
      imgStyle: { ...ImgStyles, "& img": { height: "50%", objectFit: "contain" } }
    },
    'Professions of Faith': {
      icon: `/assets/images/reporting/${values?.colorScheme === "light" ? "CrossIcon.png" : "whiteCrossIcon.png"}`,
      key: 'pofs',
      imgStyle: { ...ImgStyles, "& img": { height: "70%", objectFit: "contain" } }
    }
  };

  const handleFullscreen = () => {
    const iframeElement = window.frameElement || document.documentElement;

   
    if (iframeElement.requestFullscreen) {
      iframeElement.requestFullscreen();
    } else if (iframeElement.webkitRequestFullscreen) {
      iframeElement.webkitRequestFullscreen();
    } else if (iframeElement.mozRequestFullScreen) {
      iframeElement.mozRequestFullScreen();
    } else if (iframeElement.msRequestFullscreen) {
      iframeElement.msRequestFullscreen();
    }

    
    setIsFullscreenMap(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseFullscreen = () => {
  
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    setIsFullscreenMap(false);
    document.body.style.overflow = '';
  };

   
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {
        
        setIsFullscreenMap(false);
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    reportsMutate({
      startDate: currentFilter?.startDate,
      endDate: currentFilter?.endDate,
      
      platform: values?.platforms?.id === "All" ? "" : values?.platforms?.name?.toLowerCase(),
      isMap: values?.embedOption === "map" || values?.embedOption === "both",
      ...((values?.embedOption === "map" || values?.embedOption === "both") ? { highlightCountry: values?.highlightCountry?.id } : {}),
      ...((values?.embedOption === "map" || values?.embedOption === "both") && values?.highlightCountry?.id === 'United States' ? { state_name: values?.state_name?.id } : {})
    });
  }, [values]);

  useEffect(() => {
    if (isEmbed) {
      if (values?.colorScheme === "light") {
        document.body.style.backgroundColor = 'white';
      }
      else {
        document.body.style.backgroundColor = '#424242';
      }
    } else {
      document.body.style.backgroundColor = '';
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isEmbed, values?.colorScheme]);

  const resolvedWidth = Math.max(values?.width || 600, 300);
  const resolvedHeight = Math.max(values?.height || 600, 400);

  console.log(reports);

  return (
    <>
      <Box
        className={`py-16 max-w-[1200px] flex flex-col justify-start items-center my-3 mx-auto
      ${!isEmbed
            ? `rounded-3xl ${values?.colorScheme === 'light' ? 'bg-white' : 'bg-grey-800 text-white'} shadow-lg`
            : `bg-transparent border !border-dotted border-gray-300 ${values?.colorScheme === 'light' ? 'bg-white' : 'bg-grey-800 text-white'}`
          }`}
        style={{
          maxWidth: `${resolvedWidth}px`,
          width: '100%',
          height: `${resolvedHeight}px`,
          minWidth: `300px`,
          minHeight: `400px`,
        }}
      >
        <Box className="w-full h-full overflow-auto px-4 pb-4">
          <Grid
            container
            spacing={3}
            sx={{
              px: 2,
            }}
          >
           
            {(values?.embedOption === "report" || values?.embedOption === "both") && (
              <Grid
                item
                xs={12}
                lg={(values?.embedOption === "both" && resolvedWidth >= 900) ? 5 : 12}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  height: {
                    lg: (values?.embedOption === "both" && resolvedWidth >= 900) ? '400px' : 'auto'
                  }
                }}
              >
                
                <Box>
                  <DateFilter onFilterChange={handleFilterChange} currentFilter={currentFilter?.type} />
                </Box>

                
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.3rem", sm: "1.8rem" },
                    textAlign: { xs: "center", lg: (resolvedWidth >= 900) ? values?.embedOption === "report" ? "center" : "left" : "center" },
                    fontWeight: 600
                  }}
                >
                  {analyticData?.analyticName} {selectedReports?.find((report) => report?.id === 3) ? "- Professions of Faith" : ""}
                </Typography>

                {/* Reports Grid */}
                <Grid container spacing={2} justifyContent="center" sx={{ flex: 1 }}>
                  {selectedReports.map((report) => {
                    const config = metricConfig[report.name];
                    if (!config) return null;
                    return (
                      <Grid
                        key={report.id}
                        item
                        xs={resolvedWidth < 500 ? 12 : 4}
                        sm={4}
                        md={4}
                        lg={(values?.embedOption === "both" && resolvedWidth >= 900) ? 4 : 4}
                        xl={(values?.embedOption === "both" && resolvedWidth >= 900) ? 4 : 4}
                        sx={ImageWrapperStyles}
                      >
                        <Avatar
                          src={config.icon}
                          alt={report.name}
                          sx={config.imgStyle}
                        />
                        <Typography sx={{
                          ...ReportImgHeading,
                          color: values?.colorScheme === "light" ? "#018594" : "white",
                          fontSize: { xs: "1.2rem", sm: "1.5rem" }
                        }}>
                          {formatNumber(reports?.[config.key] || 0)}
                        </Typography>
                        <Typography
                          fontSize={{ xs: "0.9rem", sm: "1.2rem" }}
                          textAlign="center"
                          height={{ xs: "auto", sm: "70px" }}
                        >
                          {report.name}
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            )}

            
            {(values?.embedOption === "map" || values?.embedOption === "both") && (
              <Grid
                item
                xs={12}
                lg={(values?.embedOption === "both" && resolvedWidth >= 900) ? 7 : 12}
                ref={mapContainerRef}
                sx={{
                  position: 'relative',
                  
                  height: {
                    lg: (values?.embedOption === "both" && resolvedWidth >= 900) ? '400px' : 'auto'
                  },
                  mt: { xs: 3, lg: (values?.embedOption === "both" && resolvedWidth >= 900) ? 0 : 3 }
                }}
              >
                
                {values?.embedOption === "map" && (
                  <>
                    <Box mb={2}>
                      <DateFilter onFilterChange={handleFilterChange} currentFilter={currentFilter?.type} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: "1.3rem", sm: "1.8rem" },
                        textAlign: "center",
                        fontWeight: 600,
                        mb: 2
                      }}
                    >
                      {analyticData?.analyticName}
                    </Typography>
                  </>
                )}
                <Box sx={{
                  height: values?.embedOption === "both" && resolvedWidth >= 900 ? '100%' : 'auto',
                  minHeight: '300px'
                }}>

                  <MapComponent
                    locations={reports?.locations || []}
                    highlightCountry={values?.highlightCountry?.name}
                    highlightUSState={values?.state_name?.name}
                    isDarkMode={values?.colorScheme === "dark"}
                    mapHeight={values?.embedOption === "both" && resolvedWidth >= 900 ? '400px' : '400px'}
                  />
                </Box>
                {isIOSMobile() && isEmbed && (
                  <IconButton
                    onClick={handleFullscreen}
                    sx={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: 40,
                      height: 40,
                      backgroundColor: values?.colorScheme === "dark" ? "#1f1f1f" : "#fff",
                      borderRadius: "4px",
                      boxShadow: "0px 1px 4px -1px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 9999,
                      "&:hover": {
                        backgroundColor: values?.colorScheme === "dark" ? "#2f2f2f" : "#f0f0f0",
                      },
                    }}
                    aria-label="Fullscreen Map"
                  >
                    <Fullscreen
                      fontSize="large"
                      sx={{
                        color: values?.colorScheme === "dark" ? "#fff" : "#666"
                      }}
                    />
                  </IconButton>
                )}
              </Grid>
            )}

            
            <Grid item xs={12} mt={1}>
              <Box
                className="rounded-xl py-3 bg-gray-100 dark:bg-gray-700 text-center text-sm text-gray-600 dark:text-gray-300 max-w-[600px] mx-auto"
                sx={{ px: 2 }}
              >
                <Typography className="text-xs">
                  <strong>Note:</strong> Numbers are updated hourly, except for <strong>TikTok</strong> which is typically 1–2 days behind.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} mt={2} display="flex" justifyContent="center" alignItems="center" gap="0.5rem">
              <Typography className="text-sm font-medium dark:text-gray-300">
                Powered by
              </Typography>
              <Avatar src="/assets/images/logo/gwLogo.png" alt="Ground Wire" sx={{ width: 32, height: 32 }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
      
      {isFullscreenMap && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            maxHeight: '100vh',  
            zIndex: 2147483647, 
            backgroundColor: values?.colorScheme === 'dark' ? '#424242' : '#fff',
            overflow: 'hidden',
            
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
          }}
        >
         
          <IconButton
            onClick={handleCloseFullscreen}
            sx={{
              position: 'fixed', 
              top: { xs: '8px', sm: '10px' },
              right: { xs: '8px', sm: '10px' },
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              backgroundColor: values?.colorScheme === 'dark' ? '#1f1f1f' : '#fff',
              borderRadius: '4px',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.3)',
              zIndex: 2147483647,
              '&:hover': {
                backgroundColor: values?.colorScheme === 'dark' ? '#2f2f2f' : '#f0f0f0',
              },
            }}
            aria-label="Close fullscreen"
          >
            <Close
              sx={{
                fontSize: { xs: '20px', sm: '24px' },
                color: values?.colorScheme === 'dark' ? '#fff' : '#666'
              }}
            />
          </IconButton>

         
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <MapComponent
              locations={reports?.locations || []}
              highlightCountry={values?.highlightCountry?.name}
              highlightUSState={values?.state_name?.name}
              isDarkMode={values?.colorScheme === "dark"}
              mapHeight="100vh"
            />
          </Box>
        </Box>
      )}
    </>
  )
}

export default AnalyticEmbed
