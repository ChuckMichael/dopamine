import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { IndexablePath } from './indexable-path';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import {TrackRepositoryBase} from "../../data/repositories/track-repository.base";

@Injectable()
export class CollectionChecker {
    public constructor(
        private indexablePathFetcher: IndexablePathFetcher,
        private trackRepository: TrackRepositoryBase,
        private logger: Logger,
    ) {}

    public async isCollectionOutdatedAsync(): Promise<boolean> {
        let collectionIsOutdated: boolean = false;

        try {
            const numberOfDatabaseTracksThatNeedIndexing: number = this.trackRepository.getNumberOfTracksThatNeedIndexing();
            const indexablePathsOnDisk: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
            const numberOfDatabaseTracks: number = this.trackRepository.getNumberOfTracks();
            const lastDateFileModifiedInDatabase: number = this.trackRepository.getMaximumDateFileModified();
            const lastDateFileModifiedOnDisk: number = this.getLastDateFileModifiedOnDisk(indexablePathsOnDisk);

            const tracksNeedIndexing: boolean = numberOfDatabaseTracksThatNeedIndexing > 0;
            const numberOfTracksHasChanged: boolean = numberOfDatabaseTracks !== indexablePathsOnDisk.length;
            const lastDateModifiedHasChanged: boolean = lastDateFileModifiedInDatabase < lastDateFileModifiedOnDisk;

            collectionIsOutdated = tracksNeedIndexing || numberOfTracksHasChanged || lastDateModifiedHasChanged;

            this.logger.info(
                `collectionIsOutdated=${collectionIsOutdated}, tracksNeedIndexing=${tracksNeedIndexing}, numberOfTracksHasChanged=${numberOfTracksHasChanged}, lastDateModifiedHasChanged=${lastDateModifiedHasChanged}`,
                'CollectionChecker',
                'isCollectionOutdatedAsync',
            );
        } catch (e: unknown) {
            this.logger.error(
                e,
                'An error occurred while checking if collection is outdated',
                'CollectionChecker',
                'isCollectionOutdatedAsync',
            );
        }

        return collectionIsOutdated;
    }

    private getLastDateFileModifiedOnDisk(indexablePathsOnDisk: IndexablePath[]): number {
        if (indexablePathsOnDisk.length <= 1) {
            return 0;
        }

        const indexablePathsSortedByDateModifiedTicksDescending: IndexablePath[] = indexablePathsOnDisk.sort((a, b) =>
            a.dateModifiedTicks > b.dateModifiedTicks ? -1 : 1,
        );

        return indexablePathsSortedByDateModifiedTicksDescending[0].dateModifiedTicks;
    }
}
