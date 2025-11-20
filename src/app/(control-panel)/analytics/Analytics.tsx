'use client';

import { Button, Typography } from "@mui/material";
import Root from "./../../../components/Root";
import { Add } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import AnalyticsList from "./shared-components/AnalyticsList";
import AddAnalytic from "./shared-components/AddAnalytic";


function Analytics(props) {
    const dispatch = useDispatch()

    const handleClickAddAnalytic = () => {
        dispatch(openDialog({
            children: <AddAnalytic />,
            maxWidth: 'lg'
        }))
    }

    return (
        <Root
            header={
                <div className="w-full py-8 flex justify-between flex-wrap gap-4 items-center">
                    <Typography
                        sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            fontSize: '1.8rem'
                        }}
                        className="p-color"
                    >
                        Saved Analytics
                    </Typography>

                    <Button className="p-bg-color" variant='contained' startIcon={<Add />} onClick={() => handleClickAddAnalytic()}>
                        Add Analytic
                    </Button>
                </div>
            }
            content={
                <div className="w-full">
                    <AnalyticsList />
                </div>
            }
            scroll="content"
        />
    );
}

export default Analytics;
