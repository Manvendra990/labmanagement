import './data-table.css';

/**
 * Reusable application table.
 * columns: [{ key, label, width, align, className, render(value,row,index) }]
 * rows: array of objects
 */
export default function DataTable({
  columns = [], rows = [], rowKey = 'id', loading = false, emptyText = 'No records found',
  compact = false, className = '', onRowClick
}) {
  return (
    <div className={`data-table-wrap ${className}`}>
      <table className={`data-table ${compact ? 'compact' : ''}`}>
        <thead><tr>{columns.map(col => <th key={col.key} style={{width:col.width,textAlign:col.align}} className={col.className || ''}>{col.label}</th>)}</tr></thead>
        <tbody>
          {loading ? <tr><td className="table-state" colSpan={columns.length}>Loading...</td></tr> :
          rows.length === 0 ? <tr><td className="table-state" colSpan={columns.length}>{emptyText}</td></tr> :
          rows.map((row,index) => <tr key={typeof rowKey === 'function' ? rowKey(row,index) : (row[rowKey] ?? index)} onClick={() => onRowClick?.(row,index)} className={onRowClick ? 'clickable' : ''}>
            {columns.map(col => {
              const value = row[col.key];
              return <td key={col.key} style={{textAlign:col.align}} className={col.className || ''}>{col.render ? col.render(value,row,index) : (value ?? '—')}</td>;
            })}
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}

export function TableBadge({children,tone='neutral'}){return <span className={`table-badge ${tone}`}>{children}</span>}
export function TableAction({children,onClick}){return <button type="button" className="table-action" onClick={e=>{e.stopPropagation();onClick?.(e)}}>{children}</button>}
