import React from 'react';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Button, Link, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const BackButton = (props) => {
    const router = useRouter();

    const handleGoBack = () => {
        if (router.asPath === '/' || router.asPath === '/analytics') {
            router.push('/analytics');
        } else {
            if (props?.route) {
                router.push(props.route);
            } else {
                router.back();
            }
        }
    };

    return (
        <Link
            data-cy="goBack"
            variant="body1"
            {...props}
            component="button"
            onClick={handleGoBack}
        >
            <Button
                variant="outlined"
                sx={{ fontWeight: 'bold', padding: '5px 8px' }}
                container
                alignItems="center"
                className="p-color"
            >
                <ArrowBackIcon sx={{ mr: 1 }} />
                <Typography>Back</Typography>
            </Button>
        </Link>
    );
};

export default BackButton;