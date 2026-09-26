import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MENU } from '../../constants/menu';
import {
  Plus, CircleCheck, LayoutDashboard, ChartNoAxesColumnIncreasing, BriefcaseBusiness,
  FlaskConical, ScanLine, Scan, Users, ChevronDown, ChevronUp
} from 'lucide-react';
import './sidebar.css';

const icons = {
  Dashboard: LayoutDashboard,
  Business: ChartNoAxesColumnIncreasing,
  Cases: BriefcaseBusiness,
  Lab: FlaskConical,
  USG: ScanLine,
  'Digital X-ray': Scan,
  Manage: Users,
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const routeOpen = useMemo(() => {
    const state = {};
    MENU.forEach(item => {
      if (item.children?.some(([, path]) => pathname.startsWith(path))) state[item.label] = true;
    });
    return state;
  }, [pathname]);
  const [open, setOpen] = useState(routeOpen);

  useEffect(() => setOpen(prev => ({ ...prev, ...routeOpen })), [routeOpen]);

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <NavLink className="new" to="/cases/new-bill"><Plus size={16} /> New bill</NavLink>
      <NavLink className="getting" to="/getting-started"><CircleCheck size={15} /> Getting Started</NavLink>

      <nav className="sidebar-nav">
        {MENU.map(item => {
          const Icon = icons[item.label] || LayoutDashboard;
          if (item.path) {
            return <NavLink key={item.label} className="nav" to={item.path}><span className="nav-left"><Icon size={16}/>{item.label}</span></NavLink>;
          }
          const expanded = !!open[item.label];
          const sectionActive = item.children?.some(([, path]) => pathname.startsWith(path));
          return (
            <div className="nav-group" key={item.label}>
              <button className={`nav ${sectionActive ? 'section-active' : ''}`} onClick={() => setOpen(x => ({...x,[item.label]:!x[item.label]}))} aria-expanded={expanded}>
                <span className="nav-left"><Icon size={16}/>{item.label}</span>
                {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
              </button>
              {expanded && <div className="sub">{item.children.map(([label,path]) => <NavLink key={path} to={path}>{label}</NavLink>)}</div>}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
