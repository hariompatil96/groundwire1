import React from 'react'
import { Box, Table, TableBody, TableCell, Paper, TableContainer, TableHead, TableRow, Avatar, Typography, Grid } from '@mui/material';
import { formatNumber } from './common';

const fbHeadings = ["Campaign","Spend", "Impressions"];


const LiveDataList = ({ values, reports, platforms }) => {
    const message = `The data shown below is from the start of the day (00:00) to the current time.`;
    return (
        <Box my={4}>
                {reports?.length > 0 && <Typography variant="body1" sx={{ color: "#333", fontWeight: "500",mb:2 }}>
                    {message}
                </Typography>}
            <TableContainer component={Paper}>
                <Table sx={{
                    minWidth: 650,
                    border: "1px solid #ccc",
                    "& .MuiTableCell-root": { border: "1px solid #ccc" }
                }} aria-label="campaigns table">
                    <TableHead>
                        <TableRow>
                            {/* <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", border: "1px solid #ccc" }}>S.No</TableCell> */}
                            {/* <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", border: "1px solid #ccc" }}>Campaign</TableCell> */}
                            {
                                platforms?.name === "Facebook" ? fbHeadings?.map((data, index) => <TableCell key={index} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", border: "1px solid #ccc" }}>{data}</TableCell>) : null
                            }
                            {platforms?.name === "GA4" &&<>
                                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", border: "1px solid #ccc" }}>Account</TableCell>
                                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", border: "1px solid #ccc" }}>Views</TableCell>
                                </>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {platforms?.name === "Facebook" && reports?.map((data, index) => {
                            const campaign = data?.[0];
                            return <TableRow key={campaign?.account_id}>
                                {/* <TableCell>{index + 1}</TableCell> */}
                                <TableCell>{campaign?.account_name}</TableCell>
                                <TableCell>
                                    <Grid container alignItems="center">
                                        <Grid item xs={9}>
                                            <Typography >
                                                ${formatNumber(campaign?.spend)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell>
                                    <Grid container alignItems="center">
                                        <Grid item xs={9}>
                                            <Typography >
                                                {formatNumber(campaign?.impressions)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        }
                        )}
                        {platforms?.name === "GA4" && reports?.map((campaign, index) => {
                            const totalViews = campaign?.rows?.reduce((acc, {screenPageViews})=> acc + Number(screenPageViews || 0),0)
                            return <TableRow key={campaign?.accountId}>
                                {/* <TableCell>{index + 1}</TableCell> */}
                                <TableCell>{campaign?.accountName}</TableCell>
                                <TableCell>
                                    <Grid container alignItems="center">
                                        <Grid item xs={9}>
                                            <Typography >
                                                {formatNumber(totalViews)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        }
                        )}
                        <TableRow>
                            <TableCell colSpan={1} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                                Total
                            </TableCell>
                            {platforms?.name === "Facebook" && <> <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                                ${formatNumber(
                                    reports?.reduce((acc, data) => acc + Number(data?.[0]?.spend || 0), 0)
                                )}
                            </TableCell>
                                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                                    {formatNumber(
                                        reports?.reduce((acc, data) => acc + Number(data?.[0]?.impressions || 0), 0)
                                    )}
                                </TableCell>
                            </>
                            }
                            {platforms?.name === "GA4" && <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                                {formatNumber(
                                    reports?.reduce((acc, data) => acc + Number(data?.rows?.reduce((acc, {screenPageViews})=> acc + Number(screenPageViews || 0),0) || 0), 0)
                                )}
                            </TableCell>}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default LiveDataList
