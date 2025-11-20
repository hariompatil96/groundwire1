import Dialog from '@mui/material/Dialog';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { closeDialog, selectFuseDialogOptions, selectFuseDialogState } from '@fuse/core/FuseDialog/fuseDialogSlice';

/**
 * Groundwire Dialog component
 * This component renders a material UI ```Dialog``` component
 * with properties pulled from the redux store
 */
function FuseDialog() {
	const dispatch = useAppDispatch();
	const state = useAppSelector(selectFuseDialogState);
	const options = useAppSelector(selectFuseDialogOptions);

	return (
		<Dialog
			open={state}
			onClose={() => dispatch(closeDialog())}
			aria-labelledby="fuse-dialog-title"
			maxWidth='sm'
			classes={{
				paper: 'rounded-lg'
			}}
			{...options}
		/>
	);
}

export default FuseDialog;
