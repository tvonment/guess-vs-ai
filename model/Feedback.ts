export class Feedback {
    id: string;
    userId: string;
    overallRating: number;
    aiDifficulty: string;
    aiFairness: string;
    gameLength: string;
    overallEnjoyment: string;
    additionalComments: string;

    constructor(
        id: string,
        userId: string,
        overallRating: number,
        aiDifficulty: string,
        aiFairness: string,
        gameLength: string,
        overallEnjoyment: string,
        additionalComments: string
    ) {
        this.id = id;
        this.userId = userId;
        this.overallRating = overallRating;
        this.aiDifficulty = aiDifficulty;
        this.aiFairness = aiFairness;
        this.gameLength = gameLength;
        this.overallEnjoyment = overallEnjoyment;
        this.additionalComments = additionalComments;
    }
}