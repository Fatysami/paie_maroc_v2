
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeSidebar from "./EmployeSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import NotificationsMenu from "@/components/notifications/NotificationsMenu";
import AssistantButton from "@/components/chatbot/AssistantButton";

interface EmployeLayoutProps {
  children: React.ReactNode;
  title?: string; // Title is optional
}

const EmployeLayout: React.FC<EmployeLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Perform logout operations
    navigate("/connexion");
  };

  const handleSidebarNavigate = () => {
    // For mobile views, close sidebar after navigation
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar 
        user={{ name: "Mohamed El Alaoui", avatar: "/placeholder.svg", role: "Employé" }} 
        onLogout={handleLogout}
        onSidebarToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        rightContent={<NotificationsMenu />}
      />
      
      {isSidebarOpen && <EmployeSidebar onNavigate={handleSidebarNavigate} />}
      
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        <div className="container mx-auto px-4 py-8">
          {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </div>
      </main>
      
      {/* Add AI Assistant for employees */}
      <AssistantButton isEmployee={true} />
    </div>
  );
};

export default EmployeLayout;
