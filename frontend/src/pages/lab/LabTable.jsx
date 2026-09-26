export default function LabTable({columns,rows,empty="No records found"}){
  return <div className="lab-table-wrap"><table className="lab-table"><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}</tr></thead>
  <tbody>{rows.length?rows.map((r,i)=><tr key={r.id??i}>{columns.map(c=><td key={c.key}>{c.render?c.render(r[c.key],r,i):r[c.key]}</td>)}</tr>):<tr><td colSpan={columns.length} className="lab-muted">{empty}</td></tr>}</tbody></table></div>
}
export function Action({children,onClick}){return <button className="lab-action" onClick={onClick}>{children}</button>}
