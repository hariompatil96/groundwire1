export const dynamic = "force-dynamic";
import { google } from 'googleapis';

const { GOOGLE_APPLICATION_CREDENTIALS_JSON } = process.env;

export async function GET(req) {
  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0];

  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get('data');
    const parsedArray = JSON.parse(data || '[]');
    if (!GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      throw new Error("Google application credentials not set in environment variables.");
    }
    const credentials = JSON.parse(GOOGLE_APPLICATION_CREDENTIALS_JSON);

    const analytics = await initializeAnalyticsClient(credentials);

    const allStatsPromises = parsedArray?.map((account) =>
      fetchAnalyticsData(analytics, account?.prop_id, todayDateString, todayDateString)
        .then((statsData) => {
          if (!statsData) {
            throw new Error(`No data returned for property ${account.prop_id}`);
          }

          const rows = statsData?.rows || [];
          const formattedRows = rows.map(row => ({
            accountName: account.name,
            date: row.dimensionValues?.[0]?.value || '',       // Date
            pagePath: row.dimensionValues?.[1]?.value || '',   // Page Path
            screenPageViews: parseInt(row.metricValues?.[0]?.value || '0', 10)  // Page Views
          }));

          return {
            accountId: account.prop_id,
            accountName: account.name,
            rows: formattedRows,
          };
        })
        .catch((error) => ({
          accountId: account.id,
          accountName: account.name,
          error: error.message,
        }))
    );

    const allStats = await Promise.all(allStatsPromises);

    return new Response(JSON.stringify(allStats), { status: 200 });
  } catch (err) {
    console.error('Error fetching Google Analytics data:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data from Google Analytics', details: err.message }),
      { status: 500 }
    );
  }
}

async function initializeAnalyticsClient(credentials) {
  const auth = new google.auth.GoogleAuth({
     credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const analytics = google.analyticsdata({
    version: 'v1beta',
    auth,
  });

  return analytics;
}

async function fetchAnalyticsData(analytics, propertyId, startDate, endDate) {
  if (!propertyId) {
    console.error("Invalid propertyId:", propertyId);
    return null;
  }

  const formattedPropertyId = propertyId.startsWith('properties/') 
    ? propertyId 
    : `properties/${propertyId}`;

  const request = {
    property: formattedPropertyId,
    dateRanges: [{
      startDate: startDate,
      endDate: endDate,
    }],
    dimensions: [
      { name: 'date' },
      { name: 'pagePath' }
    ],
    metrics: [
      { name: 'screenPageViews' }
    ]
  };

  try {
    const response = await analytics.properties.runReport({
      property: formattedPropertyId,
      requestBody: request
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for property ID: ${propertyId}`, error);
    throw new Error(`GA4 API Error: ${error.message}`);
  }
}