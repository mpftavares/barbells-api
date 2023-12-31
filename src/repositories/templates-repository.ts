import { Prisma, Template } from "@prisma/client";

export interface TemplatesRepository {
    findById(id: string): Promise<Template | null>
    getAll(userId: string): Promise<Template[]>
    create(data: Prisma.TemplateUncheckedCreateInput): Promise<Template>
    delete(id: string): Promise<boolean>
    update(id: string, data: Prisma.TemplateUncheckedUpdateInput): Promise<Template | null>
    doesTemplateAlreadyExist(name: string): Promise<boolean>

}