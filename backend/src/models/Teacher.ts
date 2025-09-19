import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity() export class Teacher {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column({ unique: true }) email!: string;
  @Column({ default: 0 }) maxWeeklyLoad!: number;
  @Column({ type: 'text', default: '' }) subjectCodes!: string; // comma-separated for simplicity here
}
