// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  createDiscriminatorRepro,
  DiscriminatorReproContext,
  DiscriminatorReproClientOptionalParams,
} from "./api/index.js";
import { getFilter } from "./api/operations.js";
import { GetFilterOptionalParams } from "./api/options.js";
import { CharFilterUnion } from "./models/models.js";
import { Pipeline } from "@azure/core-rest-pipeline";

export { DiscriminatorReproClientOptionalParams } from "./api/discriminatorReproContext.js";

export class DiscriminatorReproClient {
  private _client: DiscriminatorReproContext;
  /** The pipeline used by this client to make requests */
  public readonly pipeline: Pipeline;

  constructor(endpointParam: string, options: DiscriminatorReproClientOptionalParams = {}) {
    const prefixFromOptions = options?.userAgentOptions?.userAgentPrefix;
    const userAgentPrefix = prefixFromOptions
      ? `${prefixFromOptions} azsdk-js-client`
      : `azsdk-js-client`;
    this._client = createDiscriminatorRepro(endpointParam, {
      ...options,
      userAgentOptions: { userAgentPrefix },
    });
    this.pipeline = this._client.pipeline;
  }

  getFilter(options: GetFilterOptionalParams = { requestOptions: {} }): Promise<CharFilterUnion> {
    return getFilter(this._client, options);
  }
}
