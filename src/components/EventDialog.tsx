import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

type EventType = 'meeting' | 'party' | 'business';

interface FormData {
  title: string;
  type: EventType;
  time: string;
  location: string;
  description: string;
  notification: string;
}

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

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent: Event | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  onOpenDialog: () => void;
}

const EventDialog = ({
  isOpen,
  onOpenChange,
  editingEvent,
  formData,
  setFormData,
  onSubmit,
  onOpenDialog
}: EventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl" onClick={onOpenDialog}>
          <Icon name="Plus" size={18} />
          Создать событие
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Редактировать событие' : 'Новое событие'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название события</Label>
            <Input 
              id="title" 
              placeholder="Введите название" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Тип события</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as EventType})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Встреча</SelectItem>
                  <SelectItem value="party">Вечеринка</SelectItem>
                  <SelectItem value="business">Деловая встреча</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Время</Label>
              <Input 
                id="time" 
                type="time" 
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Место проведения</Label>
            <Input 
              id="location" 
              placeholder="Где будет событие?" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea 
              id="description" 
              placeholder="Добавьте детали..." 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification">Напомнить за</Label>
            <Select value={formData.notification} onValueChange={(value) => setFormData({...formData, notification: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15 минут">15 минут</SelectItem>
                <SelectItem value="30 минут">30 минут</SelectItem>
                <SelectItem value="1 час">1 час</SelectItem>
                <SelectItem value="2 часа">2 часа</SelectItem>
                <SelectItem value="1 день">1 день</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onSubmit} className="w-full">
            {editingEvent ? 'Сохранить изменения' : 'Создать'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
