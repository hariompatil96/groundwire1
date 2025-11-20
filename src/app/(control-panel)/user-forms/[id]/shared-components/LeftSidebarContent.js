import { Avatar, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react'
import { Draggable } from 'react-drag-and-drop';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';


const LeftSidebarContent = () => {
    const StyledListItem = styled(ListItem)(({ theme, active }) => ({
        '&.active': {
            backgroundColor: theme.palette.background.default,
        },
    }));

    const container = {
        show: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    const myElem = [
        {
            id: 'text_entry',
            leble: "Input",
            icon: 'material-solid:text_format',
        },
        // {
        //     id: 'date_time',
        //     leble: "Date Time",
        //     icon: 'material-solid:date_range',
        // },
        // {
        //     id: 'number_entry',
        //     leble: "Number Entry",
        //     icon: 'material-solid:exposure_plus_1',
        // },
        // {
        //     id: 'email_entry',
        //     leble: "Email Entry",
        //     icon: 'material-solid:email'
        // },
        // {
        //     id: 'switch',
        //     leble: "Switch",
        //     icon: 'material-solid:toggle_on',
        // },
        // {
        //     id: 'image_picker',
        //     leble: "Image Picker",
        //     icon: 'material-solid:image'
        // },
        // {
        //     id: 'file_picker',
        //     leble: "File Picker",
        //     icon: 'material-solid:upload_file',
        // },
        // {
        //     id: 'date_picker',
        //     leble: "Date",
        //     icon: 'material-solid:calendar_today',
        // },
        {
            id: 'choise',
            leble: "Multiple Choice",
            icon: 'heroicons-outline:check-circle',
        },
        {
            id: 'drop_down_menu',
            leble: "Drop Down",
            icon: 'material-solid:arrow_drop_down_circle',
        },
        {
            id: 'checkbox',
            leble: "Checkbox",
            icon: 'material-solid:check_box',
        },
        // {
        //     id: 'button',
        //     leble: "Action Button",
        //     icon: 'heroicons-outline:hashtag',
        // }
    ]
    return (
        <div className="p-8">
            {/* <div className="flex flex-1 items-center sm:justify-center px-8 lg:px-12">
                <Typography className="text-20 my-[10px] font-700" variant="h5">
                    TOOl-BOX
                </Typography>
            </div> */}

            <motion.div
                className="flex flex-col shrink-0"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={item}>
                    <Typography className="font-medium text-13 p-color">
                        Form Element
                    </Typography>
                </motion.div>

                {myElem.map((ele, index) => (
                    <motion.div variants={item} key={ele.id}>
                        <div className={clsx(myElem.length !== index + 1 && 'border-b-1')}>
                            <Draggable type='form_ele' data={ele.id}>
                                <StyledListItem
                                    button
                                className="cursor-move px-0"
                                >
                                    <FuseSvgIcon className="text-48" size={40} color="action">{ele.icon}</FuseSvgIcon>
                                    <ListItemText
                                        classes={{
                                            root: 'min-w-px px-16',
                                            primary: 'font-medium text-11',
                                            secondary: 'truncate',
                                        }}
                                        primary={ele.leble}
                                    />
                                </StyledListItem>
                            </Draggable>
                        </div>
                    </motion.div>
                ))}

            </motion.div>
        </div>
    )
}

export default LeftSidebarContent;