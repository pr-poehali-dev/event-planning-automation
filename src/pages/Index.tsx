import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import EventDialog from '@/components/EventDialog';
import EventsTabContent from '@/components/EventsTabContent';

type EventType = 'meeting' | 'party' | 'business';

interface Event {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  time: string;
  location: string;
  description: string;
  notification: string;
}

const eventTemplates = [
  {
    id: '1',
    name: 'Деловая встреча',
    type: 'business' as EventType,
    icon: 'Briefcase',
    description: 'Встреча с клиентом или партнёром'
  },
  {
    id: '2',
    name: 'Вечеринка',
    type: 'party' as EventType,
    icon: 'PartyPopper',
    description: 'День рождения или праздник'
  },
  {
    id: '3',
    name: 'Обычная встреча',
    type: 'meeting' as EventType,
    icon: 'Users',
    description: 'Личная или командная встреча'
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Встреча с командой',
    type: 'meeting',
    date: new Date(2025, 11, 20),
    time: '10:00',
    location: 'Офис, переговорная №2',
    description: 'Обсуждение квартального плана',
    notification: '30 минут'
  },
  {
    id: '2',
    title: 'Презентация проекта',
    type: 'business',
    date: new Date(2025, 11, 22),
    time: '14:30',
    location: 'Zoom конференция',
    description: 'Демонстрация результатов клиенту',
    notification: '1 час'
  },
  {
    id: '3',
    title: 'День рождения Анны',
    type: 'party',
    date: new Date(2025, 11, 25),
    time: '19:00',
    location: 'Ресторан "Seasons"',
    description: 'Праздничный ужин с друзьями',
    notification: '2 часа'
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting' as EventType,
    time: '',
    location: '',
    description: '',
    notification: '30min'
  });
  const { toast } = useToast();

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'party':
        return 'bg-pink-100 text-pink-700 hover:bg-pink-200';
      case 'business':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
    }
  };

  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'meeting':
        return 'Users';
      case 'party':
        return 'PartyPopper';
      case 'business':
        return 'Briefcase';
    }
  };

  const handleCreateEvent = () => {
    if (!formData.title || !formData.time) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и время события',
        variant: 'destructive'
      });
      return;
    }

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? {
        ...editingEvent,
        ...formData,
        date: selectedDate || new Date()
      } : e));
      toast({
        title: 'Событие обновлено!',
        description: 'Изменения сохранены',
      });
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        date: selectedDate || new Date()
      };
      setEvents([...events, newEvent]);
      toast({
        title: 'Событие создано!',
        description: 'Умное уведомление настроено автоматически',
      });
    }
    
    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      type: 'meeting',
      time: '',
      location: '',
      description: '',
      notification: '30min'
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      time: event.time,
      location: event.location,
      description: event.description,
      notification: event.notification
    });
    setSelectedDate(event.date);
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setDeletingEventId(null);
    toast({
      title: 'Событие удалено',
      description: 'Событие успешно удалено из календаря',
    });
  };

  const handleOpenDialog = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      type: 'meeting',
      time: '',
      location: '',
      description: '',
      notification: '30min'
    });
    setIsDialogOpen(true);
  };

  const filteredEvents = events.filter(event => {
    const dateMatch = !selectedDate || event.date.toDateString() === selectedDate.toDateString();
    const typeMatch = filterType === 'all' || event.type === filterType;
    return dateMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Icon name="Calendar" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">SosiskiPlanner</h1>
            </div>
            <EventDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              editingEvent={editingEvent}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateEvent}
              onOpenDialog={handleOpenDialog}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5 mx-auto h-12 bg-white rounded-xl shadow-sm">
            <TabsTrigger value="events" className="gap-2 rounded-lg">
              <Icon name="List" size={18} />
              <span className="hidden sm:inline">События</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2 rounded-lg">
              <Icon name="Calendar" size={18} />
              <span className="hidden sm:inline">Календарь</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2 rounded-lg">
              <Icon name="LayoutTemplate" size={18} />
              <span className="hidden sm:inline">Шаблоны</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 rounded-lg">
              <Icon name="Bell" size={18} />
              <span className="hidden sm:inline">Уведомления</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="gap-2 rounded-lg">
              <Icon name="HelpCircle" size={18} />
              <span className="hidden sm:inline">Помощь</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <EventsTabContent
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              filteredEvents={filteredEvents}
              filterType={filterType}
              setFilterType={setFilterType}
              onEditEvent={handleEditEvent}
              onDeleteEvent={setDeletingEventId}
              onOpenDialog={handleOpenDialog}
              getEventTypeColor={getEventTypeColor}
              getEventTypeIcon={getEventTypeIcon}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="p-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Календарь событий</h2>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md mx-auto scale-125"
                />
                <div className="mt-8 grid gap-2">
                  {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${event.type === 'meeting' ? 'bg-blue-500' : event.type === 'party' ? 'bg-pink-500' : 'bg-purple-500'}`} />
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Шаблоны событий</h2>
              <p className="text-muted-foreground mb-6">Выберите готовый шаблон для быстрого создания события</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {eventTemplates.map(template => (
                <Card key={template.id} className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl ${getEventTypeColor(template.type)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon name={template.icon} size={32} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleOpenDialog}>
                      Использовать
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Bell" size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Умные уведомления</h2>
                  <p className="text-muted-foreground">Настройте напоминания перед событиями</p>
                </div>

                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Icon name={getEventTypeIcon(event.type)} size={20} className="text-muted-foreground" />
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date.toLocaleDateString('ru-RU')} в {event.time}
                          </p>
                        </div>
                      </div>
                      <Badge className="gap-1">
                        <Icon name="Bell" size={12} />
                        {event.notification}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card className="p-8">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon name="HelpCircle" size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Помощь</h2>
                  <p className="text-muted-foreground">Как использовать SosiskiPlanner</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-semibold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Создайте событие</h3>
                        <p className="text-muted-foreground">Нажмите "Создать событие" и заполните детали или выберите готовый шаблон</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 font-semibold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Настройте уведомления</h3>
                        <p className="text-muted-foreground">Выберите время напоминания — система автоматически уведомит вас перед событием</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0 font-semibold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Управляйте календарём</h3>
                        <p className="text-muted-foreground">Просматривайте события по датам и типам в удобном интерфейсе</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-semibold mb-3">Типы событий</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                        <Icon name="Users" size={20} className="text-blue-700" />
                        <span className="font-medium text-blue-900">Встречи</span>
                        <span className="text-blue-700 text-sm ml-auto">Личные или командные</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-50">
                        <Icon name="PartyPopper" size={20} className="text-pink-700" />
                        <span className="font-medium text-pink-900">Вечеринки</span>
                        <span className="text-pink-700 text-sm ml-auto">Праздники и события</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                        <Icon name="Briefcase" size={20} className="text-purple-700" />
                        <span className="font-medium text-purple-900">Деловые встречи</span>
                        <span className="text-purple-700 text-sm ml-auto">С клиентами и партнёрами</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={!!deletingEventId} onOpenChange={() => setDeletingEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить событие?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Событие будет удалено из календаря навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingEventId && handleDeleteEvent(deletingEventId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;