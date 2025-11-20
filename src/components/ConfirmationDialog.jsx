import { Box, Button, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { closeDialog, selectFuseDialogOptions } from '@fuse/core/FuseDialog/fuseDialogSlice';

export function DialogCloseButton({ handleClose }) {
    return (
        <IconButton
            data-cy='closeDialog'
            onClick={() => handleClose()}
            style={{
                position: 'absolute',
                right: 8,
                top: 8,
                zIndex: 999,
                background: 'none',
            }}
            size='large'
        >
            <CloseIcon />
        </IconButton>
    )
}

const ConfirmationDialog = ({ slug = "item", message, dialogTitle, callBack }) => {
    const options = useSelector(selectFuseDialogOptions);
    const dispatch = useDispatch();

    return (
        <>
            <DialogCloseButton handleClose={() => dispatch(closeDialog())} />
            <DialogTitle sx={{ color: "#202020", fontWeight: 600 }} className='pb-8'>
            {dialogTitle ?? 'Confirmation Required'}
            </DialogTitle>
            <DialogContent className="max-w-[400px] overflow-auto" dividers={scroll === 'paper'}>
                <Typography className="pt-12 pb-0" sx={{ color: '#666' }}>
                    {message
                        ? message
                        : `This action is irreversible. Are you sure you want to permanently delete this ${slug}?`}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        color="inherit"
                        onClick={() => dispatch(closeDialog())}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#e34f2f0f',
                                color: 'common.orange'
                            },
                            backgroundColor: '#f4f4f4',
                            color: '#202020',
                            mr: 1
                        }}
                    >
                        No
                    </Button>

                    <Button
                        variant={'contained'}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#e34f2f0f',
                                color: 'common.orange'
                            },
                            backgroundColor: '#f4f4f4',
                            color: '#202020'
                        }}
                        onClick={() => callBack && callBack(options?.data)}
                    >Yes</Button>
                </Box>
            </DialogActions>
        </>
    )
}

export default ConfirmationDialog