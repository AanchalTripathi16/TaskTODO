export interface TaskViewModel {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface TaskCollectionResponse {
  items: TaskViewModel[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TaskListProps {
  tasks: TaskViewModel[];
  isMutating: boolean;
  onToggle: (taskId: string) => Promise<void>;
  query?: string;
}

export interface TaskFormProps {
  onSubmit: (title: string) => Promise<void>;
  isBusy: boolean;
}

export interface TaskDashboardProps {
  initialData: TaskCollectionResponse;
  initialQuery: string;
}

export interface TaskItemProps {
  task: TaskViewModel;
  onToggle: (taskId: string) => Promise<void>;
  disabled: boolean;
}

export interface TaskEmptyStateProps {
  query?: string;
}

export interface PaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export interface TaskSearchProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  disabled?: boolean;
}
