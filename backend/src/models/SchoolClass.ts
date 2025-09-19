import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity() export class SchoolClass {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) name!: string;
  @Column() shift!: 'MATUTINO'|'VESPERTINO';
  @Column({ default: false }) hasContraturno!: boolean;
}
