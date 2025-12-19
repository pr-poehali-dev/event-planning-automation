import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import EventCard from './EventCard';

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

interface EventsTabContentProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  filteredEvents: Event[];
  filterType: EventType | 'all';
  setFilterType: (type: EventType | 'all') => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
  onOpenDialog: () => void;
  getEventTypeColor: (type: EventType) => string;
  getEventTypeIcon: (type: EventType) => string;
}

const EventsTabContent = ({
  selectedDate,
  onSelectDate,
  filteredEvents,
  filterType,
  setFilterType,
  onEditEvent,
  onDeleteEvent,
  onOpenDialog,
  getEventTypeColor,
  getEventTypeIcon
}: EventsTabContentProps) => {
  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <Card className="p-4 h-fit">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={18} />
          Выбери сосиску
        </h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md"
        />
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-semibold">
            {selectedDate ? selectedDate.toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'long',
              year: 'numeric' 
            }) : 'Все события'}
          </h2>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={(value) => setFilterType(value as EventType | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="meeting">Встречи</SelectItem>
                <SelectItem value="party">Вечеринки</SelectItem>
                <SelectItem value="business">Деловые</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'событие' : 'событий'}
            </Badge>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="CalendarX2" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Нет событий</h3>
            <p className="text-muted-foreground mb-4">На эту дату пока не запланировано событий</p>
            <Button onClick={onOpenDialog}>
              <Icon name="Plus" size={18} className="mr-2" />
              Создать событие
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
                getEventTypeColor={getEventTypeColor}
                getEventTypeIcon={getEventTypeIcon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsTabContent;