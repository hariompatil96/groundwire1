'use client';

import { Box, Typography } from '@mui/material';
import React, { useState } from 'react'
import { InputContainer } from '../styles/formStyles';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Heading({provided, item }) {
    const [isEdit, setIsEdit] = useState(false);
  return (
    <Box ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          {isEdit ?
        "Heading" :
        <InputContainer>
        <Typography className={`${item.variant}`}>
          {/* <FontAwesomeIcon icon={faH} /> */}
          {item.label}
          </Typography>
        </InputContainer>
        }
    </Box>
  )
}
