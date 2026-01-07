import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Award, Zap, Calendar, BookOpen, CheckCircle, Play, Download, Edit2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Custom Badge Components
const BadgeDisplay = ({ badge }) => {
  const badgeStyles = {
    starter: {
      gradient: 'from-slate-400 to-slate-600',
      icon: '🌟',
      border: 'border-slate-300',
    },
    learner: {
      gradient: 'from-blue-400 to-blue-600',
      icon: '📚',
      border: 'border-blue-300',
    },
    achiever: {
      gradient: 'from-green-400 to-green-600',
      icon: '🏆',
      border: 'border-green-300',
    },
    master: {
      gradient: 'from-purple-400 to-purple-600',
      icon: '💎',
      border: 'border-purple-300',
    },
    champion: {
      gradient: 'from-amber-400 to-amber-600',
      icon: '👑',
      border: 'border-amber-300',
    },
    legend: {
      gradient: 'from-rose-400 to-rose-600',
      icon: '🔥',
      border: 'border-rose-300',
    },
  };

  const style = badgeStyles[badge.type] || badgeStyles.starter;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative group cursor-pointer`}
    >
      <div className={`w-20 h-24 rounded-xl bg-gradient-to-br ${style.gradient} ${style.border} border-2 shadow-lg flex flex-col items-center justify-center p-2`}>
        <span className="text-2xl mb-1">{style.icon}</span>
        <div className="w-full h-6 bg-white/20 rounded flex items-center justify-center">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{badge.name}</span>
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap">
          <p className="font-semibold">{badge.title}</p>
          <p className="text-slate-300">{badge.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setEditName(currentUser.full_name || '');
    } catch (e) {
      base44.auth.redirectToLogin();
    }
  };

  const { data: userProgress, isLoading } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      const progress = await base44.entities.UserProgress.filter({ user_email: user.email });
      if (progress.length === 0) {
        return {
          xp: 0,
          completed_lessons: [],
          completed_quizzes: [],
          completed_videos: [],
          downloaded_resources: [],
          badges: ['starter'],
          streak_days: 0,
        };
      }
      return progress[0];
    },
    enabled: !!user,
  });

  // Badge definitions
  const allBadges = [
    { id: 'starter', type: 'starter', name: 'Starter', title: 'Getting Started', description: 'Welcome to Epsilon!' },
    { id: 'learner', type: 'learner', name: 'Learner', title: 'Eager Learner', description: 'Complete 5 lessons' },
    { id: 'achiever', type: 'achiever', name: 'Achiever', title: 'Quiz Master', description: 'Pass 5 quizzes' },
    { id: 'master', type: 'master', name: 'Master', title: 'Knowledge Master', description: 'Earn 1000 XP' },
    { id: 'champion', type: 'champion', name: 'Champion', title: 'Champion', description: '7-day streak' },
    { id: 'legend', type: 'legend', name: 'Legend', title: 'Epsilon Legend', description: 'Complete all content' },
  ];

  const earnedBadgeIds = userProgress?.badges || ['starter'];
  const earnedBadges = allBadges.filter(b => earnedBadgeIds.includes(b.id));
  const lockedBadges = allBadges.filter(b => !earnedBadgeIds.includes(b.id));

  const handleUpdateProfile = async () => {
    try {
      await base44.auth.updateMe({ full_name: editName });
      setUser({ ...user, full_name: editName });
      setEditDialogOpen(false);
    } catch (e) {
      console.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  // Calculate level based on XP
  const xp = userProgress?.xp || 0;
  const level = Math.floor(xp / 500) + 1;
  const xpToNextLevel = 500 - (xp % 500);
  const levelProgress = ((xp % 500) / 500) * 100;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7c6aef] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg overflow-hidden mb-8">
          <div className="gradient-header h-32 relative">
            {/* Level Badge */}
            <div className="absolute top-4 right-4">
              <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-2xl font-bold text-white">{level}</span>
              </div>
            </div>
          </div>
          
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 mb-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="w-14 h-14 text-slate-400" />
                </div>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {user.full_name || 'Epsilon Learner'}
                </h1>
                <p className="text-slate-500">{user.email}</p>
              </div>

              <div className="flex gap-2">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full bg-[#7c6aef] hover:bg-[#5b4acf]">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* XP and Level Progress */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-slate-900">{xp} XP</span>
                </div>
                <span className="text-sm text-slate-500">Level {level}</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#7c6aef] to-[#a99ef7] rounded-full"
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">{xpToNextLevel} XP to Level {level + 1}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Lessons', value: userProgress?.completed_lessons?.length || 0, icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
            { label: 'Quizzes', value: userProgress?.completed_quizzes?.length || 0, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
            { label: 'Videos', value: userProgress?.completed_videos?.length || 0, icon: Play, color: 'bg-red-100 text-red-600' },
            { label: 'Downloads', value: userProgress?.downloaded_resources?.length || 0, icon: Download, color: 'bg-purple-100 text-purple-600' },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Badges Section */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#7c6aef]" />
              Badges Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Earned Badges */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Unlocked</h3>
              <div className="flex flex-wrap gap-4">
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BadgeDisplay badge={badge} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Locked</h3>
                <div className="flex flex-wrap gap-4">
                  {lockedBadges.map((badge) => (
                    <div key={badge.id} className="relative">
                      <div className="w-20 h-24 rounded-xl bg-slate-200 border-2 border-slate-300 flex flex-col items-center justify-center p-2 opacity-50">
                        <span className="text-2xl mb-1">🔒</span>
                        <div className="w-full h-6 bg-slate-300 rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">???</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-400 text-xs">{badge.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}