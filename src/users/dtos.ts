export class CreateUserDto {
  name: string;
  email?: string;
  avatar_url?: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  avatar_url?: string;
}
