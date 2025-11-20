'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function LookerStudio() {

	return (
		<Root
			content={
				<div className="p-24" style={{height: '80vh'}}>
					<iframe width="100%" height="100%" src="https://lookerstudio.google.com/embed/reporting/7c3a1133-a8fa-4161-8d75-f9c4f8f6b565/page/m5FSC" sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
					</iframe>
				</div>
			}
		/>
	);
}

export default LookerStudio;
