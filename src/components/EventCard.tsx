import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';

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

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  getEventTypeColor: (type: EventType) => string;
  getEventTypeIcon: (type: EventType) => string;
}

const EventCard = ({ event, onEdit, onDelete, getEventTypeColor, getEventTypeIcon }: EventCardProps) => {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${getEventTypeColor(event.type)} flex items-center justify-center flex-shrink-0`}>
          <Icon name={getEventTypeIcon(event.type)} size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline">
                {event.time}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Icon name="MoreVertical" size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(event)}>
                    <Icon name="Pencil" size={16} className="mr-2" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(event.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={14} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="FileText" size={14} />
              <span>{event.description}</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Icon name="Bell" size={14} />
              <span>Напомнить за {event.notification}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
