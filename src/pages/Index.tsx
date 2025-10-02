import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/c8ed8102-c061-4f5b-ac2c-ac7d0710fe7b';
const AUTH_URL = 'https://functions.poehali.dev/59f82144-8fc0-41bb-b8d5-ad0b3d77295b';

const Index = () => {
  const [activeSection, setActiveSection] = useState('главная');
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({ childName: '', childAge: '', parentName: '', phone: '', comment: '' });
  const [isCoachLoggedIn, setIsCoachLoggedIn] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', fullName: '' });
  const [registerError, setRegisterError] = useState('');
  const [athletesList, setAthletesList] = useState([
    { id: 1, name: 'Александров Иван', age: 15, achievements: '1 место - Кубок Татарстана 2024', image: '🎿' },
    { id: 2, name: 'Петрова Мария', age: 14, achievements: '2 место - Первенство РТ 2024', image: '⛷️' },
    { id: 3, name: 'Сидоров Дмитрий', age: 16, achievements: '3 место - Зимняя Спартакиада', image: '🎿' },
    { id: 4, name: 'Козлова Елена', age: 13, achievements: '1 место - Юниорский кубок', image: '⛷️' }
  ]);
  const [newAthlete, setNewAthlete] = useState({ name: '', age: '', achievements: '', image: '🎿' });
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [scheduleList, setScheduleList] = useState([
    { id: 1, day: 'Понедельник', time: '16:00 - 18:00', group: 'Младшая группа (8-11 лет)', coach: 'Иванов П.С.' },
    { id: 2, day: 'Понедельник', time: '18:00 - 20:00', group: 'Старшая группа (12-16 лет)', coach: 'Петрова А.М.' },
    { id: 3, day: 'Среда', time: '16:00 - 18:00', group: 'Младшая группа (8-11 лет)', coach: 'Иванов П.С.' },
    { id: 4, day: 'Среда', time: '18:00 - 20:00', group: 'Старшая группа (12-16 лет)', coach: 'Петрова А.М.' },
    { id: 5, day: 'Пятница', time: '16:00 - 18:00', group: 'Младшая группа (8-11 лет)', coach: 'Иванов П.С.' },
    { id: 6, day: 'Пятница', time: '18:00 - 20:00', group: 'Старшая группа (12-16 лет)', coach: 'Петрова А.М.' },
    { id: 7, day: 'Суббота', time: '10:00 - 13:00', group: 'Общая тренировка', coach: 'Вся команда' }
  ]);
  const [newSchedule, setNewSchedule] = useState({ day: 'Понедельник', time: '', group: '', coach: '' });
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<number | null>(null);



  const competitions = [
    { date: '15 декабря 2024', name: 'Кубок Бавлы', location: 'г. Бавлы, лыжная база', status: 'upcoming' },
    { date: '20 января 2025', name: 'Первенство Татарстана', location: 'г. Казань', status: 'upcoming' },
    { date: '10 февраля 2025', name: 'Зимняя Спартакиада', location: 'г. Альметьевск', status: 'upcoming' }
  ];



  const gallery = [
    { title: 'Кубок Татарстана 2024', image: '🏆', description: 'Победа в командном зачете' },
    { title: 'Тренировка на трассе', image: '⛷️', description: 'Подготовка к сезону' },
    { title: 'Церемония награждения', image: '🥇', description: '1 место - Александров Иван' },
    { title: 'Командное фото', image: '📸', description: 'Вся команда после соревнований' },
    { title: 'Зимний лагерь', image: '🏔️', description: 'Учебно-тренировочный сбор' },
    { title: 'Юные чемпионы', image: '🎿', description: 'Наши звёзды' }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setFormData({ childName: '', childAge: '', parentName: '', phone: '', comment: '' });
      fetchApplications();
      alert('Заявка успешно отправлена!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Ошибка при отправке заявки');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      });
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      });
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleCoachLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setIsCoachLoggedIn(true);
        setCoachData(data.coach);
        setActiveSection('панель-тренера');
        setLoginForm({ username: '', password: '' });
      } else {
        setLoginError(data.message || 'Ошибка входа');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Ошибка подключения к серверу');
    }
  };

  const handleCoachLogout = () => {
    setIsCoachLoggedIn(false);
    setCoachData(null);
    setActiveSection('главная');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    try {
      const response = await fetch(AUTH_URL + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Регистрация успешна! Войдите в систему.');
        setShowRegister(false);
        setRegisterForm({ username: '', password: '', fullName: '' });
      } else {
        setRegisterError(data.message || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Register error:', error);
      setRegisterError('Ошибка подключения к серверу');
    }
  };

  const handleAddAthlete = () => {
    if (newAthlete.name && newAthlete.age) {
      const id = athletesList.length > 0 ? Math.max(...athletesList.map(a => a.id)) + 1 : 1;
      setAthletesList([...athletesList, { id, ...newAthlete, age: parseInt(newAthlete.age) }]);
      setNewAthlete({ name: '', age: '', achievements: '', image: '🎿' });
      setShowAddAthlete(false);
    }
  };

  const handleRemoveAthlete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить спортсмена?')) {
      setAthletesList(athletesList.filter(a => a.id !== id));
    }
  };

  const handleAddSchedule = () => {
    if (newSchedule.time && newSchedule.group && newSchedule.coach) {
      const id = scheduleList.length > 0 ? Math.max(...scheduleList.map(s => s.id)) + 1 : 1;
      setScheduleList([...scheduleList, { id, ...newSchedule }]);
      setNewSchedule({ day: 'Понедельник', time: '', group: '', coach: '' });
      setShowAddSchedule(false);
    }
  };

  const handleRemoveSchedule = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить тренировку?')) {
      setScheduleList(scheduleList.filter(s => s.id !== id));
    }
  };

  const handleEditSchedule = (id: number) => {
    const scheduleToEdit = scheduleList.find(s => s.id === id);
    if (scheduleToEdit) {
      setNewSchedule({ ...scheduleToEdit });
      setEditingSchedule(id);
      setShowAddSchedule(true);
    }
  };

  const handleUpdateSchedule = () => {
    if (editingSchedule && newSchedule.time && newSchedule.group && newSchedule.coach) {
      setScheduleList(scheduleList.map(s => 
        s.id === editingSchedule ? { id: editingSchedule, ...newSchedule } : s
      ));
      setNewSchedule({ day: 'Понедельник', time: '', group: '', coach: '' });
      setEditingSchedule(null);
      setShowAddSchedule(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-4xl">⛷️</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                ЛЫЖНАЯ КОМАНДА БАВЛЫ
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {['Главная', 'Спортсмены', 'Соревнования', 'Расписание', 'Галерея', 'Регистрация', 'Заявки'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveSection(item.toLowerCase())}
                  className={`font-semibold transition-all ${
                    activeSection === item.toLowerCase()
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item}
                </button>
              ))}
              {isCoachLoggedIn ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-300">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveSection('панель-тренера')}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Icon name="UserCog" className="mr-2" size={16} />
                    Панель тренера
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCoachLogout}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Icon name="LogOut" size={16} />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveSection('вход-тренера')}
                  className="ml-4 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Icon name="Lock" className="mr-2" size={16} />
                  Вход для тренера
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {activeSection === 'главная' && (
          <div className="space-y-16 animate-fade-in">
            <section className="text-center space-y-6 py-20">
              <h2 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 bg-clip-text text-transparent">
                ВПЕРЕД К ПОБЕДАМ!
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Мы команда юных лыжников города Бавлы. Тренируемся, участвуем в соревнованиях и побеждаем!
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={() => setActiveSection('регистрация')}
                >
                  <Icon name="UserPlus" className="mr-2" />
                  Присоединиться
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 font-bold"
                  onClick={() => setActiveSection('соревнования')}
                >
                  <Icon name="Trophy" className="mr-2" />
                  Соревнования
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 border-blue-200">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">50+</h3>
                <p className="text-gray-600">Побед в соревнованиях</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 border-red-200">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-red-500 mb-2">30</h3>
                <p className="text-gray-600">Спортсменов в команде</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 border-blue-200">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">10</h3>
                <p className="text-gray-600">Лет успешной работы</p>
              </Card>
            </section>

            <section>
              <h3 className="text-3xl font-bold text-center mb-8">Наши звёзды</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {athletesList.slice(0, 4).map((athlete) => (
                  <Card key={athlete.id} className="p-6 text-center hover:shadow-xl transition-all hover:scale-105 animate-scale-in">
                    <div className="text-6xl mb-4">{athlete.image}</div>
                    <h4 className="font-bold text-lg mb-2">{athlete.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{athlete.age} лет</p>
                    <Badge className="bg-blue-100 text-blue-700">{athlete.achievements}</Badge>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'спортсмены' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">Наши спортсмены</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {athletesList.map((athlete) => (
                <Card key={athlete.id} className="p-6 hover:shadow-xl transition-all hover:scale-105">
                  <div className="flex items-start space-x-4">
                    <div className="text-5xl">{athlete.image}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1">{athlete.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{athlete.age} лет</p>
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        {athlete.achievements}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'соревнования' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-blue-600">Ближайшие соревнования</h2>
              <p className="text-gray-600">Следите за нашими выступлениями в прямом эфире</p>
              <Button 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white font-bold"
                onClick={() => window.open('https://myfinish.ru', '_blank')}
              >
                <Icon name="Video" className="mr-2" />
                Смотреть трансляции на MyFinish.ru
              </Button>
            </div>
            
            <div className="space-y-4">
              {competitions.map((comp, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-all border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Icon name="Calendar" className="text-blue-600 mt-1" size={24} />
                      <div>
                        <h3 className="font-bold text-xl mb-1">{comp.name}</h3>
                        <p className="text-gray-600 mb-1">{comp.date}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Icon name="MapPin" className="mr-1" size={16} />
                          {comp.location}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Скоро</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'расписание' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">Расписание тренировок</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {scheduleList.map((item) => (
                <Card key={item.id} className="p-6 hover:shadow-lg transition-all border-l-4 border-red-500">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[100px]">
                        <Badge className="bg-blue-600 text-white text-sm">{item.day}</Badge>
                        <p className="text-lg font-bold text-blue-600 mt-2">{item.time}</p>
                      </div>
                      <div className="border-l-2 border-gray-200 pl-4">
                        <h3 className="font-bold text-lg mb-1">{item.group}</h3>
                        <p className="text-gray-600 flex items-center">
                          <Icon name="User" className="mr-2" size={16} />
                          Тренер: {item.coach}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Card className="p-8 max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-red-50">
                <Icon name="Info" className="mx-auto mb-4 text-blue-600" size={48} />
                <h3 className="text-2xl font-bold mb-4">Важная информация</h3>
                <div className="text-left space-y-2 text-gray-700">
                  <p>• Просьба приходить за 15 минут до начала тренировки</p>
                  <p>• При себе иметь сменную одежду и воду</p>
                  <p>• В случае пропуска предупредить тренера заранее</p>
                  <p>• Лыжный инвентарь предоставляется клубом</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'галерея' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">Фотогалерея</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 group">
                  <div className="bg-gradient-to-br from-blue-100 to-red-100 p-12 flex items-center justify-center text-8xl">
                    {item.image}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Card className="p-8 max-w-xl mx-auto">
                <Icon name="Camera" className="mx-auto mb-4 text-red-500" size={48} />
                <h3 className="text-2xl font-bold mb-4">Поделитесь своими фото!</h3>
                <p className="text-gray-600 mb-4">Присылайте фотографии с соревнований и тренировок</p>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Icon name="Upload" className="mr-2" />
                  Загрузить фото
                </Button>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'регистрация' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">Регистрация</h2>
            <Card className="p-8">
              <Tabs defaultValue="parent" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="parent">Родитель</TabsTrigger>
                  <TabsTrigger value="athlete">Спортсмен</TabsTrigger>
                  <TabsTrigger value="coach">Тренер</TabsTrigger>
                </TabsList>
                
                <TabsContent value="parent" className="space-y-4">
                  <div className="space-y-2">
                    <Label>ФИО родителя</Label>
                    <Input placeholder="Иванов Иван Иванович" />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input placeholder="+7 900 123-45-67" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Зарегистрироваться</Button>
                </TabsContent>

                <TabsContent value="athlete" className="space-y-4">
                  <div className="space-y-2">
                    <Label>ФИО спортсмена</Label>
                    <Input placeholder="Петров Петр Петрович" />
                  </div>
                  <div className="space-y-2">
                    <Label>Возраст</Label>
                    <Input type="number" placeholder="14" />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон родителя</Label>
                    <Input placeholder="+7 900 123-45-67" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Зарегистрироваться</Button>
                </TabsContent>

                <TabsContent value="coach" className="space-y-4">
                  <div className="space-y-2">
                    <Label>ФИО тренера</Label>
                    <Input placeholder="Сидоров Сидор Сидорович" />
                  </div>
                  <div className="space-y-2">
                    <Label>Квалификация</Label>
                    <Input placeholder="Мастер спорта" />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input placeholder="+7 900 123-45-67" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="coach@example.com" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Зарегистрироваться</Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}

        {activeSection === 'вход-тренера' && (
          <div className="max-w-md mx-auto animate-fade-in">
            <Card className="p-8">
              <div className="text-center mb-6">
                <Icon name="Lock" className="mx-auto mb-4 text-blue-600" size={48} />
                <h2 className="text-3xl font-bold text-blue-600 mb-2">Вход для тренера</h2>
                <p className="text-gray-600">Введите логин и пароль</p>
              </div>
              <form onSubmit={handleCoachLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Логин</Label>
                  <Input
                    placeholder="trainer"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Пароль</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                </div>
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {loginError}
                  </div>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Icon name="LogIn" className="mr-2" />
                  Войти
                </Button>
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => setShowRegister(!showRegister)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {showRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                  </button>
                </div>
              </form>
            </Card>

            {showRegister && (
              <Card className="p-8 mt-6">
                <div className="text-center mb-6">
                  <Icon name="UserPlus" className="mx-auto mb-4 text-blue-600" size={48} />
                  <h2 className="text-3xl font-bold text-blue-600 mb-2">Регистрация тренера</h2>
                  <p className="text-gray-600">Создайте новый аккаунт</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>ФИО</Label>
                    <Input
                      placeholder="Иванов Иван Иванович"
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Логин</Label>
                    <Input
                      placeholder="ivan_ivanov"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Пароль</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      required
                    />
                  </div>
                  {registerError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {registerError}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Icon name="UserPlus" className="mr-2" />
                    Зарегистрироваться
                  </Button>
                </form>
              </Card>
            )}
          </div>
        )}

        {activeSection === 'панель-тренера' && isCoachLoggedIn && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-blue-600 mb-2">Панель тренера</h2>
              <p className="text-gray-600">Добро пожаловать, {coachData?.name}</p>
            </div>
            
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Icon name="UserCheck" className="mr-2 text-blue-600" />
                Заявки в команду
              </h3>
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Icon name="Inbox" className="mx-auto mb-4" size={48} />
                    <p>Новых заявок пока нет</p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <Card key={app.id} className="p-4 border-l-4 border-blue-500">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-lg">{app.name}</h4>
                          <Badge className={
                            app.status === 'approved' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {app.status === 'approved' ? 'Одобрена' :
                             app.status === 'rejected' ? 'Отклонена' :
                             'Ожидает'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Возраст: {app.age} лет</p>
                        <p className="text-sm text-gray-600">Родитель: {app.parent}</p>
                        <p className="text-sm text-gray-600">Телефон: {app.phone}</p>
                        {app.comment && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Комментарий:</strong> {app.comment}
                          </p>
                        )}
                        
                        {app.status === 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(app.id)}
                            >
                              <Icon name="Check" className="mr-1" size={16} />
                              Принять
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleReject(app.id)}
                            >
                              <Icon name="X" className="mr-1" size={16} />
                              Отклонить
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <Icon name="Users" className="mr-2 text-blue-600" />
                  Управление спортсменами
                </h3>
                <Button 
                  onClick={() => setShowAddAthlete(!showAddAthlete)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Icon name="Plus" className="mr-2" />
                  Добавить спортсмена
                </Button>
              </div>

              {showAddAthlete && (
                <Card className="p-4 mb-6 bg-green-50 border-green-200">
                  <h4 className="font-bold mb-4">Новый спортсмен</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ФИО</Label>
                      <Input
                        placeholder="Иванов Иван Иванович"
                        value={newAthlete.name}
                        onChange={(e) => setNewAthlete({...newAthlete, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Возраст</Label>
                      <Input
                        type="number"
                        placeholder="14"
                        value={newAthlete.age}
                        onChange={(e) => setNewAthlete({...newAthlete, age: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Достижения</Label>
                      <Input
                        placeholder="1 место - Кубок города"
                        value={newAthlete.achievements}
                        onChange={(e) => setNewAthlete({...newAthlete, achievements: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Эмодзи</Label>
                      <Input
                        placeholder="🎿"
                        value={newAthlete.image}
                        onChange={(e) => setNewAthlete({...newAthlete, image: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={handleAddAthlete}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Icon name="Check" className="mr-2" />
                      Добавить
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowAddAthlete(false);
                        setNewAthlete({ name: '', age: '', achievements: '', image: '🎿' });
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {athletesList.map((athlete) => (
                  <Card key={athlete.id} className="p-4 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-4xl">{athlete.image}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">{athlete.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">{athlete.age} лет</p>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {athlete.achievements}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleRemoveAthlete(athlete.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <Icon name="Calendar" className="mr-2 text-blue-600" />
                  Управление расписанием
                </h3>
                <Button 
                  onClick={() => {
                    setShowAddSchedule(!showAddSchedule);
                    if (editingSchedule) {
                      setEditingSchedule(null);
                      setNewSchedule({ day: 'Понедельник', time: '', group: '', coach: '' });
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Icon name="Plus" className="mr-2" />
                  Добавить тренировку
                </Button>
              </div>

              {showAddSchedule && (
                <Card className="p-4 mb-6 bg-green-50 border-green-200">
                  <h4 className="font-bold mb-4">
                    {editingSchedule ? 'Редактировать тренировку' : 'Новая тренировка'}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>День недели</Label>
                      <select
                        className="w-full border rounded-md px-3 py-2"
                        value={newSchedule.day}
                        onChange={(e) => setNewSchedule({...newSchedule, day: e.target.value})}
                      >
                        <option>Понедельник</option>
                        <option>Вторник</option>
                        <option>Среда</option>
                        <option>Четверг</option>
                        <option>Пятница</option>
                        <option>Суббота</option>
                        <option>Воскресенье</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Время</Label>
                      <Input
                        placeholder="16:00 - 18:00"
                        value={newSchedule.time}
                        onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Группа</Label>
                      <Input
                        placeholder="Младшая группа (8-11 лет)"
                        value={newSchedule.group}
                        onChange={(e) => setNewSchedule({...newSchedule, group: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Тренер</Label>
                      <Input
                        placeholder="Иванов П.С."
                        value={newSchedule.coach}
                        onChange={(e) => setNewSchedule({...newSchedule, coach: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Icon name="Check" className="mr-2" />
                      {editingSchedule ? 'Сохранить' : 'Добавить'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowAddSchedule(false);
                        setEditingSchedule(null);
                        setNewSchedule({ day: 'Понедельник', time: '', group: '', coach: '' });
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </Card>
              )}

              <div className="space-y-3">
                {scheduleList.map((item) => (
                  <Card key={item.id} className="p-4 hover:shadow-lg transition-all border-l-4 border-blue-500">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center min-w-[100px]">
                          <Badge className="bg-blue-600 text-white text-sm">{item.day}</Badge>
                          <p className="text-sm font-bold text-blue-600 mt-1">{item.time}</p>
                        </div>
                        <div className="border-l-2 border-gray-200 pl-4 flex-1">
                          <h4 className="font-bold mb-1">{item.group}</h4>
                          <p className="text-sm text-gray-600">Тренер: {item.coach}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-500 hover:bg-blue-50"
                          onClick={() => handleEditSchedule(item.id)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleRemoveSchedule(item.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'заявки' && (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-4xl font-bold text-center text-blue-600">Подать заявку в команду</h2>
            
            <Card className="p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Icon name="ClipboardList" className="mr-2 text-blue-600" />
                Форма заявки
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Важная информация</p>
                    <p>При заполнении заявки обязательно укажите в комментариях наличие медицинских противопоказаний или особенностей здоровья ребенка (аллергии, хронические заболевания, травмы и т.д.)</p>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmitApplication}>
                  <div className="space-y-2">
                    <Label>ФИО ребенка</Label>
                    <Input 
                      placeholder="Иванов Петр Иванович" 
                      value={formData.childName}
                      onChange={(e) => setFormData({...formData, childName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Возраст</Label>
                    <Input 
                      type="number" 
                      placeholder="12"
                      value={formData.childAge}
                      onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ФИО родителя</Label>
                    <Input 
                      placeholder="Иванова Мария Александровна"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input 
                      placeholder="+7 900 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Комментарий (медицинские особенности, опыт и др.)</Label>
                    <Textarea 
                      placeholder="Укажите медицинские противопоказания, особенности здоровья, опыт катания на лыжах и другую важную информацию..."
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold">
                    <Icon name="Send" className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </Card>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Icon name="MapPin" className="mr-2" />
                Контакты
              </h3>
              <p className="mb-2">г. Бавлы, Республика Татарстан</p>
              <p className="mb-2">Лыжная база "Трехгорка"</p>
              <p>Телефон: +7 904 678 52 08</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Icon name="Clock" className="mr-2" />
                Режим работы
              </h3>
              <p className="mb-2">Понедельник - Пятница: 15:00 - 20:00</p>
              <p className="mb-2">Суббота - Воскресенье: 10:00 - 18:00</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Icon name="Users" className="mr-2" />
                Социальные сети
              </h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Icon name="Facebook" />
                </Button>
                <Button variant="outline" size="icon" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Icon name="Instagram" />
                </Button>
                <Button variant="outline" size="icon" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Icon name="Mail" />
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-blue-500">
            <p>&copy; 2024 Лыжная команда Бавлы. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;