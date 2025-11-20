'use client';

import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { Box, Button, Grid, Typography } from '@mui/material';
import Heading from './Heading';
import InputComponent from './InputComponent';
import FormButton from './FormButton';
import CheckboxGroup from './CheckboxGroup';
import TextAreaComponent from './TextAreaComponent';
import ParagraphComponent from './ParagraphComponent';
import SelectComponent from './SelectComponent';
import { DropText } from '../styles/formStyles';

function DropBox({ formElements }) {
    return (
        <>
            {formElements?.length === 0 && (
                <Typography sx={DropText}>
                    Drop Here
                </Typography>
            )}
            {formElements?.map((item, index) => {
                switch (item.type) {
                    case 'heading':
                        return (
                            <Draggable key={index} draggableId={`form-item-${index}`} index={index}>
                                {(provided) => <Heading provided={provided} item={item} />}
                            </Draggable>
                        );

                    case 'number':
                    case 'text':
                    case 'file upload':
                        return (
                            <Draggable key={index} draggableId={`form-item-${index}`} index={index}>
                                {(provided) => <InputComponent provided={provided} item={item} />}
                            </Draggable>
                        );

                    case 'button':
                    case 'reset':
                    case 'Submit':
                        return (
                            <Draggable key={index} draggableId={`form-item-${index}`} index={index}>
                                {(provided) => <FormButton provided={provided} item={item} />}
                            </Draggable>
                        );

                    case 'checkbox group':
                    case 'radio group':
                        return (
                            <Draggable key={index} draggableId={`form-item-${index}`} index={index}>
                                {(provided) => <CheckboxGroup provided={provided} item={item} />}
                            </Draggable>
                        );

                    case 'textarea':
                        return (
                            <Draggable key={index} draggableId={`form-item-${index}`} index={index}>
                                {(provided) => <TextAreaComponent provided={provided} item={item} />}
                            </Draggable>
                        );

                    case 'paragraph':
                        return (
                            <Draggable key={index} draggableId={`form-item-${index}`} index={index}>
                                {(provided) => <ParagraphComponent provided={provided} item={item} />}
                            </Draggable>
                        );
                    
                        case 'select':
                            return (
                                <Draggable key={index} draggableId={`form-item-${index}`} index={index}>
                                    {(provided) => <SelectComponent provided={provided} item={item} />}
                                </Draggable>
                            );

                    default:
                        return null;
                }
            })}
        </>
    )
}

export default DropBox
