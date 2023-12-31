import { InMemoryWorkoutsRepository } from '@/repositories/in-memory/in-memory-workouts-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchWorkoutsByDateUseCase } from './search-by-date'


let workoutsRepository: InMemoryWorkoutsRepository
let sut: SearchWorkoutsByDateUseCase

describe('User Workout History Use Case', () => {
    beforeEach(async () => {
        workoutsRepository = new InMemoryWorkoutsRepository()
        sut = new SearchWorkoutsByDateUseCase(workoutsRepository)
    })

    it('should be able to fetch user workout history', async () => {

        await workoutsRepository.create({
            name: 'test workout',
            timestamp: new Date('2023-11-20'),
            userId: 'user-01'
        })

        await workoutsRepository.create({
            name: 'another test workout',
            timestamp: new Date('2023-11-28'),
            userId: 'user-01'
        })

        await workoutsRepository.create({
            name: 'one more test workout',
            timestamp: new Date('2023-11-21'),
            userId: 'user-01'
        })

        const { workouts } = await sut.execute({
            userId: 'user-01',
            startDate: '2023-11-20',
            endDate: '2023-11-21',
        })

        expect(workouts).toHaveLength(2)
    })
})
