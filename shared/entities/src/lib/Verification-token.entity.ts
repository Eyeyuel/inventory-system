import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TokenType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
}

@Entity()
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  //   @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  //   user: User;

  @Column()
  email!: string;

  @Column()
  tokenHash!: string;

  @Column({ type: 'enum', enum: TokenType })
  type!: TokenType;

  @Column()
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
