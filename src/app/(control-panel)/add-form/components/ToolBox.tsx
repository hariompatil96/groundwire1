'use client';

import { Box, Divider, Grid } from '@mui/material';
import React, { useState } from 'react'
import { ToolBoxItem, ToolBoxStyle } from '../styles/formStyles';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { formTools } from '../data/formData';

export default function ToolBox() {
    const [isEdit, setIsEdit] = useState(false);
    return (
        <Grid item xs={2}>
            <Droppable droppableId="toolbox" isDropDisabled>
                {(provided) => (
                    <Box sx={ToolBoxStyle} ref={provided.innerRef} {...provided.droppableProps}>
                        {formTools.map((item, index) => (
                            <React.Fragment key={index}>
                                <Draggable draggableId={`toolbox-item-${index}`} index={index}>
                                    {(provided) => (
                                        <ToolBoxItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {item.type}
                                        </ToolBoxItem>
                                    )}
                                </Draggable>
                                {index < formTools.length - 1 && <Divider sx={{ width: "100%", borderColor: "gray" }} />}
                            </React.Fragment>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </Grid>
    )
}
