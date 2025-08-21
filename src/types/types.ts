export interface Option {
  text: string;
  eliminated: boolean;
}

export interface Category {
  id: string;
  label: string;
  options: Option[];
  fixed?: boolean;
}
