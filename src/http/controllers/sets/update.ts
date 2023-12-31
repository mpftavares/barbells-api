import { makeUpdateSetUseCase } from "@/use-cases/factories/sets/make-update-set-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updateSet(request: FastifyRequest<{ Params: { setId: string } }>, reply: FastifyReply) {

    const updateSetParamsSchema = z.object({
        number: z.number({
            required_error: "Set number is required",
            invalid_type_error: "Set number must be a number",
        }).positive(),
        weight: z.optional(z.number().positive()),
        reps: z.number({
            required_error: "Reps is required",
            invalid_type_error: "Reps must be a number",
        }).positive()
    })

    const { number, weight, reps } = updateSetParamsSchema.parse(request.body)

    const id = request.params.setId

    const updateSetUseCase = makeUpdateSetUseCase()

    await updateSetUseCase.execute({
        id,
        number,
        weight,
        reps,
    })
    return reply.status(204).send();
}