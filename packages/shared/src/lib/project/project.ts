import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema, Nullable } from '../common/base-model'
import { ApId } from '../common/id-generator'

export const ListProjectRequestForUserQueryParams = Type.Object({
    cursor: Type.Optional(Type.String()),
    limit: Type.Optional(Type.Number()),
})

export type ListProjectRequestForUserQueryParams = Static<typeof ListProjectRequestForUserQueryParams>

export type ProjectId = ApId

export enum NotificationStatus {
    NEVER = 'NEVER',
    ALWAYS = 'ALWAYS',
}

export const ProjectUsage = Type.Object({
    tasks: Type.Number(),
    teamMembers: Type.Number(),
})

export type ProjectUsage = Static<typeof ProjectUsage>

export type ProjectPlanId = string

export const ProjectPlan = Type.Object({
    ...BaseModelSchema,
    projectId: Type.String(),
    stripeCustomerId: Type.String(),
    stripeSubscriptionId: Nullable(Type.String()),
    subscriptionStartDatetime: Type.String(),
    flowPlanName: Type.String(),
    minimumPollingInterval: Type.Number(),
    connections: Type.Number(),
    teamMembers: Type.Number(),
    tasks: Type.Number(),
    tasksPerDay: Nullable(Type.Number()),
})

export type ProjectPlan = Static<typeof ProjectPlan>


export const Project = Type.Object({
    ...BaseModelSchema,
    deleted: Nullable(Type.String()),
    ownerId: Type.String(),
    displayName: Type.String(),
    notifyStatus: Type.Enum(NotificationStatus),
    platformId: ApId,
    externalId: Type.Optional(Type.String()),
})

export type Project = Static<typeof Project>

export const ProjectWithLimits = Type.Composite([
    Type.Omit(Project, ['deleted']),
    Type.Object({
        usage: ProjectUsage,
        plan: ProjectPlan,
    }),

])

export type ProjectWithLimits = Static<typeof ProjectWithLimits>
