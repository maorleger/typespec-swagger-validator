# Discriminator Type Difference: Swagger vs TypeSpec

## Problem

When migrating from Swagger to TypeSpec, the discriminator property type changes from a **union of literal types** to just **`string`**.

> The issue is described below; however, I also created a minimal repro example to illustrate the problem. You can review the `output` and `examples` folders for generated TypeScript code from both Swagger (using Autorest) and TypeSpec.

**Before (Swagger/Autorest):**

```typescript
interface CharFilter {
  odatatype:
    | "#Microsoft.Azure.Search.MappingCharFilter"
    | "#Microsoft.Azure.Search.PatternReplaceCharFilter";
  name: string;
}
```

**After (TypeSpec):**

```typescript
interface CharFilter {
  odatatype: string;
  name: string;
}
```

This is a breaking change for TypeScript users who relied on the union type for type safety.

---

## Minimal Swagger (OpenAPI 2.0)

```json
{
  "swagger": "2.0",
  "info": {
    "title": "Discriminator Repro",
    "version": "1.0.0"
  },
  "paths": {
    "/filters": {
      "get": {
        "operationId": "getFilter",
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/CharFilter"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "CharFilter": {
      "type": "object",
      "description": "Base type for character filters.",
      "discriminator": "@odata.type",
      "required": ["@odata.type", "name"],
      "properties": {
        "@odata.type": {
          "type": "string",
          "description": "The discriminator for derived types."
        },
        "name": {
          "type": "string"
        }
      }
    },
    "MappingCharFilter": {
      "type": "object",
      "description": "A character filter that applies mappings.",
      "x-ms-discriminator-value": "#Microsoft.Azure.Search.MappingCharFilter",
      "allOf": [{ "$ref": "#/definitions/CharFilter" }],
      "required": ["mappings"],
      "properties": {
        "mappings": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "PatternReplaceCharFilter": {
      "type": "object",
      "description": "A character filter that replaces characters.",
      "x-ms-discriminator-value": "#Microsoft.Azure.Search.PatternReplaceCharFilter",
      "allOf": [{ "$ref": "#/definitions/CharFilter" }],
      "required": ["pattern"],
      "properties": {
        "pattern": {
          "type": "string"
        }
      }
    }
  }
}
```

---

## Equivalent TypeSpec

```typespec
import "@typespec/http";
import "@typespec/rest";
import "@azure-tools/typespec-azure-core";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{
  title: "Discriminator Repro",
})
namespace DiscriminatorRepro;

@route("/filters")
@get
op getFilter(): CharFilter;

/** Base type for character filters. */
@discriminator("@odata.type")
model CharFilter {
  /** The discriminator for derived types. */
  #suppress "@azure-tools/typespec-azure-core/no-string-discriminator" "Existing"
  `@odata.type`: string;

  name: string;
}

/** A character filter that applies mappings. */
model MappingCharFilter extends CharFilter {
  `@odata.type`: "#Microsoft.Azure.Search.MappingCharFilter";
  mappings: string[];
}

/** A character filter that replaces characters. */
model PatternReplaceCharFilter extends CharFilter {
  `@odata.type`: "#Microsoft.Azure.Search.PatternReplaceCharFilter";
  pattern: string;
}
```

---

## Expected vs Actual Generated TypeScript

### Expected (matches Swagger/Autorest behavior)

The base type's discriminator should be a union of all known discriminator values:

```typescript
export interface CharFilter {
  "@odata.type":
    | "#Microsoft.Azure.Search.MappingCharFilter"
    | "#Microsoft.Azure.Search.PatternReplaceCharFilter";
  name: string;
}

export interface MappingCharFilter extends CharFilter {
  "@odata.type": "#Microsoft.Azure.Search.MappingCharFilter";
  mappings: string[];
}

export interface PatternReplaceCharFilter extends CharFilter {
  "@odata.type": "#Microsoft.Azure.Search.PatternReplaceCharFilter";
  pattern: string;
}
```

### Actual (TypeSpec-generated)

The base type's discriminator is just `string`:

```typescript
export interface CharFilter {
  "@odata.type": string; // <-- Should be union of literal types
  name: string;
}

export interface MappingCharFilter extends CharFilter {
  "@odata.type": "#Microsoft.Azure.Search.MappingCharFilter"; // Correct
  mappings: string[];
}

export interface PatternReplaceCharFilter extends CharFilter {
  "@odata.type": "#Microsoft.Azure.Search.PatternReplaceCharFilter"; // Correct
  pattern: string;
}
```

---

## Why This Matters

1. **Type Safety**: Users lose autocomplete and type checking for the discriminator value
2. **Breaking Change**: Existing code that pattern-matches on the discriminator union will fail to compile
3. **API Contract**: Both Swagger and TypeSpec represent the same API, so they should generate equivalent types

---

## Notes

- The TypeSpec uses `#suppress "@azure-tools/typespec-azure-core/no-string-discriminator"` which explicitly allows `string` as the discriminator type
- The derived types correctly narrow the discriminator to literal types
- The issue is that the base type's discriminator should be computed as the union of all derived type discriminator values

---

## Source Files

- **Original Swagger**: https://github.com/Azure/azure-rest-api-specs/blob/main/specification/search/data-plane/Search/preview/2025-11-01-preview/search.json
- **Original TypeSpec**: https://github.com/Azure/azure-rest-api-specs/blob/main/specification/search/data-plane/Search/models-service.tsp
