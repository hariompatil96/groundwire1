import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MainProjectSelection from '@/components/MainProjectSelection';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& > .badge': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

/**
 * The logo component.
 */
function Logo() {
	return (
		<Root className="flex flex-1 items-center space-x-12">
			<div className="flex flex-1 items-center space-x-8 px-10">
				<img
					className="logo-icon h-40 w-64"
					src="/assets/images/logo/logo.svg"
					alt="logo"
				/>
			</div>
			{/* <MainProjectSelection /> */}
		</Root>
	);
}

export default Logo;
