'use client';

import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react'
import { InputContainer } from '../styles/formStyles';


export default function FormButton({provided, item }) {
    const [isEdit, setIsEdit] = useState(false);
  return (
    <Box ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          {isEdit ?
              "Heading" :<InputContainer>
              <Button color={item.style} variant="contained">{item.label}</Button>
              </InputContainer>
          }
    </Box>
  )
}
