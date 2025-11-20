'use client';

import * as React from 'react';
import { useMemo } from 'react';
import rtlPlugin from 'stylis-plugin-rtl';
import FuseTheme from '@fuse/core/FuseTheme';
import { useMainTheme } from '@fuse/core/FuseSettings/hooks/fuseThemeHooks';
import createCache, { Options } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeOptions } from '@mui/material/styles';

type MainThemeProviderProps = {
	children: React.ReactNode;
};

const emotionCacheOptions: Record<string, Options> = {
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin],
		prepend: true
	},
	ltr: {
		key: 'muiltr',
		stylisPlugins: [],
		prepend: true
	}
};

function MainThemeProvider({ children }: MainThemeProviderProps) {
	const mainTheme = useMainTheme();
	const langDirection = mainTheme?.direction;
	const customTheme = useMemo(() => {
		return createTheme({
			...mainTheme, 
			typography: {
				fontFamily: "'Fustat', Arial, sans-serif",
				h1: {
					fontWeight: 700
				},
				h2: {
					fontWeight: 600
				},
				body1: {
					fontWeight: 400
				},
			},
		} as ThemeOptions); 
	}, [mainTheme]);

	const cacheProviderValue = useMemo(() => createCache(emotionCacheOptions[langDirection]), [langDirection]);

	return (
		<CacheProvider value={cacheProviderValue}>
			<FuseTheme
				theme={customTheme}
				root
			>
				{children}
			</FuseTheme>
		</CacheProvider>
	);
}

export default MainThemeProvider;
