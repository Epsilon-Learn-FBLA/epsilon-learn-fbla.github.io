import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Home, BookOpen, CheckCircle, Play, Download, Award, 
  TrendingUp, Target, Calendar, Flame, ChevronRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (e) {
      base44.auth.redirectToLogin();
    }
  };

  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      const progress = await base44.entities.UserProgress.filter({ user_email: user.email });
      if (progress.length === 0) {
        const newProgress = await base44.entities.UserProgress.create({
          user_email: user.email,
          xp: 0,
          completed_lessons: [],
          completed_quizzes: [],
          completed_videos: [],
          downloaded_resources: [],
          badges: [],
          streak_days: 0,
        });
        return newProgress;
      }
      return progress[0];
    },
    enabled: !!user,
  });

  const { data: resources = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: () => base44.entities.Resource.list(),
  });

  const recentResources = resources.slice(0, 6);
  
  const completedCount = (userProgress?.completed_lessons?.length || 0) + 
    (userProgress?.completed_quizzes?.length || 0) + 
    (userProgress?.completed_videos?.length || 0);
  
  const totalResources = resources.length || 20;
  const progressPercent = Math.round((completedCount / totalResources) * 100);

  const activityData = [
    { day: 'Mon', completed: 3 },
    { day: 'Tue', completed: 5 },
    { day: 'Wed', completed: 2 },
    { day: 'Thu', completed: 7 },
    { day: 'Fri', completed: 4 },
    { day: 'Sat', completed: 1 },
    { day: 'Sun', completed: 6 },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7c6aef] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#7c6aef] flex items-center justify-center">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Welcome back, {user.full_name || 'Learner'}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-100">
            <Zap className="w-6 h-6 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{userProgress?.xp || 0}</p>
              <p className="text-sm text-slate-500">Total XP</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Progress Card */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#7c6aef]" />
                Recently Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      className="stroke-slate-100"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      className="stroke-[#7c6aef]"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${progressPercent * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{progressPercent}%</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Lessons Completed</span>
                    <span className="font-semibold">{userProgress?.completed_lessons?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Quizzes Passed</span>
                    <span className="font-semibold">{userProgress?.completed_quizzes?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Videos Watched</span>
                    <span className="font-semibold">{userProgress?.completed_videos?.length || 0}</span>
                  </div>
                </div>
              </div>

              <Link to={createPageUrl('Resources')}>
                <Button className="w-full bg-[#7c6aef] hover:bg-[#5b4acf]">
                  Continue Learning
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Last Worked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-white">{userProgress?.streak_days || 0}</span>
                </div>
                <p className="text-slate-600">Day Streak</p>
              </div>

              {/* Weekly Activity */}
              <div className="flex justify-between gap-1">
                {activityData.map((day, i) => (
                  <div key={day.day} className="flex flex-col items-center gap-1">
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                        day.completed > 0 ? 'bg-[#7c6aef] text-white' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {day.completed}
                    </div>
                    <span className="text-xs text-slate-500">{day.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Lessons', value: userProgress?.completed_lessons?.length || 0, icon: BookOpen, color: 'blue' },
            { label: 'Quizzes', value: userProgress?.completed_quizzes?.length || 0, icon: CheckCircle, color: 'green' },
            { label: 'Videos', value: userProgress?.completed_videos?.length || 0, icon: Play, color: 'red' },
            { label: 'Downloads', value: userProgress?.downloaded_resources?.length || 0, icon: Download, color: 'purple' },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Resources */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Continue Where You Left Off</CardTitle>
            <Link to={createPageUrl('Resources')}>
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentResources.map((resource, index) => {
                const icons = { lesson: BookOpen, quiz: CheckCircle, video: Play, download: Download };
                const Icon = icons[resource.type] || BookOpen;
                const colors = {
                  lesson: 'bg-blue-100 text-blue-600',
                  quiz: 'bg-green-100 text-green-600',
                  video: 'bg-red-100 text-red-600',
                  download: 'bg-purple-100 text-purple-600',
                };
                
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-lg ${colors[resource.type]} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{resource.title}</p>
                      <p className="text-sm text-slate-500 capitalize">{resource.type}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#7c6aef] group-hover:translate-x-1 transition-all" />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}