import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BookOpen, CheckCircle, Play, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample events/deadlines
  const events = [
    { date: '2024-01-15', type: 'lesson', title: 'Marketing Fundamentals Due', xp: 150 },
    { date: '2024-01-18', type: 'quiz', title: 'Finance Quiz Deadline', xp: 200 },
    { date: '2024-01-20', type: 'video', title: 'Leadership Webinar', xp: 100 },
    { date: '2024-01-22', type: 'lesson', title: 'Business Ethics Module', xp: 150 },
    { date: '2024-01-25', type: 'quiz', title: 'Entrepreneurship Assessment', xp: 250 },
    { date: '2024-01-28', type: 'video', title: 'Guest Speaker: Startup Success', xp: 100 },
  ];

  // Get current month data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const getEventsForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const eventTypeColors = {
    lesson: 'bg-blue-500',
    quiz: 'bg-green-500',
    video: 'bg-red-500',
  };

  const eventTypeIcons = {
    lesson: BookOpen,
    quiz: CheckCircle,
    video: Play,
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#7c6aef] flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Learning Calendar</h1>
            <p className="text-slate-600">Track your learning schedule and deadlines</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-xl">
                  {monthNames[month]} {year}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayEvents = day ? getEventsForDate(day) : [];
                  const isSelected = selectedDate === day;
                  
                  return (
                    <motion.div
                      key={index}
                      whileHover={day ? { scale: 1.05 } : {}}
                      onClick={() => day && setSelectedDate(day === selectedDate ? null : day)}
                      className={`
                        aspect-square p-1 rounded-xl cursor-pointer transition-colors
                        ${day ? 'hover:bg-slate-100' : ''}
                        ${isSelected ? 'bg-[#7c6aef] text-white' : ''}
                        ${isToday(day) && !isSelected ? 'bg-purple-100' : ''}
                      `}
                    >
                      {day && (
                        <div className="h-full flex flex-col">
                          <span className={`text-sm font-medium ${isSelected ? 'text-white' : isToday(day) ? 'text-[#7c6aef]' : ''}`}>
                            {day}
                          </span>
                          {dayEvents.length > 0 && (
                            <div className="flex gap-0.5 mt-1 flex-wrap">
                              {dayEvents.slice(0, 3).map((event, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : eventTypeColors[event.type]}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-6 pt-4 border-t justify-center">
                {Object.entries(eventTypeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm text-slate-600 capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate 
                    ? `${monthNames[month]} ${selectedDate}, ${year}`
                    : 'Select a Date'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event, index) => {
                        const Icon = eventTypeIcons[event.type];
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                          >
                            <div className={`w-10 h-10 rounded-lg ${eventTypeColors[event.type]} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{event.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {event.type}
                                </Badge>
                                <span className="flex items-center gap-1 text-xs text-amber-600">
                                  <Zap className="w-3 h-3" />
                                  +{event.xp} XP
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No events on this date</p>
                  )
                ) : (
                  <p className="text-slate-500 text-center py-4">Click on a date to view events</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 4).map((event, index) => {
                    const Icon = eventTypeIcons[event.type];
                    const eventDate = new Date(event.date);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${eventTypeColors[event.type]} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                          <p className="text-xs text-slate-500">
                            {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}