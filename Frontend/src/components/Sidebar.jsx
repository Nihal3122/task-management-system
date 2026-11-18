import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import toast from "react-hot-toast";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Add New Task", icon: "➕", path: "/add-task" },
  ];
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      // Remove JWT token
      localStorage.removeItem("token");

      // Remove user information
      localStorage.removeItem("user");

      toast.success("Logged out successfully!");

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error);
    }
  };

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-indigo-600">TaskFlow</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your work efficiently
        </p>
      </div>

      {/* Navigation */}
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => navigate(item.path)}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </button>
      ))}

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          className="w-full text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50"
          onClick={handleLogout}
        >
          ↪ Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
