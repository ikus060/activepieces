import { PieceMetadataModel, PieceMetadataModelSummary, PieceMetadataSchema } from '../piece-metadata-entity'
import { FastDbPieceMetadataService } from './db-piece-metadata-service'
import { FilePieceMetadataService } from './file-piece-metadata-service'
import { PieceMetadataService } from './piece-metadata-service'
import { PiecesSource, system, SystemProp } from '@activepieces/server-shared'
import {
    assertNotNullOrUndefined,
    PackageType,
    PiecePackage,
    PrivatePiecePackage,
    PublicPiecePackage,
    SuggestionType,
} from '@activepieces/shared'

const initPieceMetadataService = (): PieceMetadataService => {
    const source = system.getOrThrow<PiecesSource>(SystemProp.PIECES_SOURCE)
    switch (source) {
        case PiecesSource.DB:
        case PiecesSource.CLOUD_AND_DB:
            return FastDbPieceMetadataService()
        case PiecesSource.FILE:
            return FilePieceMetadataService()
    }
}

export const pieceMetadataService = initPieceMetadataService()

export const getPiecePackage = async (
    projectId: string,
    pkg: PublicPiecePackage | Omit<PrivatePiecePackage, 'archiveId'>,
): Promise<PiecePackage> => {
    switch (pkg.packageType) {
        case PackageType.ARCHIVE: {
            const pieceMetadata = await pieceMetadataService.getOrThrow({
                name: pkg.pieceName,
                version: pkg.pieceVersion,
                projectId,
            })
            return {
                packageType: PackageType.ARCHIVE,
                pieceName: pkg.pieceName,
                pieceVersion: pkg.pieceVersion,
                pieceType: pkg.pieceType,
                archiveId: pieceMetadata.archiveId!,
            }
        }
        case PackageType.REGISTRY: {
            return pkg
        }
    }
}

export function toPieceMetadataModelSummary<T extends PieceMetadataSchema | PieceMetadataModel>(
    pieceMetadataEntityList: T[],
    originalMetadataList: T[],
    suggestionType?: SuggestionType,
): PieceMetadataModelSummary[] {
    return pieceMetadataEntityList.map((pieceMetadataEntity) => {
        const originalMetadata = originalMetadataList.find((p) => p.name === pieceMetadataEntity.name)
        assertNotNullOrUndefined(originalMetadata, `Original metadata not found for ${pieceMetadataEntity.name}`)
        return {
            ...pieceMetadataEntity,
            actions: Object.keys(originalMetadata.actions).length,
            triggers: Object.keys(originalMetadata.triggers).length,
            suggestedActions: suggestionType === SuggestionType.ACTION || suggestionType === SuggestionType.ACTION_AND_TRIGGER ?
                Object.values(pieceMetadataEntity.actions) : undefined,
            suggestedTriggers: suggestionType === SuggestionType.TRIGGER  || suggestionType === SuggestionType.ACTION_AND_TRIGGER ?
                Object.values(pieceMetadataEntity.triggers) : undefined,
        }
    })
}
