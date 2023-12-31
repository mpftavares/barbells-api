import { ExercisesRepository } from "@/repositories/exercises-repository";
import { FailedToDeleteResourceError } from "../errors/failed-to-delete-resource.error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteExerciseUseCaseRequest {
    exerciseId: string
}

interface DeleteExerciseUseCaseResponse {
    success: boolean
}

export class DeleteExerciseUseCase {

    constructor(private exercisesRepository: ExercisesRepository) { }

    async execute({
        exerciseId
    }: DeleteExerciseUseCaseRequest): Promise<DeleteExerciseUseCaseResponse> {
        const exercise = await this.exercisesRepository.findById(exerciseId);

        if (!exercise) {
            throw new ResourceNotFoundError();
        }

        const isExerciseDeleted = await this.exercisesRepository.delete(exerciseId);

        if (!isExerciseDeleted) {
            throw new FailedToDeleteResourceError()
        }

        return {
            success: isExerciseDeleted,
        };
    }
}
