'use client';

import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material'
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { get } from 'lodash';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TableComponent from '@/components/table-component/TableComponents';
import { API_ROUTES } from '@/constants/api';
import { useFetch } from '@/utils/hooks/useApi';
import Root from '@/components/Root';
import BackButton from '@/components/back-button/BackButton';
import ViewEditSubmissionDialog from './shared-components/ViewEditSubmissionDialog';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { keepPreviousData } from '@tanstack/react-query';

export default function FormSubmission(props) {
    const id = props.params.id;
    const dispatch = useDispatch()
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, isError, error, refetch } = useFetch(
        'get-form-Submissions',
        `${API_ROUTES.getFormSubmissions}/${id}`,
        {
            ...(searchQuery && { search: searchQuery }),
          },
          {
            enabled: true,
            placeholderData: keepPreviousData
          }
    );

    const handleEditView = (rowData) => {
        dispatch(openDialog({
          children: <ViewEditSubmissionDialog id={id}  rowData={rowData} />,
            maxWidth: 'lg'
        }))
      }

    const [columns, setColumns] = useState([]);

    useEffect(() => {
        setColumns([]);
        if (data?.result?.length > 0) {
            const toOriginalFormat = (str) =>
                str
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (firstChar) => firstChar.toUpperCase()); 
            const formValueKeys = Object.keys(data.result[0].formValue || {});
            const dynamicColumns = [
                {
                    accessorKey: 'id',
                    header: 'ID',
                },
                ...formValueKeys.map((key) => ({
                    accessorKey: `formValue.${key}`, 
                    header: toOriginalFormat(key), 
                    Cell: ({ cell }) => {
                        const value = cell.getValue();
                        if (Array.isArray(value)) {
                            return value.join(', ');
                        }
                        return value || '-'; 
                    },
                })),
            ];
    
            setColumns(dynamicColumns);
        }
    }, [data, id]);

    useEffect(() => {
        refetch();
    }, [id, refetch]);


    return (
        <Root
            header={
                <div className="w-full py-8 flex justify-between items-center">
                    <BackButton route="/user-forms"/>
                </div>
            }
            content={
                <div className="w-full">
                    <Grid container rowGap={3} columnSpacing={2}>
                        <Grid item xs={12}>
                            <TableComponent
                                slug="submission"
                                querykey="get-form-Submissions"
                                getAPIEndPiont="getFormSubmissions"
                                DeleteAPIEndPiont="deleteFormSubmission"
                                apiEndpointId={id}
                                columns={columns}
                                rows={data?.result || []}
                                actions={
                                    [
                                        {
                                            label: "View and Edit",
                                            icon: 'material-outline:remove_red_eye',
                                            onClick: (row) =>
                                                get(row, 'original') &&
                                                handleEditView(get(row, 'original')),
                                        },
                                        // {
                                        //     label: "Edit",
                                        //     icon: 'material-solid:edit',
                                        //     onClick: (row) =>
                                        //         get(row, 'original') &&
                                        //         handleEditView(get(row, 'original')),
                                        // },
                                    ]}
                                manualRow={true}
                                deleteAction={true}
                                isDataLoading={isLoading}
                                setSearchQuery={setSearchQuery}
                                // enableExportTable={true}
                                // exporterTableProps={
                                // {
                                //     fileName: "form-submission-list",
                                //     pdfTitle: "Form Submissions List"
                                // }
                                // }
                            />
                        </Grid>
                    </Grid>
                </div>
            }
            scroll="content"
        />
    );


}