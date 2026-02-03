// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This file contains only generated model types and their (de)serializers.
 * Disable the following rules for internal models with '_' prefix and deserializers which require 'any' for raw JSON input.
 */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/** Base type for character filters. */
export interface CharFilter {
  /** The discriminator for derived types. */
  /** The discriminator possible values: #Microsoft.Azure.Search.MappingCharFilter, #Microsoft.Azure.Search.PatternReplaceCharFilter */
  odataType: string;
  name: string;
}

export function charFilterDeserializer(item: any): CharFilter {
  return {
    odataType: item["@odata.type"],
    name: item["name"],
  };
}

/** Alias for CharFilterUnion */
export type CharFilterUnion = MappingCharFilter | PatternReplaceCharFilter | CharFilter;

export function charFilterUnionDeserializer(item: any): CharFilterUnion {
  switch (item.odataType) {
    case "#Microsoft.Azure.Search.MappingCharFilter":
      return mappingCharFilterDeserializer(item as MappingCharFilter);

    case "#Microsoft.Azure.Search.PatternReplaceCharFilter":
      return patternReplaceCharFilterDeserializer(item as PatternReplaceCharFilter);

    default:
      return charFilterDeserializer(item);
  }
}

/** A character filter that applies mappings. */
export interface MappingCharFilter extends CharFilter {
  odataType: "#Microsoft.Azure.Search.MappingCharFilter";
  mappings: string[];
}

export function mappingCharFilterDeserializer(item: any): MappingCharFilter {
  return {
    odataType: item["@odata.type"],
    name: item["name"],
    mappings: item["mappings"].map((p: any) => {
      return p;
    }),
  };
}

/** A character filter that replaces characters. */
export interface PatternReplaceCharFilter extends CharFilter {
  odataType: "#Microsoft.Azure.Search.PatternReplaceCharFilter";
  pattern: string;
}

export function patternReplaceCharFilterDeserializer(item: any): PatternReplaceCharFilter {
  return {
    odataType: item["@odata.type"],
    name: item["name"],
    pattern: item["pattern"],
  };
}
