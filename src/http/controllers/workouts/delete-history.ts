
import { makeDeleteUserWorkoutsHistoryUseCase } from '@/use-cases/factories/workouts/make-delete-user-workout-history-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function deleteWorkoutHistory(request: FastifyRequest, reply: FastifyReply) {
    try {
        const deleteUserWorkoutsHistoryUseCase = makeDeleteUserWorkoutsHistoryUseCase();

        const isDeleted = await deleteUserWorkoutsHistoryUseCase.execute({
            userId: request.user.sub,
        });

        if (isDeleted.success) {
            return reply.status(200).send({ message: 'All user workouts deleted successfully 👌' });
        } else {
            return reply.status(404).send({ message: 'User workouts not found or already deleted 🤷' });
        }
    } catch (error) {
        console.error('Error deleting user workouts history:', error);
        return reply.status(500).send({ message: 'Internal server error' });
    }
}