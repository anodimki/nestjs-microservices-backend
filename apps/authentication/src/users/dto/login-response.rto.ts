export class LoginResponseRto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  constructor(partial: Partial<LoginResponseRto>) {
    Object.assign(this, partial);
  }
}