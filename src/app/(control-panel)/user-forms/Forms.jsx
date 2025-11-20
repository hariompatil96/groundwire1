'use client';

import { Button, Typography } from "@mui/material";
import Root from "./../../../components/Root";
import { Add } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import AddForm from "./shared-components/AddForm";
import FormsList from "./shared-components/FormsList";

function Forms(props) {
    const dispatch = useDispatch()

    const handleClickAddForm = () => {
        dispatch(openDialog({
            children: <AddForm />,
            maxWidth: 'lg'
        }))
    }

    return (
        <Root
            header={
                <div className="w-full py-8 flex justify-between items-center">
                    <Typography
                        sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            fontSize: '1.8rem'
                        }}
                        className="p-color"
                    >
                        Saved Forms
                    </Typography>

                    <Button className="p-bg-color" variant='contained' startIcon={<Add />} onClick={() => handleClickAddForm()}>
                        Add Forms
                    </Button>
                </div>
            }
            content={
                <div className="w-full">
                    <FormsList />
                </div>
            }
            scroll="content"
        />
    );
}

export default Forms;
