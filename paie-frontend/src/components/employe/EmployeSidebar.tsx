
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpDown,
  Calendar,
  FileText,
  Home,
  Settings,
  User,
  FileCheck,
  BarChart3,
  PieChart
} from "lucide-react";

interface EmployeSidebarProps {
  onNavigate?: () => void;
}

const EmployeSidebar: React.FC<EmployeSidebarProps> = ({ onNavigate }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const menuItems = [
    { path: "/espace-employe/tableau-de-bord", label: "Tableau de bord", icon: <Home /> },
    { path: "/espace-employe/profil", label: "Mon profil", icon: <User /> },
    { path: "/espace-employe/bulletins", label: "Bulletins de paie", icon: <FileText /> },
    { path: "/espace-employe/conges", label: "Mes congés", icon: <Calendar /> },
    { path: "/espace-employe/attestations", label: "Attestations RH", icon: <FileCheck /> },
    { path: "/espace-employe/analytique", label: "Reporting & Analytique", icon: <BarChart3 /> },
  ];

  return (
    <aside className="fixed top-16 left-0 w-64 h-full bg-white border-r border-gray-200 z-30 shadow-sm overflow-y-auto transition-all">
      <div className="py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                }`}
                onClick={onNavigate}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default EmployeSidebar;
