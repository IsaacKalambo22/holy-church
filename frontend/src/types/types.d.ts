declare global {
  interface AuthCredentials {
    fullName: string;
    email: string;
    password?: string;
    verificationToken?: string;
  }

  interface PaymentMethod {
    methodId: string;
    type: string;
    lastFour: string;
    expiry: string;
  }

  interface UserSettings {
    theme?: 'light' | 'dark';
    emailAlerts?: boolean;
    smsAlerts?: boolean;
    courseNotifications?: boolean;
    notificationFrequency?:
      | 'immediate'
      | 'daily'
      | 'weekly';
  }

  enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    USER = 'USER',
    STUDENT = 'STUDENT',
  }

  enum AccountType {
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    DIAMOND = 'DIAMOND',
    PRO = 'PRO',
  }

  interface User {
    id: string;
    email: string;
    phoneNumber: string;
    name: string;
    avatar?: string;
    district?: string;
    about?: string;
    role: Role;
    lastLogin?: string;
    isVerified?: boolean;
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: string;
    verificationToken?: string;
    verificationTokenExpiresAt?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Student {
    id: string;
    userId: string;
    user: User;
    age: number;
    contactInfo?: string;
    gender?: Gender;
    backgroundSummary?: string;
    initialAssessment?: string;
    aptitudesAndStrengths?: string;
    shortTermGoals?: string;
    longTermObjectives?: string;
    workshopsAttended?: string;
    resourcesUtilized?: string;
    skillsDevelopment?: string;
    behavioralChanges?: string;
    feedbackAndSelfReflection?: string;
    obstaclesEncountered?: string;
    interventionsProvided?: string;
    accountType: AccountType;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Course {
    id: string;
    userId: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    isPublished: boolean;
    teacherName: string;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    attachments?: Attachment[];
    chapters?: Chapter[];
  }

  interface ChapterCourseProgress {
    chapter: Chapter;
    course: Course;
    attachments: Attachment[];
    nextChapter: Chapter;
    userProgress: UserChapterProgress;
    purchasedCourse: Transaction;
  }

  interface CourseProgress {
    id: string;
    userId: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    isPublished: boolean;
    teacherName: string;
    createdAt: string;
    updatedAt: string;
    category: Category;
    attachments?: Attachment[];
    chapters: Chapter[];
    progress: number | null;
  }

  interface UserCourseProgress {
    completedCourses: CourseProgress[];
    coursesInProgress: CourseProgress[];
  }
  interface Attachment {
    id: string;
    name: string;
    url: string;
    courseId: string;
    createdAt: string;
  }

  interface Chapter {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
    content?: string;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    courseId: string;
    createdAt: string;
    userProgress: UserChapterProgress[];
  }
  interface UserChapterProgress {
    id: string;
    userId: string;
    chapterId: string;
    isCompleted: boolean;
    createdAt: string;
  }

  interface Category {
    id: string;
    name: string;
  }

  interface Gallery {
    id: string;
    caption: string;
    imageUrls: string[];
    date: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Transaction {
    userId: string;
    transactionId: string;
    dateTime: string;
    courseId: string;
    paymentProvider: 'stripe';
    paymentMethodId: string;
    amount: number; // Stored in cents
    savePaymentMethod?: boolean;
  }

  interface DateRange {
    from: string | undefined;
    to: string | undefined;
  }

  interface UserCourseProgress {
    userId: string;
    courseId: string;
    enrollmentDate: string;
    overallProgress: number;
    sections: SectionProgress[];
    lastAccessedTimestamp: string;
  }

  type CreateUserArgs = Omit<User, 'userId'>;
  type CreateCourseArgs = Omit<
    Course,
    'courseId'
  >;
  type CreateTransactionArgs = Omit<
    Transaction,
    'transactionId'
  >;

  interface CourseCardProps {
    course: Course;
    onGoToCourse: (course: Course) => void;
  }

  interface TeacherCourseCardProps {
    course: Course;
    isOwner: boolean;
    onGoToCourse: (course: Course) => void;
  }

  interface Comment {
    commentId: string;
    userId: string;
    text: string;
    timestamp: string;
  }

  interface ChapterProgress {
    id: string;
    completed: boolean;
  }

  interface SectionProgress {
    id: string;
    chapters: ChapterProgress[];
  }

  interface Section {
    id: string;
    title: string;
    sectionDescription?: string;
    chapters: Chapter[];
  }

  interface WizardStepperProps {
    currentStep: number;
  }

  interface AccordionSectionsProps {
    sections: Section[];
  }

  interface SearchCourseCardProps {
    course: Course;
    isSelected?: boolean;
    onClick?: () => void;
  }

  interface CoursePreviewProps {
    course: Course;
  }

  interface CustomFixedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
  }

  interface HeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: ReactNode;
  }

  interface SharedNotificationSettingsProps {
    title?: string;
    subtitle?: string;
  }

  interface SelectedCourse {
    course: Course;
    handleEnrollNow: (courseId: string) => void;
  }

  interface ToolbarProps {
    onSearch: (search: string) => void;
    onCategoryChange: (category: string) => void;
  }

  interface ChapterModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionIndex: number | null;
    chapterIndex: number | null;
    sections: Section[];
    setSections: React.Dispatch<
      React.SetStateAction<Section[]>
    >;
    courseId: string;
  }

  interface SectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionIndex: number | null;
    sections: Section[];
    setSections: React.Dispatch<
      React.SetStateAction<Section[]>
    >;
  }

  interface DroppableComponentProps {
    sections: Section[];
    setSections: (sections: Section[]) => void;
    handleEditSection: (index: number) => void;
    handleDeleteSection: (index: number) => void;
    handleAddChapter: (
      sectionIndex: number
    ) => void;
    handleEditChapter: (
      sectionIndex: number,
      chapterIndex: number
    ) => void;
    handleDeleteChapter: (
      sectionIndex: number,
      chapterIndex: number
    ) => void;
  }

  interface CourseFormData {
    courseTitle: string;
    images: File[];
    courseDescription: string;
    courseCategory: string;
    coursePrice: number;
    courseStatus: boolean;
  }

  interface ActionType {
    label: string;
    icon: string;
    value: string;
  }
  enum Category {
    DESTINY = 'Destiny',
    SUCCESS = 'Success',
    IDENTITY = 'Identity',
    PURPOSE_OF_EXISTENCE = 'Purpose of existence',
  }
}

export {};
