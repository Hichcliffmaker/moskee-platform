export type Badge = {
    id: string;
    name: string;
    icon: string; // Emoji or image url
    color: string;
    description: string;
    date: string;
};

export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    group: string; // e.g., "Groep 3 (Koran)", "Groep 5 (Fiqh)"
    dob: string;
    parentName: string;
    phone: string;
    email?: string;
    address?: string;
    status: 'active' | 'inactive';
    badges: Badge[];
};

export type Group = {
    id: string;
    name: string;
    teacher: string;
    room: string;
    schedule: string;
    studentsCount: number;
    type?: string; // e.g. 'Koran', 'Arabisch', 'Overig'
};

export type Homework = {
    id: string;
    groupId: string;
    groupName: string;
    subject: string;
    title: string;
    dueDate: string;
    description: string;
};

export type AgendaItem = {
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'lesson' | 'event' | 'holiday';
    description: string;
    // status?: 'upcoming' | 'past';
};

export type QuranProgress = {
    id: string;
    studentId: string;
    date: string;
    hifzGoal: string; // e.g. "Pagina 4-5"
    hifzCompleted: boolean;
    murajaahGoal: string; // e.g. "Juz 1"
    murajaahCompleted: boolean;
    mistakes: number;
};
