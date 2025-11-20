import React, { useState } from 'react'
import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { DialogCloseButton } from '@/components/ConfirmationDialog'
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice'
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice'
import { useRouter } from 'next/navigation'
import { Box } from '@mui/system'


const EmbedCodeDialog = ({ id, type, data = null }) => {
    const formUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${type}/${id}`
    const dispatch = useDispatch();
    const router = useRouter();
    const defaultHeight = type === "analytic" && data ? data?.data?.height : 600;
    const defaultWidth = type === "analytic" && data ? data?.data?.width : 600;
    const [width, setWidth] = useState(defaultWidth || 600);
    const [height, setHeight] = useState(defaultHeight || 600);

    const handleCopy = () => {
        const embedCode = `<iframe 
        src="${formUrl}" 
        width="${width}" 
        height="${height}" 
        frameborder="0" 
        ${type === "analytic" ? 'allowfullscreen webkitallowfullscreen mozallowfullscreen allow="fullscreen; geolocation" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation allow-top-navigation"' : ""}>
    </iframe>`;
        navigator.clipboard.writeText(embedCode).then(() => {
            dispatch(
                showMessage({
                    message: "Embed code copied to clipboard!",
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: "success",
                })
            );
        });
        dispatch(closeDialog())
    };


    return (
        <>
            <DialogCloseButton handleClose={() => dispatch(closeDialog())} />
            <DialogTitle
                sx={{
                    background: "#fff",
                    color: "#000",
                    minHeight: '55px',
                    borderBottom: '1px solid #ddd'
                }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 500, textTransform: "capitalize" }}>Embed {type}</Typography>
            </DialogTitle>
            <DialogContent className='w-[400px] p-0'>
                <Grid container className='p-24' spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Width (px)"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            type="number"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Height (px)"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            type="number"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box
                            sx={{
                                background: "#f5f5f5",
                                border: "1px solid #ddd",
                                padding: "8px",
                                borderRadius: "4px",
                                fontFamily: "monospace",
                                wordBreak: "break-all",
                                overflow: "auto",
                            }}
                        >
                            {`<iframe 
        src="${formUrl}" 
        width="${width}" 
        height="${height}" 
        frameborder="0" 
        ${type === "analytic" ? 'allowfullscreen webkitallowfullscreen mozallowfullscreen allow="fullscreen; geolocation" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation allow-top-navigation"' : ""}>
    </iframe>`}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid #ddd' }} className='px-24 w-full'>
                <Button
                    variant='outlined'
                    className='p-color'
                    onClick={handleCopy}
                >
                    Copy
                </Button>
            </DialogActions>
        </>
    )
}

export default EmbedCodeDialog;
