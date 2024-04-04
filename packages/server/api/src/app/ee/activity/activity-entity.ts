import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'
import { Activity, ACTIVITY_EVENT_LENGTH, ACTIVITY_MESSAGE_LENGTH, ACTIVITY_STATUS_LENGTH } from '@activepieces/ee-shared'
import { Project } from '@activepieces/shared'

type ActivitySchema = Activity & {
    project: Project
}

export const ActivityEntity = new EntitySchema<ActivitySchema>({
    name: 'activity',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
            nullable: false,
        },
        event: {
            type: String,
            nullable: false,
            length: ACTIVITY_EVENT_LENGTH,
        },
        message: {
            type: String,
            nullable: false,
            length: ACTIVITY_MESSAGE_LENGTH,
        },
        status: {
            type: String,
            nullable: false,
            length: ACTIVITY_STATUS_LENGTH,
        },
    },
    indices: [
        {
            name: 'idx_activity_project_id_created_desc',
            columns: ['projectId', 'created'],
            unique: false,
        },
    ],
    relations: {
        project: {
            type: 'many-to-one',
            target: 'project',
            cascade: true,
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE',
            joinColumn: {
                name: 'projectId',
                foreignKeyConstraintName: 'fk_activity_project_id',
            },
        },
    },
})
