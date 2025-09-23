import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
@Entity() export class WeeklyLoad {
  @PrimaryGeneratedColumn() id!: number;
  @Column() schoolClassId!: number;
  @Column() subjectCode!: string;
  @Column() hoursPerWeek!: number;
}