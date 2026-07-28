export enum Answer {
    YES = "Yes",
    NO = "No",
    I_DONT_KNOW = "I Don't Know",
}

// Answer values from the pre-v3 5-value scale. They no longer appear in new
// games but still exist in old game documents' message history.
export const LegacyAnswerValues: string[] = ["Probably Yes", "Probably No"];
