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
// import { showMessage } from 'app/store/fuse/messageSlice';
import { queryClient } from "src/app/App";
import { get } from "lodash";
import { keepPreviousData } from "@tanstack/react-query";
import ExporterTable from "./ExporterTable";
import { motion } from "framer-motion";
import { closeDialog, openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

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
    actionsType = "menu", // 'icons' | 'menu'
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

  // Handle API calls
  const { data, isLoading, isError, error } = useFetch(
    getAPIEndPiont ? querykey : "",
    apiEndpointId
      ? `${API_ROUTES[getAPIEndPiont]}/${apiEndpointId}`
      : API_ROUTES[getAPIEndPiont],
    {
      ...params,
      ...(globalFilter && { search: globalFilter }),
    },
    {
      enabled: Boolean(getAPIEndPiont),
      placeholderData: keepPreviousData,
    }
  );

  const { mutate: deleteMutation } = useDelete(API_ROUTES[DeleteAPIEndPiont], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          querykey,
          {
            ...(globalFilter && { search: globalFilter }),
          },
        ],
      });
      dispatch(closeDialog());
      dispatch(
        showMessage({
          messagetitle: `Delete ${slug}`,
          message: ` ${slug} has been successfully deleted.`,
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "success",
        })
      );
    },
    onError: (error) => {
      dispatch(
        showMessage({
          message: error ?? "Something went wrong",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
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
    sortingFns: {
      caseInsensitive: caseInsensitiveSortingFn,
    },

    initialState: {
      ...initialState,
      showGlobalFilter: true,
      density: "spacious", //'comfortable' | 'compact' | 'spacious'
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Actions", //change header text
        size: 50, //make actions column wider
        maxSize: 50,
      },
    },

    // handle table current State
    state: {
      ...(!rows && {
        globalFilter: globalFilter,
      }),
      rowSelection,
      isLoading: isLoading || isDataLoading,
    },

    // handle table icons
    icons: tableIcons,

    // handle column filter, move and grouping
    enableColumnFilterModes: false,

    // handle column filter by column or grouping
    enableGrouping: false,

    // handle column move or ordering
    enableColumnOrdering: false,

    // handle column actions dot icon
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFilters: false,
    enableHiding: false,

    // handle column resizing
    enableColumnResizing: true,
    layoutMode: "grid", // for getting rid of an extra space
    columnResizeMode: "onChange", //default, onChange, onEnd
    defaultColumn: {
      maxSize: 400,
      minSize: 100,
      size: 180,
      grow: true,
      sortingFn: "caseInsensitive",
    },
    // handle serial number
    // enableRowNumbers: true,
    // displayColumnDefOptions: {
    //   'mrt-row-numbers': {
    //     muiTableHeadCellProps: {
    //       children: 'S. No.', // Change the column header
    //     },
    //     size: 50,
    //     minSize: 80
    //   },
    // },

    // handle row selection
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: (newRowSelection) => {
      setRowSelection(newRowSelection);
    },
    getRowId: (row) => row?._id,
    positionToolbarAlertBanner: "none",

    // handle row actions like edit/delete
    enableRowActions: (actions?.length || deleteAction) ?? false,
    [actionsType === "icons" ? "renderRowActions" : "renderRowActionMenuItems"]:
      ({ row, closeMenu }) => {
        const tableActions = deleteAction
          ? [
              ...actions,
              {
                label: deleteAction?.label ? deleteAction?.label : "Delete",
                onClick: deleteAction?.onClick
                  ? deleteAction?.onClick
                  : handleClickDelete,
                isDisabled: deleteAction?.isDisabled
                  ? deleteAction?.isDisabled
                  : false,
                icon: "material-solid:delete",
                color: "#f00",
              },
            ]
          : actions;

        return tableActions.map((action, i) =>
          actionsType === "icons" ? (
            <Tooltip
              title={action?.label}
              key={`material-react-table-action-${action?.label}-${i}`}
            >
              <IconButton
                onClick={() => {
                  setTimeout(action?.onClick(row));
                }}
                disabled={action?.isDisabled ? action?.isDisabled(row) : false}
              >
                <FuseSvgIcon
                  sx={{ color: action?.color ? action?.color : "initial" }}
                  size={22}
                >
                  {action?.icon}
                </FuseSvgIcon>
              </IconButton>
            </Tooltip>
          ) : (
            <MenuItem
              key={`material-react-table-action-${action?.label}-${i}`}
              onClick={() => {
                closeMenu();
                setTimeout(action?.onClick(row));
              }}
              disabled={action?.isDisabled ? action?.isDisabled(row) : false}
            >
              <FuseSvgIcon
                className="mr-8"
                sx={{ color: action?.color ? action?.color : "initial" }}
                size={18}
              >
                {action?.icon}
              </FuseSvgIcon>
              {action?.label}
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

    // handle full screen table toggle button
    enableFullScreenToggle: false,

    // handle row searching
    enableGlobalFilterModes: true,
    positionGlobalFilter: "left",

    ...((!rows || manualRow) && {
      manualGlobalFilter: true,
      onGlobalFilterChange: (search) => {
        setGlobalFilter(search);
        setSearchQuery && setSearchQuery(search);
      },
    }),

    // handle table paginations
    muiPaginationProps: {
      showRowsPerPage: true,
      shape: "rounded",
    },
    paginationDisplayMode: "pages",
    manualPagination: false,
    rowCount: rows?.length ?? get(data, "result", [])?.length,

    // Update the table UI
    // muiSearchTextFieldProps: {
    //   placeholder: `Search`,
    //   sx: { minWidth: '400px', minHeight:"5rem"},
    //   variant: 'outlined',
    // },

   muiSearchTextFieldProps: {
  placeholder: `Search`,
  sx: { 
    minWidth: '400px', 
    minHeight: "5rem",
     "& .MuiOutlinedInput-root": {
                        borderRadius: 20,
                        
                      },
  },
  variant: 'outlined',
},

    muiTableBodyProps: {
      className: "row-hover-shadow",
      sx: {
        "& tr > td": {
          borderBottom: "0.1rem solid #e4e4e4",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          fontSize: "18px",
        },
      },
    },

    muiTableHeadProps: {
      sx: {
        "& tr > th": {
          borderTop: "0.1rem solid #e4e4e4",
          borderBottom: "0.1rem solid #e4e4e4",
          backgroundColor: "#FF0000",
          paddingBottom: "10px",
          fontSize: "20px",
        },
        "& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Labels":
          {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
          },
        "& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Actions > button":
          {
            width: "auto",
            height: "auto",
            background: "none",
            fontSize: "20px",
          },
        "& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-ResizeHandle-Wrapper":
          {
            position: "static",
            padding: 0,
            margin: 0,
          },
      },
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
      <Card className="w-full material-react-table bg-white rounded pt-8 px-8">
        <MaterialReactTable table={table} />
      </Card>
    </motion.div>
  );
};

export default TableComponent;
