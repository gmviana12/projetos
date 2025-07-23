import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { 
  Home, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  BarChart3, 
  Users, 
  Download,
  LogOut 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Time Tracking', href: '/time-tracking', icon: Clock },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();

  const handleExportToPowerBI = async () => {
    try {
      const response = await fetch(`/api/export/powerbi?userId=${user?.id}`);
      const data = await response.json();
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-slate-200 z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-slate-200">
          <span className="text-2xl font-bold text-brand-600">TaskFlow</span>
        </div>
        
        {/* User Profile */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-brand-100 text-brand-600 font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 truncate">
                {user?.fullName || 'User'}
              </div>
              <div className="text-sm text-slate-500 truncate">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-6 py-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Actions */}
        <div className="px-6 py-4 border-t border-slate-200 space-y-2">
          <Button
            onClick={handleExportToPowerBI}
            variant="outline"
            className="w-full justify-center bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Power BI
          </Button>
          
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full justify-start text-slate-600 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
