'use client';

import { Box, FormLabel, IconButton, Typography } from '@mui/material';
import React, { useRef, useState } from 'react'
import { EditInputElement, InputContainer, StyledInput } from '../styles/formStyles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

export default function InputComponent({ provided, item }) {
  const [isEdit, setIsEdit] = useState(false);
  const deleteButtonRef: any = useRef();

  const handleDelete = (e) => {
    if (deleteButtonRef.current && deleteButtonRef.current?.contains(e.target)) {
      e.stopPropagation();
      // handleDeleteElements(index);
    }
  };
  return (
    <Box ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}>
      {isEdit ?
        "Input" : <InputContainer>
          <EditInputElement style={{ pointerEvents: 'none' }} >
            <FuseSvgIcon>material-solid:edit</FuseSvgIcon>
            <IconButton aria-label="delete"
              ref={deleteButtonRef}
              onClick={handleDelete}>
              <FuseSvgIcon>
                material-solid:close
              </FuseSvgIcon>
            </IconButton>

          </EditInputElement>
          <FormLabel>{item.label}</FormLabel>
          {item.type === "file upload" ?
            <StyledInput type="file" accept={'*/*'} />
            : <StyledInput type={item.type} placeholder={item.placeholder} />
          }
        </InputContainer>
      }
    </Box>
  )
}
