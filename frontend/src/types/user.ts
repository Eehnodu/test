export interface BaseUser {
  user_nickname: string;
  user_email: string;
  created_at: string;
  last_login_at: string;
  active: boolean;
  user_profile_image: string;
}

export interface ContextUser {
  user: BaseUser | null;
}

export interface ContextAll extends ContextUser {
  meData: BaseUser | null;
}

export interface BaseUser {
  user_nickname: string;
  user_email: string;
  created_at: string;
  last_login_at: string;
  user_profile_image: string;
}

export interface UserRow extends BaseUser {
  id: number;
}

export interface UserResponse {
  data: UserRow[];
  total: number;
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export interface Admin {
  admin_email: string;
  admin_password: string;
  auth_type: string;
}
