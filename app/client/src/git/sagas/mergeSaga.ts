import { captureException } from "@sentry/react";
import mergeRequest from "git/requests/mergeRequest";
import type { MergeResponse } from "git/requests/mergeRequest.types";
import type { MergeInitPayload } from "git/store/actions/mergeActions";
import { gitArtifactActions } from "git/store/gitArtifactSlice";
import { selectGitApiContractsEnabled } from "git/store/selectors/gitFeatureFlagSelectors";
import type { GitArtifactPayloadAction } from "git/store/types";
import log from "loglevel";
import { call, put, select } from "redux-saga/effects";
import { validateResponse } from "sagas/ErrorSagas";

export default function* mergeSaga(
  action: GitArtifactPayloadAction<MergeInitPayload>,
) {
  const { artifactDef, artifactId } = action.payload;
  let response: MergeResponse | undefined;

  try {
    const params = {
      sourceBranch: action.payload.sourceBranch,
      destinationBranch: action.payload.destinationBranch,
    };

    const isGitApiContractsEnabled: boolean = yield select(
      selectGitApiContractsEnabled,
    );

    response = yield call(
      mergeRequest,
      artifactDef.artifactType,
      artifactId,
      params,
      isGitApiContractsEnabled,
    );

    const isValidResponse: boolean = yield validateResponse(response);

    if (isValidResponse) {
      yield put(gitArtifactActions.mergeSuccess({ artifactDef }));
    }
  } catch (e) {
    if (response?.responseMeta.error) {
      const { error } = response.responseMeta;

      yield put(gitArtifactActions.mergeError({ artifactDef, error }));
    } else {
      log.error(e);
      captureException(e);
    }
  }
}
