'use client';
import { queryClient } from "@/app/App";
import MapComponent from "@/components/analitic-embed/MapComponent";
import { API_ROUTES } from "@/constants/api";
import { usePost } from "@/utils/hooks/useApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const FullMapView = (props) => {
    // const id = props.params.id;
    const searchParams = useSearchParams();
    const router = useRouter();
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        platform: '',
        highlightCountry: '',
        state_name: '',
        colorScheme: 'light'
    });

    const [reports, setReports] = useState([]);
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


    useEffect(() => {
        const newFilters = {
            startDate: searchParams.get('startDate') || '',
            endDate: searchParams.get('endDate') || '',
            platform: searchParams.get('platform') || '',
            highlightCountry: searchParams.get('highlightCountry') || '',
            state_name: searchParams.get('state_name') || '',
            colorScheme: searchParams.get('colorScheme') || 'light'
        };

        setFilters(newFilters);

        if (newFilters.startDate && newFilters.endDate) {
            reportsMutate({
                startDate: newFilters.startDate,
                endDate: newFilters.endDate,
                platform: newFilters.platform,
                isMap: true,
                highlightCountry: newFilters.highlightCountry,
                state_name: newFilters.state_name
            });
        }
    }, [searchParams]);

    const handleClose = () => {
        router.back(); // This will go back to the embed page
    };

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            {/* Close Button */}
            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: filters.colorScheme === 'dark' ? '#1f1f1f' : '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}
                aria-label="Close fullscreen"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    style={{ fill: filters.colorScheme === 'dark' ? '#fff' : '#666' }}
                >
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                </svg>
            </button>

            <MapComponent
                locations={reports?.locations || []}
                highlightCountry={filters.highlightCountry}
                highlightUSState={filters.state_name}
                isDarkMode={filters.colorScheme === "dark"}
                mapHeight={"89vh"}
            />
        </div>
    )
}

export default FullMapView
