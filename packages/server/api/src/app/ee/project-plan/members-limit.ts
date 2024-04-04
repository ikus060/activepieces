import { getEdition } from '../../helper/secret-helper'
import { projectMemberService } from '../project-members/project-member.service'
import { projectLimitsService } from './project-plan.service'
import {
    ActivepiecesError,
    ApEdition,
    ErrorCode,
    ProjectId,
} from '@activepieces/shared'

export const projectMembersLimit = {
    async limit({ projectId }: { projectId: ProjectId }): Promise<void> {
        const edition = getEdition()
        if (![ApEdition.CLOUD, ApEdition.ENTERPRISE].includes(edition)) {
            return
        }
        const projectPlan = await projectLimitsService.getPlanByProjectId(projectId)
        if (!projectPlan) {
            return
        }
        const numberOfMembers = await projectMemberService.countTeamMembersIncludingOwner(projectId)

        if (numberOfMembers > projectPlan.teamMembers) {
            throw new ActivepiecesError({
                code: ErrorCode.QUOTA_EXCEEDED,
                params: {
                    metric: 'team-members',
                    quota: projectPlan.teamMembers,
                },
            })
        }
    },
}
