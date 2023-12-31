import { Prisma, Exercise, Muscle, Equipment } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ExercisesRepository } from '../exercises-repository'

export class InMemoryExercisesRepository implements ExercisesRepository {
  public items: Exercise[] = []

  async getAll(userId: string) {
    return this.items.filter((exercise) => {
      return exercise.userId === userId || exercise.userId === null;
    });
  }

  async findById(id: string) {
    const exercise = this.items.find((item) => item.id === id)

    if (!exercise) {
      return null
    }

    return exercise
  }

  async searchByName(query: string, userId: string) {
    return this.items.filter((item) => item.name.includes(query) && item.userId === userId);
  }

  async searchByTarget(muscle: Muscle) {

    // GL with that - see bellow

    return []
  }

  async create(data: Prisma.ExerciseUncheckedCreateInput) {
    const exercise = {
      id: randomUUID(),
      name: data.name,
      equipment: data.equipment,
      unilateral: data.unilateral ?? false,
      userId: data.userId ?? null,
      // targets: {
      //   create:
      //     [data.targets]
      // }
    }

    // no targets created in-memory

    this.items.push(exercise)

    return exercise
  }

  async delete(id: string) {

    const index = this.items.findIndex((item) => item.id === id)

    if (index === -1) {
      return false
    }

    this.items.splice(index, 1)
    return true

  }

  async update(id: string, data: Prisma.ExerciseUncheckedUpdateInput) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    const existingExercise = this.items[index];
    const updatedExercise = {
      ...existingExercise,
      ...data,
    } as Exercise;

    this.items[index] = updatedExercise;

    return updatedExercise;
  }

  async doesExerciseAlreadyExist(name: string, equipment: Equipment, unilateral?: boolean) {

    const normalizedUnilateral = unilateral !== undefined ? unilateral : false;

    const exercise = this.items.find(exercise => {
      return exercise.name === name && exercise.equipment === equipment && exercise.unilateral === normalizedUnilateral;
    });

    if (exercise) {
      return true;
    }

    return false;
  }
}
