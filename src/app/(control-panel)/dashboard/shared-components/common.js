import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import * as yup from 'yup';
import { endOfMonth, startOfMonth } from 'date-fns';

export function CountingTypography(targetNumber) {
  console.log(targetNumber)
  const [count, setCount] = useState(0);
  if (targetNumber === 0) {
    return <Typography sx={ReportImgHeading}>
      0
    </Typography>
  }

  useEffect(() => {
    const duration = 1000;
    const stepTime = Math.max(10, Math.floor(duration / targetNumber));
    let start = 0;
    const increment = Math.ceil(targetNumber / (duration / stepTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {

        start = targetNumber;
        clearInterval(timer);
      }
      setCount(start);
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetNumber]);

  const formattedCount = Number.isInteger(count)
    ? count.toLocaleString()
    : count.toFixed(3).toLocaleString();

  console.log(formattedCount)

  return (
    <Typography sx={ReportImgHeading}>
      {formattedCount}
    </Typography>
  );
}

export const formatNumber = (number) => {
  if (number === undefined || number === null || number === '') return '0';

  // If it's already a formatted string with commas, return it as is
  if (typeof number === 'string' && number.includes(',')) {
    return number;
  }

  // Remove commas if present and convert to number
  const cleanNumber = typeof number === 'string' ? number.replace(/,/g, '') : number;
  const numValue = Number(cleanNumber);

  // Check if conversion resulted in NaN
  if (isNaN(numValue)) return '0';

  const formattedNumber = numValue.toFixed(0);
  return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const isEmpty = (obj) => Object.keys(obj).length === 0;

export const schema = yup.object({
  platforms: yup
    .object()
    .nullable()
    .required("Platform is required")
    .typeError("Required"),
  campaigns: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        name: yup.string().required(),
      })
    )
    .min(1, "At least one campaign must be selected")
    .required("Campaign is required")
    .typeError("Required"),
  dateRange: yup.array().of(
    yup.object({
      startDate: yup.date().required("Start date is required"),
      endDate: yup.date().required("End date is required"),
    })
  ),
});

export const initialState = {
  platforms: { id: "all", name: "All" },
  campaigns: [
    { id: "all", name: "All" },
  ],
  dateRange: [
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection',
    },
  ],
  filterType: "dateRange"
}

export const ImageWrapperStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // gap: '1rem',
  width: '100%',
  flexDirection: 'column',
};

export const ImgStyles = {
  maxWidth: '160px',
  width: '160px',
  objectFit: 'none',
  maxHeight: '160px',
  height: '160px',
};

export const ReportImgHeading = {
  color: '#018594',
  fontSize: '1.2rem',
};


const FACEBOOK_GRAPH_API_VERSION = "v21.0";
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

export const fetchAdAccountsAndStats = async (accountsArray) => {
  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0];
  const timeRange = JSON.stringify({ since: todayDateString, until: todayDateString });
  const encodedTimeRange = encodeURIComponent(timeRange);
  try {
    if (!Array.isArray(accountsArray) || accountsArray.length === 0) {
      throw new Error("Invalid accounts array.");
    }

    const statsPromises = accountsArray.map(({ account_id, main_campaign_id, name }) => {
      const url = main_campaign_id
        ? `https://graph.facebook.com/${FACEBOOK_GRAPH_API_VERSION}/${main_campaign_id}/insights?fields=account_id,campaign_id,date_start,date_stop,impressions,spend,campaign_name,ad_name,account_name&time_range=${encodedTimeRange}&access_token=${ACCESS_TOKEN}`
        : `https://graph.facebook.com/${FACEBOOK_GRAPH_API_VERSION}/act_${account_id}/insights?fields=spend,impressions,account_name,account_id&time_range[since]=${todayDateString}&time_range[until]=${todayDateString}&access_token=${ACCESS_TOKEN}`;

      return fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch stats for ${main_campaign_id ? 'campaign' : 'account'} ${main_campaign_id || account_id}`);
          }
          return res.json();
        })
        .then((statsData) => ({
          accountId: account_id,
          campaignId: main_campaign_id,
          stats: statsData?.data?.length > 0 ? statsData?.data : [{ account_name: name }],
        }))
        .catch((error) => ({
          accountId: account_id,
          campaignId: main_campaign_id,
          error: error.message,
        }));
    });

    const statsData = await Promise.all(statsPromises);
    const totalStats = statsData?.map(({ stats }) => stats)
    return totalStats;
  } catch (err) {
    console.error("Error in fetchAdAccountsAndStats:", err);
    throw err;
  }
};

export const fetchAnalyticsData = async (campaignIds) => {
  try {
    const query = new URLSearchParams({ data: JSON.stringify(campaignIds) }).toString();
    const res = await fetch(`/dashboard/api/analytics?${query}`);

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err)
  }
};
