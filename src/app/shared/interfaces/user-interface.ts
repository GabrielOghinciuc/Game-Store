export interface UserDataBaseInterface {
  id?: string;
  username: string;
  password?: string;
  email: string;
  fullName: string;
  birthDate: Date;
  joinedOn: Date;
  lastLogin: Date;
  isClient: boolean;
  isGameDeveloper: boolean;
  isAdmin: boolean;
  profilePicture: string;
  boughtGames?: any[];
}
