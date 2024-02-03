import { MigrationInterface, QueryRunner } from "typeorm";

import { User, UserRole } from "../entity/User";

export class CreateAdmin1706874900482 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User();
    user.email = "admin@gmail.com";
    user.password = "admin";
    user.hashPassword();
    user.role = UserRole.ADMIN;
    const userRepository = queryRunner.manager.getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
