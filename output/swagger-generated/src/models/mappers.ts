import * as coreClient from "@azure/core-client";

export const CharFilter: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "CharFilter",
    uberParent: "CharFilter",
    polymorphicDiscriminator: {
      serializedName: "@odata\\.type",
      clientName: "odataType",
    },
    modelProperties: {
      odataType: {
        serializedName: "@odata\\.type",
        required: true,
        type: {
          name: "String",
        },
      },
      name: {
        serializedName: "name",
        required: true,
        type: {
          name: "String",
        },
      },
    },
  },
};

export const MappingCharFilter: coreClient.CompositeMapper = {
  serializedName: "#Microsoft.Azure.Search.MappingCharFilter",
  type: {
    name: "Composite",
    className: "MappingCharFilter",
    uberParent: "CharFilter",
    polymorphicDiscriminator: CharFilter.type.polymorphicDiscriminator,
    modelProperties: {
      ...CharFilter.type.modelProperties,
      mappings: {
        serializedName: "mappings",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String",
            },
          },
        },
      },
    },
  },
};

export const PatternReplaceCharFilter: coreClient.CompositeMapper = {
  serializedName: "#Microsoft.Azure.Search.PatternReplaceCharFilter",
  type: {
    name: "Composite",
    className: "PatternReplaceCharFilter",
    uberParent: "CharFilter",
    polymorphicDiscriminator: CharFilter.type.polymorphicDiscriminator,
    modelProperties: {
      ...CharFilter.type.modelProperties,
      pattern: {
        serializedName: "pattern",
        required: true,
        type: {
          name: "String",
        },
      },
    },
  },
};

export let discriminators = {
  CharFilter: CharFilter,
  "CharFilter.#Microsoft.Azure.Search.MappingCharFilter": MappingCharFilter,
  "CharFilter.#Microsoft.Azure.Search.PatternReplaceCharFilter":
    PatternReplaceCharFilter,
};
