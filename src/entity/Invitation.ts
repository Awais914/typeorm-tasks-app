import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  OneToOne,
} from "typeorm";

import { User } from "./User";

@Entity()
@Unique(["inviteeEmail"])
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ nullable: false })
  inviteeEmail: string;

  @Column()
  expiresAt: Date;

  @OneToOne(() => User, (user) => user.invitation)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
