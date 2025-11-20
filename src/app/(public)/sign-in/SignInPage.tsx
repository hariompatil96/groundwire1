import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import AuthJsForm from '@auth/forms/AuthJsForm';

/**
 * The sign in page.
 */
function SignInPage() {
	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper
				sx={{
					backgroundImage: 'url("https://static.wixstatic.com/media/836760_cc6b021a501547ec8449060a3c273b69~mv2.jpg/v1/fill/w_982,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/gw%20about%20us%20masthead.jpg")',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				  }}
				className="h-full w-full flex items-center justify-center px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:rounded-xl sm:p-48 sm:shadow  md:h-full md:rounded-none md:p-64 ">
				<CardContent className="mx-auto bg-[#fffdfdbe] rounded-md w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-56"
						src="/assets/images/logo/logo.svg"
						alt="logo"
					/>
					<Typography className="mt-16 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>

					{/* <div className="mt-2 flex items-baseline font-medium">
						<Typography>Don't have an account?</Typography>
						<Link
							className="ml-4"
							to="/sign-up"
						>
							Sign up
						</Link>
					</div> */}

					<AuthJsForm formType="signin" />
				</CardContent>
			</Paper>
{/* 
			<Box
				className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
				sx={{ backgroundColor: 'primary.dark', color: 'primary.contrastText' }}
			>
				<svg
					className="pointer-events-none absolute inset-0"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						className="opacity-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="234"
							cx="196"
							cy="23"
						/>
						<circle
							r="234"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>
				<Box
					component="svg"
					className="absolute -right-64 -top-64 opacity-20"
					sx={{ color: 'primary.light' }}
					viewBox="0 0 220 192"
					width="220px"
					height="192px"
					fill="none"
				>
					<defs>
						<pattern
							id="837c3e70-6c3a-44e6-8854-cc48c737b659"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect
								x="0"
								y="0"
								width="4"
								height="4"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width="220"
						height="192"
						fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
					/>
				</Box>

				<div className="relative z-10 w-full max-w-2xl">
					<div className="text-7xl font-bold leading-none text-gray-100">
						<div>Welcome</div>
						<div>Join The Movement</div>
					</div>
					<div className="mt-24 text-lg leading-6 tracking-tight text-gray-400">
						Groundwire works to introduce youth and young adults to the transformational Gospel of Jesus Christ by leveraging the most appropriate and popular social media platforms in society.
					</div>
					<div className="mt-32 flex items-center">
						<AvatarGroup
							sx={{
								'& .MuiAvatar-root': {
									borderColor: 'primary.main'
								}
							}}
						>
							<Avatar src="/assets/images/avatars/female-18.jpg" />
							<Avatar src="/assets/images/avatars/female-11.jpg" />
							<Avatar src="/assets/images/avatars/male-09.jpg" />
							<Avatar src="/assets/images/avatars/male-16.jpg" />
						</AvatarGroup>

						<div className="ml-16 font-medium tracking-tight text-gray-400">
							More than 17k people joined us, it's your turn
						</div>
					</div>
				</div>
			</Box> */}
		</div>
	);
}

export default SignInPage;
