import React from 'react';
import { Grid, Typography } from '@mui/material'
import { useDispatch } from 'react-redux';
import TableComponent from '../../../../components/table-component/TableComponents';
import { useRouter } from 'next/navigation';
import { get } from 'lodash';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import EmbedCodeDialog from '../../../../components/embed-code-dialog/EmbedCodeDialog';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';


const FormsList = () => {
    const dispatch = useDispatch()
    const router = useRouter();

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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleClickEmbedForm = (id) => {
        dispatch(openDialog({
            children: <EmbedCodeDialog id={id} type="form" />,
            maxWidth: 'lg'
        }))
    }

    return (
        <Grid container rowGap={3} columnSpacing={2}>
            <Grid item xs={12}>
                <TableComponent
                    slug="forms"
                    querykey="get-forms"
                    getAPIEndPiont="getForms"
                    DeleteAPIEndPiont="deleteForm"
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
                                accessorKey: 'formName',
                                header: 'Form Name',
                            },
                            {
                                accessorKey: 'id',
                                header: 'Form Url',
                                Cell: ({ cell }) => {
                                    const formUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/form/${cell.getValue()}`;
                                    return (
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                cursor: "pointer",
                                            }}
                                            title="Copy form Url"
                                            onClick={() => {
                                            copyToClipboard(formUrl)
                                        }}>
                                            {formUrl}
                                            <FuseSvgIcon sx={{
                                                fontSize: "1rem",
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
                                label: "View submissions",
                                icon: 'material-outline:remove_red_eye',
                                onClick: (row) => get(row, "original.id") && router?.push(`/form-submission/${get(row, "original.id")}`),
                            },
                            {
                                label: "Embed Code",
                                icon: 'material-outline:code',
                                onClick: (row) => get(row, "original.id") && handleClickEmbedForm(get(row, "original.id")),
                            },
                            {
                                label: "Edit",
                                icon: 'material-solid:edit',
                                onClick: (row) => get(row, "original.id") && router?.push(`/user-forms/${get(row, "original.id")}`),
                            },
                        ]
                    }

                    deleteAction={true}
                />
            </Grid>
        </Grid>
    )
}

export default FormsList;