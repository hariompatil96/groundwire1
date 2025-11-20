'use client';

import FusePageSimple from "@fuse/core/FusePageSimple";
import styled from "styled-components";
import Analytics from "./Analytics"

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme?.palette?.background?.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme?.palette?.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Page() {
	return (
        <Root
            content={
               <Analytics/>
            }
        />
	);
}

export default Page;