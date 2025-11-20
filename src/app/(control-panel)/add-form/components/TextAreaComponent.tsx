'use client';

import { Box, FormLabel, Typography } from '@mui/material';
import React, { useState } from 'react'
import { InputContainer, StyledTextarea } from '../styles/formStyles';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function TextAreaComponent({provided, item }) {
    const [isEdit, setIsEdit] = useState(false);
  return (
    <Box ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          {isEdit ?
              "Heading" :
              <InputContainer>
                  <FormLabel>{item.label}</FormLabel>
                  <StyledTextarea placeholder={item.placeholder} value={item.value} />
              </InputContainer>}
    </Box>
  )
}
