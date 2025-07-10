export interface Account {
  id: number;
  name: string;
  email: string;
  img_url: string;
}

export type OpponentAccount = Pick<Account, "id" | "name" | "img_url">;
