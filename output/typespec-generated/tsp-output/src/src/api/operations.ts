// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DiscriminatorReproContext as Client } from "./index.js";
import { charFilterUnionDeserializer, CharFilterUnion } from "../models/models.js";
import { GetFilterOptionalParams } from "./options.js";
import {
  StreamableMethod,
  PathUncheckedResponse,
  createRestError,
  operationOptionsToRequestParameters,
} from "@azure-rest/core-client";

export function _getFilterSend(
  context: Client,
  options: GetFilterOptionalParams = { requestOptions: {} },
): StreamableMethod {
  return context
    .path("/filters")
    .get({
      ...operationOptionsToRequestParameters(options),
      headers: { accept: "application/json", ...options.requestOptions?.headers },
    });
}

export async function _getFilterDeserialize(
  result: PathUncheckedResponse,
): Promise<CharFilterUnion> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return charFilterUnionDeserializer(result.body);
}

export async function getFilter(
  context: Client,
  options: GetFilterOptionalParams = { requestOptions: {} },
): Promise<CharFilterUnion> {
  const result = await _getFilterSend(context, options);
  return _getFilterDeserialize(result);
}
