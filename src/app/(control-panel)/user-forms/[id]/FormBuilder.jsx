'use client';

import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, IconButton, Switch, Typography } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useThemeMediaQuery } from '@fuse/hooks';
import { useEffect } from 'react';
import Content from './shared-components/Content';
import LeftSidebarContent from './shared-components/LeftSidebarContent';
import StyledFusePageCarded from '@fuse/core/FusePageCarded';
import BackButton from '@/components/back-button/BackButton';
import { useDispatch } from 'react-redux';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import SettingDialog from './shared-components/SettingDialog';

const Root = styled(StyledFusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {},
  '& .FusePageCarded-wrapper': {},
  '& .FusePageCarded-leftSidebar': {},
  '& .description': {
    fontSize: 20,
    marginBottom: 40,
  },
}));

function FormBuilder(props) {
  const { t } = useTranslation('FormBuilder');
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [preview, setPreview] = useState(true);
  const [emailList, setEmailList] = useState([]); 
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();

  const handleClickFormSetting = () => {
    dispatch(openDialog({
      children: <SettingDialog id={props.params.id} emailList={[...emailList]} setEmailList={setEmailList} formData={formData} />,
        maxWidth: 'lg'
    }))
  }

  const handlePreviewToggle = () => {
    setPreview(!preview);
    setLeftSidebarOpen(!preview)
  };

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [isMobile]);
  return (
    <Root
      header={
        <div className="flex items-center justify-center px-4 md:px-12 h-full w-full">
          <div className="flex items-center justify-center gap-[6px]">
            <BackButton route="/user-forms"/>
          </div>
            
          <div className="flex flex-1 items-center sm:justify-center px-8 lg:px-12">
            <Typography className="text-20 my-5 font-700" variant="h5">
              Form {preview ? "Builder": "Preview"}
            </Typography>
          </div>

          <div className="flex items-center justify-center">
            <IconButton
              onClick={handlePreviewToggle}
              aria-label="Toggle Builder/Preview"
              size="large"
              className={preview ? 'p-color' : ''}
              title="Form Builder"
            >
              <FuseSvgIcon>material-solid:build</FuseSvgIcon>
            </IconButton>
            <IconButton
              onClick={handlePreviewToggle}
              aria-label="Toggle Preview"
              size="large"
              className={preview ? '' : 'p-color'}
              title="Form Preview"
            >
              <FuseSvgIcon>material-solid:visibility</FuseSvgIcon>
            </IconButton>
            <IconButton
            onClick={(ev) => handleClickFormSetting()}
            aria-label="Settings"
              size="large"
              title="Form Settings"
          >
            <FuseSvgIcon>material-solid:settings</FuseSvgIcon>
            </IconButton>
          </div>
        </div>
      }
      content={<Content {...props?.params} preview={preview} leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} setEmailList={setEmailList} setFormData={setFormData} handlePreviewToggle={handlePreviewToggle} />}
      leftSidebarContent={<LeftSidebarContent />}
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarWidth={288}
      leftSidebarOnClose={() => {
        setLeftSidebarOpen(false);
      }}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default FormBuilder;
