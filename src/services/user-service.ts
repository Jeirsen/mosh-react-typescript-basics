import create from "./http-service";
create;

export interface User {
  id: number;
  name: string;
}

export default create("/users");
