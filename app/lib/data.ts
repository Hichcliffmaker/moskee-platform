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

export const MOCK_STUDENTS: Student[] = [
    {
        id: "ST-2024-001",
        firstName: "Bilal",
        lastName: "El Amrani",
        group: "Groep 4 (Koran - Hifz)",
        dob: "2015-04-12",
        parentName: "Ahmed El Amrani",
        phone: "06-12345678",
        status: "active",
        badges: [
            { id: 'b1', name: 'Hifz Held', icon: '👑', color: '#ffd700', description: 'Juz 30 compleet', date: '2025-12-01' },
            { id: 'b2', name: 'Vroege Vogel', icon: '🌅', color: '#81c784', description: 'Altijd op tijd', date: '2026-01-10' }
        ]
    },
    {
        id: "ST-2024-002",
        firstName: "Amina",
        lastName: "Bakker",
        group: "Groep 3 (Basis Arabisch)",
        dob: "2016-08-22",
        parentName: "Fatima Bakker",
        phone: "06-87654321",
        status: "active",
        badges: []
    },
    {
        id: "ST-2024-003",
        firstName: "Youssef",
        lastName: "Benali",
        group: "Groep 8 (Fiqh Advanced)",
        dob: "2011-02-15",
        parentName: "Karim Benali",
        phone: "06-11223344",
        status: "active",
        badges: [
            { id: 'b3', name: 'Fiqh Expert', icon: '📜', color: '#64b5f6', description: 'Alle toetsen gehaald', date: '2026-01-05' }
        ]
    },
    {
        id: "ST-2024-004",
        firstName: "Sara",
        lastName: "Jansen",
        group: "Groep 4 (Koran - Hifz)",
        dob: "2015-11-05",
        parentName: "Omar Jansen",
        phone: "06-55667788",
        status: "inactive",
        badges: []
    },
    {
        id: "ST-2024-005",
        firstName: "Ibrahim",
        lastName: "Demir",
        group: "Groep 5 (Tafsir)",
        dob: "2014-06-30",
        parentName: "Mehmet Demir",
        phone: "06-99887766",
        status: "active",
        badges: []
    },
];

export type Group = {
    id: string;
    name: string;
    teacher: string;
    room: string;
    schedule: string;
    studentsCount: number;
};

export const MOCK_GROUPS: Group[] = [
    {
        id: "GR-001",
        name: "Groep 1 (Basis)",
        teacher: "Ustadha Fatima",
        room: "Lokaal 1.02",
        schedule: "Zaterdag 10:00 - 13:00",
        studentsCount: 24,
    },
    {
        id: "GR-002",
        name: "Groep 3 (Basis Arabisch)",
        teacher: "Ustadh Ali",
        room: "Lokaal 1.04",
        schedule: "Zondag 10:00 - 13:00",
        studentsCount: 18,
    },
    {
        id: "GR-003",
        name: "Groep 4 (Koran - Hifz)",
        teacher: "Sheikh Mohammed",
        room: "Gebedsruimte",
        schedule: "Za & Zo 14:00 - 16:00",
        studentsCount: 12,
    },
    {
        id: "GR-004",
        name: "Groep 5 (Fiqh)",
        teacher: "Ustadh Ahmed",
        room: "Lokaal 2.01",
        schedule: "Zaterdag 13:30 - 15:30",
        studentsCount: 15,
    },
    {
        id: "GR-005",
        name: "Groep 8 (Fiqh Advanced)",
        teacher: "Sheikh Mohammed",
        room: "Lokaal 2.02",
        schedule: "Vrijdag 19:00 - 21:00",
        studentsCount: 8,
    },
];

export type Homework = {
    id: string;
    groupId: string;
    groupName: string;
    subject: string;
    title: string;
    dueDate: string;
    description: string;
};

export const MOCK_HOMEWORK: Homework[] = [
    {
        id: "HW-101",
        groupId: "GR-003",
        groupName: "Groep 4 (Koran - Hifz)",
        subject: "Koran",
        title: "Surah Al-Mulk 1-15",
        dueDate: "2026-01-20",
        description: "Memoriseren van de eerste 15 verzen. Let op je Tajweed."
    },
    {
        id: "HW-102",
        groupId: "GR-002",
        groupName: "Groep 3 (Basis Arabisch)",
        subject: "Arabisch",
        title: "Oefening 4: De letters Ta en Tha",
        dueDate: "2026-01-21",
        description: "Werkboek pagina 12 maken en de letters 3 regels schrijven."
    },
    {
        id: "HW-103",
        groupId: "GR-004",
        groupName: "Groep 5 (Fiqh)",
        subject: "Fiqh",
        title: "Samenvatting Wudu",
        dueDate: "2026-01-24",
        description: "Schrijf een korte samenvatting van de stappen van Wudu."
    },
];

export type AgendaItem = {
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'lesson' | 'event' | 'holiday';
    description: string;
};

export const MOCK_AGENDA: AgendaItem[] = [
    { id: "EV-001", title: "Ouderavond Groep 1-4", date: "2026-01-20", time: "19:00", type: "event", description: "Bespreking voortgang" },
    { id: "EV-002", title: "Koran Competitie Finale", date: "2026-02-15", time: "14:00", type: "event", description: "In de grote gebedszaal" },
    { id: "EV-003", title: "Voorjaarsvakantie", date: "2026-02-22", time: "00:00", type: "holiday", description: "Geen les" },
    { id: "EV-004", title: "Tentamenweek", date: "2026-03-10", time: "10:00", type: "lesson", description: "Alle groepen" },
];

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

export const MOCK_QURAN_PROGRESS: QuranProgress[] = [
    { id: "QP-001", studentId: "ST-2024-001", date: "2026-01-10", hifzGoal: "Pagina 10", hifzCompleted: true, murajaahGoal: "Surah Yasin", murajaahCompleted: true, mistakes: 0 },
    { id: "QP-002", studentId: "ST-2024-001", date: "2026-01-11", hifzGoal: "Pagina 11", hifzCompleted: false, murajaahGoal: "Surah Yasin", murajaahCompleted: true, mistakes: 2 },
    { id: "QP-003", studentId: "ST-2024-004", date: "2026-01-10", hifzGoal: "Surah Al-Mulk 1-10", hifzCompleted: true, murajaahGoal: "Juz 30", murajaahCompleted: false, mistakes: 1 },
];
