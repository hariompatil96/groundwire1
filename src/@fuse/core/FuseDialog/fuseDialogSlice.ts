import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { ReactElement } from 'react';
import rootReducer from '@/store/rootReducer';

type InitialStateProps = {
	open: boolean;
	options: any;
};

/**
 * The initial state of the dialog slice.
 */
const initialState: InitialStateProps = {
	open: false,
	options: {
		children: '',
	},
};

/**
 * The Groundwire Dialog slice
 */
export const fuseDialogSlice = createSlice({
	name: 'fuseDialog',
	initialState,
	reducers: {
		openDialog: (state, action: PayloadAction<{}>) => {
			state.open = true;
			state.options = action.payload;
		},
		closeDialog: () => initialState
	},
	selectors: {
		selectFuseDialogState: (fuseDialog) => fuseDialog.open,
		selectFuseDialogOptions: (fuseDialog) => fuseDialog.options
	}
});

/**
 * Lazy load
 * */
rootReducer.inject(fuseDialogSlice);
const injectedSlice = fuseDialogSlice.injectInto(rootReducer);
declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof fuseDialogSlice> { }
}

export const { closeDialog, openDialog } = fuseDialogSlice.actions;

export const { selectFuseDialogState, selectFuseDialogOptions } = injectedSlice.selectors;

export type dialogSliceType = typeof fuseDialogSlice;

export default fuseDialogSlice.reducer;
