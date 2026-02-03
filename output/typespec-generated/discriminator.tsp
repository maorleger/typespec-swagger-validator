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
