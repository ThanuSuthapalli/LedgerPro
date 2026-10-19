import Link from 'next/link'
import { Users, Shield, Lock, TrendingUp, BarChart3, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const roles = [
    {
      name: 'Employee',
      description: 'Submit and track expense claims',
      href: '/employee/login',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Manager',
      description: 'Review and approve team requests',
      href: '/manager/login',
      icon: Shield,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      name: 'Administrator',
      description: 'Full system access and reporting',
      href: '/admin/login',
      icon: Lock,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Logo & Branding */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-lg">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
              LedgerPro
            </h1>
            <p className="text-xl text-blue-100 mb-2">Claims Cockpit</p>
            <p className="text-lg text-slate-400">Professional Expense Management System</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left - Features */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                Streamline Your Expense Management
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: 'Fast & Secure Submission' },
                  { icon: TrendingUp, text: 'Real-time Tracking & Analytics' },
                  { icon: BarChart3, text: 'Comprehensive Reporting' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-lg text-slate-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Role Selection Cards */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">Select Your Role</h3>
              
              {roles.map((role) => {
                const IconComponent = role.icon
                return (
                  <Link key={role.name} href={role.href}>
                    <div className={`group cursor-pointer relative overflow-hidden rounded-xl bg-gradient-to-br ${role.color} p-0.5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20`}>
                      <div className="relative bg-slate-900 rounded-[10px] p-6 transition-all duration-300 group-hover:bg-slate-800">
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-14 h-14 rounded-lg ${role.bgColor} flex items-center justify-center`}>
                            <IconComponent className={`w-7 h-7 ${role.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                              {role.name}
                            </h4>
                            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                              {role.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-slate-700 pt-8">
            <p className="text-slate-400">
              Need an account?{' '}
              <span className="text-blue-400">Contact your administrator</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
