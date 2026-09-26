# LabLIMS frontend update

This build keeps the existing frontend structure and adds:

- Reference-style Sidebar with icons
- Auto-open active sidebar section based on current route
- Active route highlighting
- Expand/collapse Business, Cases, Lab, USG, Digital X-ray and Manage
- Existing New Bill and Getting Started routes retained
- Reusable common `DataTable` component for all table-based screens
- `TableBadge` and `TableAction` helpers

## Common table
Import:
`import DataTable, { TableBadge, TableAction } from "../../components/common/DataTable";`

Columns:
`const columns = [{ key: "regNo", label: "REG. NO." }, ...];`

Render:
`<DataTable columns={columns} rows={rows} rowKey="id" />`

Do not create a separate table implementation on each page. Extend this common component when a new shared table behavior is needed.

## Run on Windows PowerShell
Use:
`npm.cmd install`
`npm.cmd run dev`
