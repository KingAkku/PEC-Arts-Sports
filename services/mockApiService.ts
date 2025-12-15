
import {
  User,
  Role,
  House,
  Event,
  EventCategory,
  EventType,
  Registration,
  RegistrationStatus,
  LeaderboardData,
} from '../types';

// --- MOCK DATABASE ---

let users: User[] = [
  // Students
  { id: 'student1', name: 'Alice Smith', email: 'alice@pec.ac.in', role: Role.STUDENT, house: House.BLUE, profilePictureUrl: 'https://i.pravatar.cc/150?u=student1' },
  { id: 'student2', name: 'Bob Johnson', email: 'bob@pec.ac.in', role: Role.STUDENT, house: House.RED, profilePictureUrl: 'https://i.pravatar.cc/150?u=student2' },
  { id: 'student3', name: 'Charlie Brown', email: 'charlie@pec.ac.in', role: Role.STUDENT, house: House.GREEN, profilePictureUrl: 'https://i.pravatar.cc/150?u=student3' },
  { id: 'student4', name: 'Diana Prince', email: 'diana@pec.ac.in', role: Role.STUDENT, house: House.YELLOW, profilePictureUrl: 'https://i.pravatar.cc/150?u=student4' },
  { id: 'student5', name: 'Eve Adams', email: 'eve@pec.ac.in', role: Role.STUDENT, house: House.RED, profilePictureUrl: 'https://i.pravatar.cc/150?u=student5' },


  // House Admins
  { id: 'hadmin1', name: 'Henry Blue', email: 'hblue@pec.ac.in', role: Role.HOUSE_ADMIN, house: House.BLUE, profilePictureUrl: 'https://i.pravatar.cc/150?u=hadmin1' },
  { id: 'hadmin2', name: 'Helen Red', email: 'hred@pec.ac.in', role: Role.HOUSE_ADMIN, house: House.RED, profilePictureUrl: 'https://i.pravatar.cc/150?u=hadmin2' },

  // Judges
  { id: 'judge1', name: 'Judge Judy', email: 'judy@pec.ac.in', role: Role.JUDGE, profilePictureUrl: 'https://i.pravatar.cc/150?u=judge1' },
  { id: 'judge2', name: 'Judge Simon', email: 'simon@pec.ac.in', role: Role.JUDGE, profilePictureUrl: 'https://i.pravatar.cc/150?u=judge2' },

  // Website Admin
  { id: 'admin1', name: 'Admin User', email: 'admin@pec.ac.in', role: Role.WEBSITE_ADMIN, profilePictureUrl: 'https://i.pravatar.cc/150?u=admin1' },
];

let events: Event[] = [
    { id: 'event1', name: 'Solo Singing', category: EventCategory.ARTS, description: 'A melodious solo singing competition to find the voice of PEC.', rules: 'One song per participant. Max duration 5 minutes.', eventType: EventType.NORMAL, assignedJudgeIds: ['judge1'], date: new Date('2024-09-10T10:00:00') },
    { id: 'event2', name: '100m Sprint', category: EventCategory.SPORTS, description: 'A 100-meter sprint race for the fastest athletes.', rules: 'Standard athletic rules apply. Spikes are allowed.', eventType: EventType.NORMAL, maxParticipants: 8, assignedJudgeIds: ['judge2'], date: new Date('2024-09-11T14:00:00') },
    { id: 'event3', name: 'Group Dance', category: EventCategory.ARTS, description: 'A dynamic group dance competition showcasing teamwork and choreography.', rules: 'Team of 4-8 members. Performance duration 5-7 minutes.', eventType: EventType.PERMISSION_REQUIRED, assignedJudgeIds: ['judge1'], date: new Date('2024-09-12T18:00:00') },
    { id: 'event4', name: 'Chess Tournament', category: EventCategory.SPORTS, description: 'A competitive chess tournament for the sharpest minds.', rules: 'Swiss-system tournament with 5 rounds. Touch-move rule applies.', eventType: EventType.PERMISSION_REQUIRED, assignedJudgeIds: ['judge2'], date: new Date('2024-09-13T09:00:00') },
    { id: 'event5', name: 'Oil Painting', category: EventCategory.ARTS, description: 'An on-the-spot oil painting event to unleash creativity.', rules: 'Theme will be given on the spot. Canvas and basic colors provided.', eventType: EventType.NORMAL, assignedJudgeIds: ['judge1'], date: new Date('2024-09-14T11:00:00') },
];

let registrations: Registration[] = [
    { id: 'reg1', eventId: 'event1', studentId: 'student1', status: RegistrationStatus.REGISTERED, score: 85 },
    { id: 'reg2', eventId: 'event2', studentId: 'student2', status: RegistrationStatus.REGISTERED, score: 92 },
    { id: 'reg3', eventId: 'event3', studentId: 'student1', status: RegistrationStatus.APPROVED, score: 88 },
    { id: 'reg4', eventId: 'event3', studentId: 'student5', status: RegistrationStatus.PENDING },
    { id: 'reg5', eventId: 'event4', studentId: 'student3', status: RegistrationStatus.REJECTED },
    { id: 'reg6', eventId: 'event1', studentId: 'student2', status: RegistrationStatus.REGISTERED, score: 78 },
];

const generateId = () => `reg${Date.now()}`;

const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- API Service Implementation ---

export const apiService = {
  async login(email: string, pass: string): Promise<User | null> {
    await networkDelay(500);
    const user = users.find(u => u.email === email);
    // Password check is omitted for this mock service
    return user ? {...user} : null;
  },

  async getLeaderboard(year: number): Promise<LeaderboardData> {
    await networkDelay(300);
    // In a real app, you'd filter by year. Here we ignore it.
    const scoresByHouse: { [key in House]: number } = {
      [House.RED]: 0,
      [House.BLUE]: 0,
      [House.GREEN]: 0,
      [House.YELLOW]: 0,
    };

    registrations.forEach(reg => {
      if (reg.score) {
        const student = users.find(u => u.id === reg.studentId);
        if (student && student.house) {
          scoresByHouse[student.house] += reg.score;
        }
      }
    });

    return {
      year,
      scores: Object.entries(scoresByHouse).map(([house, score]) => ({ house: house as House, score })),
    };
  },

  async getEvents(): Promise<Event[]> {
    await networkDelay(200);
    return [...events];
  },

  async getRegistrationStatus(eventId: string, studentId: string): Promise<RegistrationStatus | null> {
    await networkDelay(50);
    const registration = registrations.find(r => r.eventId === eventId && r.studentId === studentId);
    return registration ? registration.status : null;
  },

  async registerForEvent(eventId: string, studentId: string, eventType: EventType): Promise<boolean> {
    await networkDelay(400);
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");

    if (event.maxParticipants) {
        const currentParticipants = registrations.filter(r => r.eventId === eventId && (r.status === RegistrationStatus.APPROVED || r.status === RegistrationStatus.REGISTERED)).length;
        if (currentParticipants >= event.maxParticipants) {
            return false; // Event is full
        }
    }

    const newRegistration: Registration = {
      id: generateId(),
      eventId,
      studentId,
      status: eventType === EventType.NORMAL ? RegistrationStatus.REGISTERED : RegistrationStatus.PENDING,
    };
    registrations.push(newRegistration);
    return true;
  },

  async getStudentRegistrations(studentId: string): Promise<(Registration & { event: Event | undefined })[]> {
    await networkDelay(300);
    return registrations
      .filter(r => r.studentId === studentId)
      .map(reg => ({
        ...reg,
        event: events.find(e => e.id === reg.eventId),
      }));
  },

  async getPendingRequests(house: House): Promise<(Registration & { student?: User, event?: Event })[]> {
    await networkDelay(400);
    const studentIdsInHouse = users.filter(u => u.house === house).map(u => u.id);
    return registrations
      .filter(r => r.status === RegistrationStatus.PENDING && studentIdsInHouse.includes(r.studentId))
      .map(reg => ({
        ...reg,
        student: users.find(u => u.id === reg.studentId),
        event: events.find(e => e.id === reg.eventId),
      }));
  },

  async updateRegistrationStatus(registrationId: string, approve: boolean): Promise<void> {
    await networkDelay(300);
    const registration = registrations.find(r => r.id === registrationId);
    if (registration) {
      registration.status = approve ? RegistrationStatus.APPROVED : RegistrationStatus.REJECTED;
    }
  },

  async getJudgeEvents(judgeId: string): Promise<Event[]> {
    await networkDelay(200);
    return events.filter(e => e.assignedJudgeIds.includes(judgeId));
  },

  async getEventParticipants(eventId: string): Promise<(Registration & { student?: User })[]> {
    await networkDelay(300);
    return registrations
      .filter(r => r.eventId === eventId && (r.status === RegistrationStatus.APPROVED || r.status === RegistrationStatus.REGISTERED))
      .map(reg => ({
        ...reg,
        student: users.find(u => u.id === reg.studentId),
      }));
  },

  async submitScores(eventId: string, scoreUpdates: { registrationId: string, score: number }[]): Promise<void> {
    await networkDelay(500);
    scoreUpdates.forEach(update => {
      const registration = registrations.find(r => r.id === update.registrationId);
      if (registration) {
        registration.score = update.score;
      }
    });
  },

  async getAllUsers(): Promise<User[]> {
      await networkDelay(200);
      return [...users];
  },
  
  async updateProfilePicture(userId: string, imageUrl: string): Promise<User | null> {
    await networkDelay(600);
    const userIndex = users.findIndex(u => u.id === userId);
    if(userIndex > -1) {
        users[userIndex].profilePictureUrl = imageUrl;
        return {...users[userIndex]};
    }
    return null;
  }
};