export interface IBookFormData  {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  
};



export interface IBook {
  _id?: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: {
    name: string;
    email: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}