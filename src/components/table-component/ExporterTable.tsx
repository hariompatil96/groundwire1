import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { get } from 'lodash';
import { ExportCsv } from '@material-table/exporters';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SERVER_URL } from '@/constants/constant';

const exportPdfWithCustomTitle = (columns, data, fileName, pdfTitle) => {
    const doc = new jsPDF();
    // Add pdf title
    if (pdfTitle) doc.text(pdfTitle, 14, 10);

    autoTable(doc, {
        head: [columns.map(col => col.title)],
        body: data.map(rowData => columns.map(col => rowData[col.field])),
    });
    doc.save(fileName);
};

const exportToExcel = (columns, data, fileName) => {
    const formattedData = data.map(row => {
        const formattedRow = {};
        columns?.forEach(col => {
            formattedRow[col.title] = row[col.field];
        });
        return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [columns?.map(col => col.title)]);
    XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A2', skipHeader: true });

    // Set column widths
    worksheet['!cols'] = columns?.map(col => ({ wpx: col?.width }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const ExporterTable = ({ table, fileName = "data", pdfTitle = null, isForm }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const exportColumns = React.useMemo(() => {
        const baseColumns = (table?.getVisibleFlatColumns() ?? [])
            .filter((col) => !col?.id.includes("mrt-row") && !(isForm && col?.columnDef?.accessorKey === "id"))
            .map((col) => ({
                title: get(col, "columnDef.header", ""),
                field: get(col, "columnDef.accessorKey", "").replace(".", "_"),
                width: 150,
            }));
    
        if (isForm) {
            baseColumns.push({ title: "Form URL", field: "formUrl", width: 250 });
        }
    
        return baseColumns;
    }, [table?.getVisibleFlatColumns()]);

    var data = table.options.data ?? [];

    const nestedAccessorKeyColumns = (table?.getVisibleFlatColumns() ?? []).filter(col => (get(col, "columnDef.accessorKey", "")?.includes("."))).map(col => get(col, "columnDef.accessorKey", ""));

    if (nestedAccessorKeyColumns?.length) {
        data = data.map(item => {
            return {
                ...item,
                ...(nestedAccessorKeyColumns.reduce((pre, cur) => {
                    return {
                        ...pre,
                        [cur?.replace(".", "_")]: get(item, cur),
                    }
                }, {}) ?? {}),
            }
        })
    }

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const downloadData = (value) => {
        setAnchorEl(null);

        let exportData = [...data];
        if (isForm) {
            exportData = exportData.map((row) => ({
                ...row,
                formUrl: `${SERVER_URL}/form/${row.id}`,
            }));
        }

        switch (value) {
            case "csv":
                ExportCsv(exportColumns, exportData, fileName);
                break;

            case "pdf":
                exportPdfWithCustomTitle(exportColumns, exportData, fileName, pdfTitle);
                break;

            case "excel":
                exportToExcel(exportColumns, exportData, fileName);
                break;

            default: return;
        }
    };

    return (
        <div>
            <IconButton
                id="export-button"
                aria-controls={open ? 'export-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{color:"grey"}}
            >
                <FuseSvgIcon size={18}>material-solid:download</FuseSvgIcon>
            </IconButton>
            <Menu
                id="export-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'export-button',
                }}
            >
                <MenuItem onClick={() => downloadData("csv")}>Export CSV</MenuItem>
                <MenuItem onClick={() => downloadData("pdf")}>Export PDF</MenuItem>
                <MenuItem onClick={() => downloadData("excel")}>Export Excel</MenuItem>
            </Menu>
        </div>
    )
}

export default ExporterTable