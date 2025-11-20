import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboard-component',
		title: 'Dashboard',
		type: 'item',
		icon: 'heroicons-outline:view-grid',
		url: "/dashboard",
		auth: ['admin']
	},
	{
		id: 'analytics-component',
		title: 'Analytics',
		type: 'item',
		icon: 'heroicons-outline:view-grid',
		url: "/analytics",
	},
	{
		id: 'looker-studio-component',
		title: 'Looker Studio',
		type: 'item',
		icon: 'heroicons-outline:view-grid',
		url: "/looker-studio",
		auth: ['admin']
	},
	{
		id: 'forms-component',
		title: 'Forms',
		type: 'item',
		icon: 'heroicons-outline:view-grid',
		url: "/user-forms",
	},
];

export default navigationConfig;
