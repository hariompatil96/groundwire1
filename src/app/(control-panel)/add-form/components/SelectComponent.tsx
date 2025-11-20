'use client';

import { Box, FormLabel } from '@mui/material';
import React, { useState } from 'react'
import { InputContainer, StyledSelect } from '../styles/formStyles';

export default function SelectComponent({ provided, item }) {
    const [isEdit, setIsEdit] = useState(false);
    const [selectedValue, setSelectedValue] = useState(item?.values?.find(v => v.selected)?.value || "");
    return (
        <Box ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}>
            {isEdit ?
                "Heading" :
                <InputContainer>
                    <FormLabel>{item.label}</FormLabel>
                    <StyledSelect 
                        value={selectedValue} 
                        required={item.required}
                    >
                    {
                        item?.values?.map((data) => <option value={data?.value}>{data?.label}</option>)
                    }
                    </StyledSelect>
                </InputContainer>
            }
        </Box>
    )
}
