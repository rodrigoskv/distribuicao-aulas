import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity() export class Teacher {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column({ unique: true }) email!: string;
  @Column({ default: 0 }) maxWeeklyLoad!: number;
  @Column({ type: 'text', default: '' }) subjectCodes!: string; // "PORT,MAT"


  @Column({ default: false }) availableMorning!: boolean;
  @Column({ default: false }) availableAfternoon!: boolean;
  @Column({ default: false }) availableCounterShift!: boolean;
  }
