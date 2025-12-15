
export enum Role {
    STUDENT = 'Student',
    HOUSE_ADMIN = 'House Admin',
    JUDGE = 'Judge',
    WEBSITE_ADMIN = 'Website Admin',
}

export enum House {
    RED = 'Red',
    BLUE = 'Blue',
    GREEN = 'Green',
    YELLOW = 'Yellow',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    house?: House;
    profilePictureUrl?: string;
}

export enum EventCategory {
    ARTS = 'Arts',
    SPORTS = 'Sports',
}

export enum EventType {
    NORMAL = 'Normal',
    PERMISSION_REQUIRED = 'Permission Required',
}

export interface Event {
    id: string;
    name: string;
    category: EventCategory;
    description: string;
    rules: string;
    eventType: EventType;
    maxParticipants?: number;
    assignedJudgeIds: string[];
    date: Date;
}

export enum RegistrationStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
    REGISTERED = 'Registered',
}

export interface Registration {
    id: string;
    eventId: string;
    studentId: string;
    status: RegistrationStatus;
    score?: number;
}

export interface HouseScore {
    house: House;
    score: number;
}

export interface LeaderboardData {
    year: number;
    scores: HouseScore[];
}