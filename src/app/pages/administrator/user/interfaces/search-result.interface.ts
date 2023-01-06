import { User } from "../models/user.model";

export interface SearchResult {
  users: User[];
  total: number;
}
