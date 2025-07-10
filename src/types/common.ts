/**
 * Standard interface for select/dropdown options with value and label fields
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Interface for pagination state
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total?: number;
}

export type ListItem<T> = T extends Array<infer U> ? U : never;
