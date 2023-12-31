import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createExercise } from '@/utils/test/create-exercise'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Volume By Date Range (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get workout volume by date range', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const exercise = await createExercise(user)

        await prisma.workout.create({
            data: {
                name: 'test workout',
                timestamp: new Date('2023-11-20'),
                userId: user.id,
                sets: {
                    create: [
                        { number: 1, exerciseId: exercise.id, reps: 10, weight: 10 },
                        { number: 2, exerciseId: exercise.id, reps: 10, weight: 10 },
                        { number: 3, exerciseId: exercise.id, reps: 10, weight: 10 },
                    ]
                },
            }
        })

        await prisma.workout.create({
            data: {
                name: 'test workout',
                timestamp: new Date('2023-11-21'),
                userId: user.id,
                sets: {
                    create: [
                        { number: 1, exerciseId: exercise.id, reps: 10, weight: 10 },
                        { number: 2, exerciseId: exercise.id, reps: 10, weight: 10 },
                        { number: 3, exerciseId: exercise.id, reps: 10, weight: 10 },
                    ]
                },
            }
        })

        await prisma.workout.create({
            data: {
                name: 'test workout',
                timestamp: new Date('2023-11-23'),
                userId: user.id,
                sets: {
                    create: [
                        { number: 1, exerciseId: exercise.id, reps: 10, weight: 10 },
                        { number: 2, exerciseId: exercise.id, reps: 10, weight: 10 },
                        { number: 3, exerciseId: exercise.id, reps: 10, weight: 10 },
                    ]
                },
            }
        })

        const from = '2023-11-20'
        const to = '2023-11-21'
        const muscle = 'glutes'

        const response = await request(app.server)
            .get(`/workouts/search-by-date/volume`)
            .query({
                from,
                to,
                muscle
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.volume).toBe(1200)  // 2 * 3 * 10 * 10 * 2 giving utils data
    })


})
