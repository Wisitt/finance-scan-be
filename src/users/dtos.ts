export class CreateUserDto {
  name: string;
  email?: string;
  avatar_url?: string;
  google_id?: string;
  last_login?: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  avatar_url?: string;
  google_id?: string;
  last_login?: string;
}
