'use client'
import useUser from '@auth/useUser';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const MainPage = () => {
	// should be dynamic
	const { data: user } = useUser();
	useEffect(() => {
		user?.role === 'manager' ? redirect(`/analytics`) : redirect(`/dashboard`);
	}, [user])

	return null;
}

export default MainPage;
