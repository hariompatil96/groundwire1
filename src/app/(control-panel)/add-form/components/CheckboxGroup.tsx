'use client';

import { Box, Checkbox, FormControlLabel, FormGroup, FormLabel, Radio, Typography } from '@mui/material';
import React, { useState } from 'react'
import { InputContainer } from '../styles/formStyles';

export default function CheckboxGroup({provided, item }) {
    const [isEdit, setIsEdit] = useState(false);
  return (
    <Box ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          {isEdit ?
        "Heading" :
              <InputContainer>
                  <FormLabel>{item.label}</FormLabel>
                  <FormGroup>
                      {
                          item?.values?.map((data, index) => <FormControlLabel key={index} control={item?.type?.includes("radio") ? <Radio/> : <Checkbox />} label={data.label} checked={data.selected} />)
                      }
                  </FormGroup>
        </InputContainer>
          }
    </Box>
  )
}
