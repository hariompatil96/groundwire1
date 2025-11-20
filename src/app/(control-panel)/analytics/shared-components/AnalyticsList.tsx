import React from 'react';
import { Grid, Typography } from '@mui/material'
import { useDispatch } from 'react-redux';
import TableComponent from '../../../../components/table-component/TableComponents';
import { useRouter } from 'next/navigation';
import { get } from 'lodash';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import EmbedCodeDialog from '@/components/embed-code-dialog/EmbedCodeDialog';


const AnalyticsList = () => {
    const dispatch = useDispatch()
    const router = useRouter();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url)
            .then(() => {
                dispatch(
                    showMessage({
                        message: 'Link copied to clipboard.',
                        autoHideDuration: 5000,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right'
                        },
                        variant: 'success'
                    }))
            })
            .catch((error) => {
                console.error('Error copying text to clipboard:', error);
                dispatch(
                    showMessage({
                        message: get(error, 'message', 'Something went wrong'),
                        autoHideDuration: 5000,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right'
                        },
                        variant: 'error'
                    }))
            });
    };

    const handleClickEmbedAnalytic = (data) => {
        dispatch(openDialog({
            children: <EmbedCodeDialog id={data?.id} type="analytic" data={data} />,
            maxWidth: 'lg'
        }))
    }

    return (
        <Grid container rowGap={3} columnSpacing={2}>
            <Grid item xs={12} className='p-20 md:p-80 md:pt-8 md:rounded-2xl'>
                <TableComponent
                    slug="analytic"
                    querykey="get-analytic"
                    getAPIEndPiont="getAnalytics"
                    DeleteAPIEndPiont="deleteAnalytic"
                    // enableExportTable={true}
                    // exporterTableProps={
                    //             {
                    //                 fileName: "form-list",
                    //                 pdfTitle: "Form List"
                    //             }
                    //         }
                    columns={
                        [
                            {
                                accessorKey: 'analyticName',
                                header: 'Name',
                            },
                            {
                                accessorKey: 'id',
                                header: 'Analytic Url',
                                Cell: ({ cell }) => {
                                    const analyticUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/analytic/${cell.getValue()}`;
                                    return (
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                // gap: "0.5rem",
                                                cursor: "pointer",
                                            }}
                                            title="Copy form Url"
                                            onClick={() => {
                                            copyToClipboard(analyticUrl)
                                        }}>
                                            {analyticUrl}
                                            <FuseSvgIcon sx={{
                                                fontSize: "1.5rem",
                                            }} className="copy-icon">material-outline:content_copy</FuseSvgIcon>
                                        </Typography>
                                    );
                                },
                            },
                            {
                                accessorKey: 'createdAt',
                                header: 'Created At',
                                Cell: ({ cell }) => formatDate(cell.getValue())
                            },
                            {
                                accessorKey: 'updatedAt',
                                header: 'Last Updated',
                                Cell: ({ cell }) => formatDate(cell.getValue())
                            }
                        ]
                    }

                    actions={
                        [
                            {
                                label: "Embed Code",
                                icon: 'material-outline:code',
                                onClick: (row) => get(row, "original.id") && handleClickEmbedAnalytic(get(row, "original")),
                            },
                            {
                                label: "Edit",
                                icon: 'material-solid:edit',
                                onClick: (row) => get(row, "original.id") && router?.push(`/analytics/${get(row, "original.id")}`),
                            },
                        ]
                    }
                    deleteAction={true}
                />
            </Grid>
        </Grid>
    )
}

export default AnalyticsList;