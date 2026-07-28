// Per-category knowledge sources for the Study Buddy helper. Keys are
// TOP-LEVEL category names (subcategories resolve through parentName), so
// adding a documentation source for a new topic is a config change only.
export type HelperSource = {
    mcpUrl: string;
};

export const HelperSources: Record<string, HelperSource> = {
    "Azure Services": { mcpUrl: "https://learn.microsoft.com/api/mcp" },
};

export function helperSourceFor(category: { name: string; parentName?: string | null }): HelperSource | undefined {
    return HelperSources[category.parentName ?? category.name];
}
