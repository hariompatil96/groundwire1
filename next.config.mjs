/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	eslint: {
		// Only enable ESLint in development
		ignoreDuringBuilds: process.env.NODE_ENV === 'production'
	},
	typescript: {
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		ignoreBuildErrors: true
	},
	webpack: (config, { isServer }) => {
		// If you're using server-side libraries like googleapis, make sure these are only run on the server side
		if (isServer) {
			// No need to modify fs/net handling here as polyfilling is not allowed
			// Just make sure these server-side modules are not included in the bundle
			config.resolve.fallback = {
			  fs: false,  // Avoid bundling fs
			  net: false, // Avoid bundling net
			};
		  }
	
		if (config.module && config.module.rules) {
			config.module.rules.push({
				test: /\.(json|js|ts|tsx|jsx)$/,
				resourceQuery: /raw/,
				use: 'raw-loader'
			});
		}

		return config;
	},
	env: {
		// API BASE URL
		NEXT_API_BASE_URL: process.env.NEXT_API_BASE_URL,
		NEXT_API_BASE_URL2: process.env.NEXT_API_BASE_URL2,
		FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN,
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		MAP_KEY: process.env.MAP_KEY,
		GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
	}
};


export default nextConfig;
