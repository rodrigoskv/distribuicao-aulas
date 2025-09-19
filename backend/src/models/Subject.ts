import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity() export class Subject {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) code!: string;
  @Column() name!: string;
  @Column({ default: 1 }) weeklyDefault!: number;
}
