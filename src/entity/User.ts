import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";

import { Invitation } from "./Invitation";
import { Task } from "./Task";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToOne(() => Invitation, (invitation) => invitation.user, {
    cascade: true,
  })
  invitation: Invitation;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
