import { useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Card, IconButton, MenuItem, Tooltip } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { FilterAltOffOutlined } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useDelete, useFetch } from "../../utils/hooks/useApi";
import ConfirmationDialog from "../ConfirmationDialog";
import { API_ROUTES } from "../../constants/api";
import { queryClient } from "src/app/App";
import { get } from "lodash";
import { keepPreviousData } from "@tanstack/react-query";
import ExporterTable from "./ExporterTable";
import { motion } from "framer-motion";
import { closeDialog, openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useTheme } from "@mui/material/styles"; 

const tableIcons = {
  FilterListIcon: () => (
    <FuseSvgIcon size={18}>heroicons-outline:filter</FuseSvgIcon>
  ),
  FilterListOffIcon: () => <FilterAltOffOutlined sx={{ fontSize: "18px" }} />,
  ViewColumnIcon: () => (
    <FuseSvgIcon size={18}>heroicons-outline:view-boards</FuseSvgIcon>
  ),
  DensityLargeIcon: () => (
    <FuseSvgIcon size={18}>heroicons-outline:menu-alt-4</FuseSvgIcon>
  ),
  DensityMediumIcon: () => (
    <FuseSvgIcon size={18}>heroicons-outline:menu</FuseSvgIcon>
  ),
  DensitySmallIcon: () => (
    <FuseSvgIcon size={18}>heroicons-outline:view-list</FuseSvgIcon>
  ),
  SearchIcon: () => (
    <FuseSvgIcon size={18}>heroicons-outline:magnifying-glass</FuseSvgIcon>
  ),
  ClearAllIcon: () => <FuseSvgIcon size={18}>heroicons-outline:x</FuseSvgIcon>,
  DragHandleIcon: () => (
    <FuseSvgIcon size={18}>heroicons-outline:arrows-expand</FuseSvgIcon>
  ),
  MoreVertIcon: () => (
    <FuseSvgIcon size={18}>heroicons-outline:dots-vertical</FuseSvgIcon>
  ),
};

const caseInsensitiveSortingFn = (rowA, rowB, columnId) => {
  const a = rowA?.getValue(columnId)?.toString().toLowerCase() ?? "";
  const b = rowB?.getValue(columnId)?.toString().toLowerCase() ?? "";
  return a?.localeCompare(b);
};

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const TableComponent = (props) => {
  
  const {
    columns = [],
    rows,
    actions = [],
    actionsType = "menu",
    slug = "item",
    querykey = "get-items",
    apiEndpointId = null,
    getAPIEndPiont,
    DeleteAPIEndPiont,
    deleteAction = false,
    params = {},
    isDataLoading = false,
    enableRowSelection = false,
    enableExportTable = false,
    handleRowSelection,
    exporterTableProps = {},
    initialState = {},
    manualRow = false,
    setSearchQuery,
  } = props;

  
  const [rowSelection, setRowSelection] = useState({});
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const theme = useTheme(); 

  
  const isDarkMode = theme.palette.mode === "dark";

  
  const { data, isLoading, isError, error } = useFetch(
    getAPIEndPiont ? querykey : "",
    apiEndpointId
      ? `${API_ROUTES[getAPIEndPiont]}/${apiEndpointId}`
      : API_ROUTES[getAPIEndPiont],
    { ...params, ...(globalFilter && { search: globalFilter }) },
    { enabled: Boolean(getAPIEndPiont), placeholderData: keepPreviousData }
  );

  
  const { mutate: deleteMutation } = useDelete(API_ROUTES[DeleteAPIEndPiont], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [querykey, { ...(globalFilter && { search: globalFilter }) }],
      });
      dispatch(closeDialog());
      dispatch(
        showMessage({
          messagetitle: `Delete ${slug}`,
          message: ` ${slug} has been successfully deleted.`,
          autoHideDuration: 5000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "success",
        })
      );
    },
    onError: (error) => {
      dispatch(
        showMessage({
          message: error ?? "Something went wrong",
          autoHideDuration: 5000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "error",
        })
      );
    },
  });

  
  const handleClickDelete = (data) => {
    dispatch(
      openDialog({
        children: (
          <ConfirmationDialog
            slug={slug}
            callBack={(id) => deleteMutation(id)}
          />
        ),
        data: get(data, "original.id"),
      })
    );
  };

  
  const table = useMaterialReactTable({
    columns,
    data: (rows ?? get(data, "result", [])).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ),
    enableSortingRemoval: false,
    sortingFns: { caseInsensitive: caseInsensitiveSortingFn },
    initialState: {
      ...initialState,
      showGlobalFilter: true,
      density: "spacious",
      columnPinning: { right: ["mrt-row-actions"] },
    },
    displayColumnDefOptions: {
      "mrt-row-actions": { header: "Actions", size: 50, maxSize: 50 },
    },

    state: {
      ...(!rows && { globalFilter: globalFilter }),
      rowSelection,
      isLoading: isLoading || isDataLoading,
    },

    icons: tableIcons,

    enableColumnFilterModes: false,
    enableGrouping: false,
    enableColumnOrdering: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFilters: false,
    enableHiding: false,
    enableColumnResizing: true,
    layoutMode: "grid",
    columnResizeMode: "onChange",
    defaultColumn: {
      maxSize: 400,
      minSize: 100,
      size: 180,
      grow: true,
      sortingFn: "caseInsensitive",
    },

    enableRowSelection: enableRowSelection,
    onRowSelectionChange: (newRowSelection) => setRowSelection(newRowSelection),

    getRowId: (row) => row?._id,
    positionToolbarAlertBanner: "none",
    enableRowActions: (actions?.length || deleteAction) ?? false,

    [actionsType === "icons" ? "renderRowActions" : "renderRowActionMenuItems"]:
      ({ row, closeMenu }) => {
        const tableActions = deleteAction
          ? [
              ...actions,
              {
                label: deleteAction?.label ? deleteAction.label : "Delete",
                onClick: deleteAction?.onClick
                  ? deleteAction.onClick
                  : handleClickDelete,
                isDisabled: deleteAction?.isDisabled
                  ? deleteAction.isDisabled
                  : false,
                icon: "material-solid:delete",
                color: "#f00",
              },
            ]
          : actions;

        return tableActions.map((action, i) =>
          actionsType === "icons" ? (
            <Tooltip
              key={`material-react-table-action-${action.label}-${i}`}
              title={action?.label}
            >
              <IconButton
                onClick={() => {
                  setTimeout(action.onClick(row));
                }}
                disabled={action?.isDisabled ? action.isDisabled(row) : false}
              >
                <FuseSvgIcon
                  sx={{ color: action?.color ? action.color : "initial" }}
                  size={22}
                >
                  {action?.icon}
                </FuseSvgIcon>
              </IconButton>
            </Tooltip>
          ) : (
            <MenuItem
              key={`material-react-table-action-${action.label}-${i}`}
              onClick={() => {
                closeMenu();
                setTimeout(action.onClick(row));
              }}
              disabled={action?.isDisabled ? action.isDisabled(row) : false}
            >
              <FuseSvgIcon
                className="mr-8"
                sx={{ color: action?.color ? action.color : "initial" }}
                size={18}
              >
                {action.icon}
              </FuseSvgIcon>
              {action.label}
            </MenuItem>
          )
        );
      },

    renderTopToolbarCustomActions: (props) =>
      enableExportTable && (
        <Box className="w-full flex justify-end">
          <ExporterTable
            {...{ ...props, ...exporterTableProps, isForm: slug === "forms" }}
          />
        </Box>
      ),

    enableFullScreenToggle: false,
    enableGlobalFilterModes: true,
    positionGlobalFilter: "left",

    ...((!rows || manualRow) && {
      manualGlobalFilter: true,
      onGlobalFilterChange: (search) => {
        setGlobalFilter(search);
        setSearchQuery && setSearchQuery(search);
      },
    }),

    muiPaginationProps: {
      showRowsPerPage: true,
      shape: "rounded",
    },
    paginationDisplayMode: "pages",
    manualPagination: false,
    rowCount: rows?.length ?? get(data, "result", [])?.length,

    muiSearchTextFieldProps: {
      placeholder: `Search`,
      variant: "outlined",
      th: 500,
     
      style: {
        width: 300,
        
      },


     
    },

    muiTableBodyProps: {
      className: "row-hover-shadow",
      sx: {
        "& tr > td": {
          borderBottom: isDarkMode
            ? "0.1rem solid #444"
            : "0.1rem solid #e4e4e4",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkMode ? "#121212" : "#fff",
          fontSize: "18px",
          color: isDarkMode ? "#e0e0e0" : "#000",
        },
        "& tr:hover > td": {
          backgroundColor: isDarkMode ? "#1f1f1f" : "#f5f5f5",
        },
      },
    },

    muiTableHeadProps: {
      sx: {
        "& tr > th": {
          borderTop: isDarkMode ? "0.1rem solid #444" : "0.1rem solid #e4e4e4",
          borderBottom: isDarkMode
            ? "0.1rem solid #444"
            : "0.1rem solid #e4e4e4",
          backgroundColor: isDarkMode ? "#00796b" : "#008080",  
          paddingBottom: "10px",
          fontSize: "20px",
          color: "#fff",
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
        },
       
        "& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Labels":
          {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            color: "#fff",
          },
        "& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Actions > button":
          {
            width: "auto",
            height: "auto",
            background: "none",
            fontSize: "20px",
            color: "#fff",
          },
        "& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-ResizeHandle-Wrapper":
          {
            position: "static",
            padding: 0,
            margin: 0,
          },
      },
    },

    sx: {
      backgroundColor: isDarkMode ? "#181818" : "#fff",
      color: isDarkMode ? "#e0e0e0" : "inherit",
    },
  });

  useEffect(() => {
    if (handleRowSelection) {
      const selectedRowIds = Object.keys(rowSelection);
      const selectedRows = rows
        ? rows.filter((row) => selectedRowIds.includes(row._id))
        : get(data, "result.results", [])
          ? get(data, "result.results", []).filter((row) =>
              selectedRowIds.includes(row._id)
            )
          : [];
      handleRowSelection(selectedRows);
    }
  }, [rowSelection]);

  if (isError && !globalFilter) return <div className="no-table">{error}</div>;

  return (
    <motion.div variants={tableVariants} initial="hidden" animate="visible">
      <Card
        className="w-full material-react-table bg-white rounded pt-8 px-8"
        sx={{
          backgroundColor: isDarkMode ? "#121212" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        <MaterialReactTable table={table} />
      </Card>
    </motion.div>
  );
};

export default TableComponent;
