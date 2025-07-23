import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  FolderKanban, 
  Clock, 
  CheckSquare2, 
  BarChart3, 
  Users, 
  Gauge,
  CheckCircle,
  ArrowRight 
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      title: 'Kanban Boards',
      description: 'Visual task management with customizable columns, drag-and-drop functionality, and real-time collaboration.',
      icon: FolderKanban,
      bgColor: 'bg-brand-100',
      iconColor: 'text-brand-600',
    },
    {
      title: 'Time Tracking',
      description: 'Accurate time logging for tasks and projects with detailed reporting and productivity insights.',
      icon: Clock,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Subtasks & Dependencies',
      description: 'Break down complex projects into manageable subtasks with clear dependencies and progress tracking.',
      icon: CheckSquare2,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Power BI Export',
      description: 'Seamlessly export your project data to Power BI for advanced analytics and custom reporting.',
      icon: BarChart3,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools with comments, file sharing, and instant notifications.',
      icon: Users,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Custom Dashboards',
      description: 'Personalized dashboards with widgets and metrics that matter most to your workflow.',
      icon: Gauge,
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-brand-600">TaskFlow</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-slate-600 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">Features</a>
                <a href="#pricing" className="text-slate-600 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
                <a href="#contact" className="text-slate-600 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-50 to-indigo-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
                Manage Projects Like a <span className="text-brand-600">Professional</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Streamline your workflow with advanced project management, time tracking, and team collaboration tools. Export data seamlessly to Power BI for deeper insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl transition-all">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No credit card required
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Project Dashboard</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-brand-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-brand-600">12</div>
                      <div className="text-xs text-slate-600">Projects</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-emerald-600">84</div>
                      <div className="text-xs text-slate-600">Tasks</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-600">168</div>
                      <div className="text-xs text-slate-600">Hours</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-brand-100 rounded-full">
                      <div className="h-2 bg-brand-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="h-2 bg-emerald-100 rounded-full">
                      <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your project management workflow and boost team productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`${feature.iconColor} h-8 w-8`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Project Management?
          </h2>
          <p className="text-xl text-brand-100 mb-8">
            Join thousands of teams who trust TaskFlow to deliver projects on time and within budget.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white hover:bg-slate-50 text-brand-600 shadow-lg hover:shadow-xl transition-all">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
