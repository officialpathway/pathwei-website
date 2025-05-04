'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  WidgetGrid,
  Widget,
  ActivityWidget,
  TableWidget
} from '@/components/client/admin/widget';
import {
  Calendar,
  Clock,
  Plus,
  Check,
  Users,
  AlertCircle,
  Tag,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format, addMonths, subMonths } from 'date-fns';
import Sidebar from '@/components/client/admin/sidebar';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { signOut } from '@/lib/new/auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export default function Schedule() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-8 bg-gray-950 text-gray-200">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          onClick={handleSignOut}
          className="mt-4"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  // Handle no admin data (shouldn't happen if useAdminAuth is working correctly)
  if (!adminData) {
    return (
      <div className="p-8 bg-gray-950 text-gray-200">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have admin privileges.</AlertDescription>
        </Alert>
        <Button
          onClick={handleSignOut}
          className="mt-4"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  // Sample events for the calendar
  const events = [
    {
      id: 1,
      title: 'Team Meeting',
      date: new Date(2025, 4, 5), // May 5, 2025
      time: '10:00 AM',
      color: 'border-indigo-500',
      category: 'Meeting',
      description: 'Weekly team sync meeting',
      attendees: ['john@example.com', 'mary@example.com', 'david@example.com'],
      location: 'Conference Room A'
    },
    {
      id: 2,
      title: 'Product Launch',
      date: new Date(2025, 4, 10), // May 10, 2025
      time: '2:00 PM',
      color: 'border-blue-500',
      category: 'Event',
      description: 'New product launch event',
      attendees: ['all@example.com'],
      location: 'Main Hall'
    },
    {
      id: 3,
      title: 'Marketing Campaign',
      date: new Date(2025, 4, 15), // May 15, 2025
      time: '9:00 AM',
      color: 'border-green-500',
      category: 'Task',
      description: 'Launch Q2 marketing campaign',
      attendees: ['marketing@example.com'],
      location: 'Online'
    },
    {
      id: 4,
      title: 'Client Meeting',
      date: new Date(2025, 4, 7), // May 7, 2025
      time: '11:30 AM',
      color: 'border-purple-500',
      category: 'Meeting',
      description: 'Meeting with XYZ Corp',
      attendees: ['sales@example.com', 'john@example.com'],
      location: 'Conference Room B'
    },
    {
      id: 5,
      title: 'Quarterly Review',
      date: new Date(2025, 4, 20), // May 20, 2025
      time: '1:00 PM',
      color: 'border-amber-500',
      category: 'Meeting',
      description: 'Q2 performance review',
      attendees: ['executives@example.com', 'team-leads@example.com'],
      location: 'Boardroom'
    }
  ];

  // Task data for the To-Do widget
  const tasks = [
    {
      id: 1,
      title: 'Review product roadmap',
      due: 'Today',
      priority: 'High',
      completed: false
    },
    {
      id: 2,
      title: 'Prepare quarterly report',
      due: 'Tomorrow',
      priority: 'High',
      completed: false
    },
    {
      id: 3,
      title: 'Update team documentation',
      due: 'May 8, 2025',
      priority: 'Medium',
      completed: true
    },
    {
      id: 4,
      title: 'Schedule interviews',
      due: 'May 12, 2025',
      priority: 'Medium',
      completed: false
    },
    {
      id: 5,
      title: 'Send welcome email to new clients',
      due: 'May 6, 2025',
      priority: 'Low',
      completed: true
    }
  ];

  // Recent schedule activities
  const activities = [
    {
      title: 'Event Created',
      time: '1 hour ago',
      description: 'John created "Client Presentation" for May 15'
    },
    {
      title: 'Event Updated',
      time: '3 hours ago',
      description: 'Meeting "Weekly Team Sync" moved to 11:00 AM'
    },
    {
      title: 'Task Completed',
      time: 'Yesterday',
      description: 'Anna marked "Update documentation" as complete'
    },
    {
      title: 'Event Canceled',
      time: '2 days ago',
      description: 'Marketing webinar on May 8 was canceled'
    }
  ];

  // Table columns for the upcoming events table
  const eventColumns = [
    {
      key: 'title',
      title: 'Event',
      render: (value: string, item: { category: string }) => (
        <div className="flex flex-col">
          <span className="font-medium">{value}</span>
          <span className="text-xs text-gray-400">{item.category}</span>
        </div>
      )
    },
    {
      key: 'date',
      title: 'Date & Time',
      render: (value: string, item: { date: string; time: string }) => (
        <div className="flex flex-col">
          <span>{format(new Date(value), 'MMM d, yyyy')}</span>
          <span className="text-xs text-gray-400">{item.time}</span>
        </div>
      )
    },
    {
      key: 'location',
      title: 'Location',
    },
    {
      key: 'attendees',
      title: 'Attendees',
      render: (value: string) => (
        <div className="flex items-center">
          <span>{value.length}</span>
          <Users className="h-4 w-4 ml-1 text-gray-400" />
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: () => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 px-2 text-gray-300 border-gray-700">
            Edit
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 text-red-400 border-gray-700 hover:border-red-600 hover:bg-red-950/30">
            Cancel
          </Button>
        </div>
      )
    }
  ];

  // Filter function for events
  const filteredEvents = events.filter(event => {
    // Filter by category
    if (selectedFilter !== 'all' && event.category.toLowerCase() !== selectedFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Function to navigate between months
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Include Sidebar with adminData */}
      <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Schedule</h1>
            <p className="text-gray-400">Manage events, appointments, and tasks</p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-gray-900 border-gray-800 text-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Event</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new event on your schedule
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-300">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-gray-300">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter location"
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-300">Category</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter event details"
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="attendees" className="text-gray-300">Attendees (comma separated)</Label>
                    <Input
                      id="attendees"
                      placeholder="email@example.com, email2@example.com"
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddEvent(false)} className="border-gray-700 text-gray-200 hover:bg-gray-800">
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAddEvent(false)} className="bg-indigo-600 hover:bg-indigo-700">
                    Save Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-gray-900 border-gray-800 text-gray-200">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Filter by Category</Label>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Search Events</Label>
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <WidgetGrid>
          {/* Calendar Widget */}
          <Widget
            title="Calendar"
            description="Your schedule at a glance"
            size="2x2"
            icon={Calendar}
            iconClassName="bg-indigo-500/20"
            headerAction={
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-300 mb-2">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              
              {/* Calendar grid visualization would go here */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-white">
                {/* Example calendar grid - in real app would be dynamically generated */}
                {Array.from({ length: 35 }).map((_, index) => {
                  const day = index - 6; // Adjust for actual month start day
                  const hasEvent = events.some(e => 
                    new Date(e.date).getDate() === day && 
                    new Date(e.date).getMonth() === currentMonth.getMonth()
                  );
                  
                  return (
                    <div
                      key={index}
                      className={`aspect-square flex flex-col items-center justify-center rounded p-1 text-sm
                        ${day > 0 && day <= 31 ? 'hover:bg-gray-800 cursor-pointer' : 'opacity-30'} 
                        ${hasEvent && day > 0 && day <= 31 ? 'bg-indigo-900/20 font-medium' : ''}
                      `}
                    >
                      {day > 0 && day <= 31 ? day : ''}
                      {hasEvent && day > 0 && day <= 31 && (
                        <div className="h-1 w-1 bg-indigo-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-gray-300">Today&apos;s Events</div>
                {events
                  .filter(event => 
                    new Date(event.date).toDateString() === new Date().toDateString()
                  )
                  .map((event, index) => (
                    <div
                      key={index}
                      className={`bg-gray-800/50 p-2 rounded border-l-2 ${event.color}`}
                    >
                      <div className="font-medium text-white">{event.title}</div>
                      <div className="text-xs text-gray-400">{event.time} • {event.location}</div>
                    </div>
                  ))}
                  
                {!events.some(event => 
                  new Date(event.date).toDateString() === new Date().toDateString()
                ) && (
                  <div className="text-gray-400 text-sm">No events scheduled for today</div>
                )}
              </div>
            </div>
          </Widget>
          
          {/* To-Do List Widget */}
          <Widget
            title="Tasks"
            description="Items on your schedule"
            size="2x2"
            icon={Check}
            iconClassName="bg-green-500/20"
            headerAction={
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <div>Task</div>
                <div>Due</div>
              </div>
              
              {tasks.map((task, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-800/70"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={task.completed}
                      className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                    <label 
                      htmlFor={`task-${task.id}`}
                      className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}
                    >
                      {task.title}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Badge 
                      variant="outline" 
                      className={`
                        text-xs mr-2
                        ${task.priority === 'High' ? 'border-red-500 text-red-400' : 
                          task.priority === 'Medium' ? 'border-yellow-500 text-yellow-400' : 
                          'border-blue-500 text-blue-400'}
                      `}
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-gray-400">{task.due}</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t border-gray-800">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700 text-gray-200 hover:bg-gray-800 mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Task
                </Button>
              </div>
            </div>
          </Widget>
          
          {/* Upcoming Events Widget */}
          <TableWidget
            columns={eventColumns}
            data={filteredEvents}
            title="Upcoming Events"
            description="Your scheduled events for this month"
            size="4x1"
            icon={Clock}
            iconClassName="bg-blue-500/20"
            emptyMessage="No upcoming events found"
          />
          
          {/* Activity Log Widget */}
          <ActivityWidget
            activities={activities}
            size="2x1"
            title="Recent Activity"
            description="Latest schedule changes"
            icon={AlertCircle}
            iconClassName="bg-amber-500/20"
          />
          
          {/* Event Categories Widget */}
          <Widget
            title="Event Categories"
            description="Distribution by type"
            size="2x1"
            icon={Tag}
            iconClassName="bg-purple-500/20"
          >
            <div className="space-y-4">
              {/* Meeting category */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Meetings</span>
                  <span className="text-sm text-gray-400">
                    {events.filter(e => e.category === 'Meeting').length} events
                  </span>
                </div>
                <Progress 
                  value={
                    (events.filter(e => e.category === 'Meeting').length / events.length) * 100
                  } 
                  className="h-2 bg-gray-700" 
                  indicatorClassName="bg-indigo-500" 
                />
              </div>
              
              {/* Event category */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Events</span>
                  <span className="text-sm text-gray-400">
                    {events.filter(e => e.category === 'Event').length} events
                  </span>
                </div>
                <Progress 
                  value={
                    (events.filter(e => e.category === 'Event').length / events.length) * 100
                  } 
                  className="h-2 bg-gray-700" 
                  indicatorClassName="bg-blue-500" 
                />
              </div>
              
              {/* Task category */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Tasks</span>
                  <span className="text-sm text-gray-400">
                    {events.filter(e => e.category === 'Task').length} events
                  </span>
                </div>
                <Progress 
                  value={
                    (events.filter(e => e.category === 'Task').length / events.length) * 100
                  } 
                  className="h-2 bg-gray-700" 
                  indicatorClassName="bg-green-500" 
                />
              </div>
              
              <div className="pt-3 border-t border-gray-800">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Total Events: {events.length}</span>
                  <span>Tasks Completed: {tasks.filter(t => t.completed).length}/{tasks.length}</span>
                </div>
              </div>
            </div>
          </Widget>
        </WidgetGrid>
      </main>
    </div>
  );
}