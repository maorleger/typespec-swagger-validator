import * as coreClient from "@azure/core-client";

export type CharFilterUnion =
  | CharFilter
  | MappingCharFilter
  | PatternReplaceCharFilter;

/** Base type for character filters. */
export interface CharFilter {
  /** Polymorphic discriminator, which specifies the different types this object can be */
  odataType:
    | "#Microsoft.Azure.Search.MappingCharFilter"
    | "#Microsoft.Azure.Search.PatternReplaceCharFilter";
  name: string;
}

/** A character filter that applies mappings. */
export interface MappingCharFilter extends CharFilter {
  /** Polymorphic discriminator, which specifies the different types this object can be */
  odataType: "#Microsoft.Azure.Search.MappingCharFilter";
  mappings: string[];
}

/** A character filter that replaces characters. */
export interface PatternReplaceCharFilter extends CharFilter {
  /** Polymorphic discriminator, which specifies the different types this object can be */
  odataType: "#Microsoft.Azure.Search.PatternReplaceCharFilter";
  pattern: string;
}

/** Optional parameters. */
export interface GetFilterOptionalParams extends coreClient.OperationOptions {}

/** Contains response data for the getFilter operation. */
export type GetFilterResponse = CharFilterUnion;

/** Optional parameters. */
export interface DiscriminatorReproOptionalParams
  extends coreClient.ServiceClientOptions {
  /** server parameter */
  $host?: string;
  /** Overrides client endpoint. */
  endpoint?: string;
}
