'use client';

import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import React, { useState } from 'react'
import { DropContainer, DropText, EditForm, FormDragDropContainer, FormElementContainer, ToolBoxItem } from './styles/formStyles';
import { formTools } from './data/formData';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DropBox from './components/DropBox';
import ToolBox from './components/ToolBox';


function AddForm() {
    const [formElements, setFormElements] = useState<any>([]);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === 'form' && destination.droppableId === 'form') {
            const updatedFormElements = Array.from(formElements);
            const [movedItem] = updatedFormElements.splice(source.index, 1);
            updatedFormElements.splice(destination.index, 0, movedItem);
            setFormElements(updatedFormElements);
        }

        if (source.droppableId === 'toolbox' && destination.droppableId === 'form') {
            const newElement = formTools[source.index];
            const updatedFormElements = Array.from(formElements);
            updatedFormElements.splice(destination.index, 0, newElement); 
            setFormElements(updatedFormElements); 
        }
    };


    return (
        <div>
            <Typography variant="h4" textAlign={"center"} mt={2}>Form Builder</Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container justifyContent={"space-between"} padding={"1rem"}>
                    <Grid item xs={9.5} >
                        <Droppable droppableId="form">
                            {(provided) => (
                                <Box
                                    ref={provided.innerRef}  
                                    {...provided.droppableProps}
                                    sx={formElements?.length === 0 ? DropContainer : EditForm}
                                >
                                    <DropBox formElements={formElements}/>
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </Grid>
                    <ToolBox/>
                </Grid>
            </DragDropContext>
        </div>
    );
};

export default AddForm;
