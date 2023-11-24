import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@/lib/prisma";
import { createTemplate } from "@/utils/test/create-template";

describe('Update Template Use Case (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to update template', async () => {

        const { token } = await createAndAuthenticateUser(app);

        const user = await prisma.user.findFirstOrThrow();

        const template = await createTemplate(user)

        const newTimestamp = new Date('2023-07-15T08:30:00Z');

        const updateTemplateResponse = await request(app.server)
            .put(`/templates/${template.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: template.id,
                name: 'prettier template name',
            });

        expect(updateTemplateResponse.statusCode).toEqual(204);

        const updatedTemplate = await prisma.template.findFirstOrThrow({
            where: {
                id: template.id,
            },
        });

        expect(updatedTemplate.name).toBe('prettier template name');
    });
})