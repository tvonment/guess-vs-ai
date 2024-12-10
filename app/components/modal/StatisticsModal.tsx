import { Statistics } from "@/model/Statistics";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function StatisticsModal() {
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const onInit = async () => {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        console.log(data.result);
        if (data.result) {
            setStatistics(data.result as Statistics);
            setLoading(false);
            return;
        } else if (!response.ok && data.error) {
            setError(data.error);
            setLoading(false);
            return;
        } else {
            setError("An unknown error occurred");
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        onInit();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Statistics</h1>
            {!loading && !error ? (
                <>
                    <h2 className="box-orange p-4 text-2xl text-center  flex items-center justify-between">
                        <FontAwesomeIcon icon={faChartSimple} className="icon-margin" />
                        General Statistics
                        <FontAwesomeIcon icon={faChartSimple} className="icon-margin" />
                    </h2>
                    <div className="grid grid-cols-3 gap-1 m-4">
                        <p className="col-span-2">Total Finished Games:</p>
                        <p>{statistics?.totalGames || "no value"}</p>
                        <p className="col-span-2">Total AI Wins:</p>
                        <p>{statistics?.totalAIWins || "no value"}</p>
                        <p className="col-span-2">Total Human Wins:</p>
                        <p>{statistics?.totalHumanWins || "no value"}</p>
                        <p className="col-span-2">Min. Questions Human:</p>
                        <p>{statistics?.minQuestionCountHuman || "no value"}</p>
                        <p className="col-span-2">Min. Questions AI:</p>
                        <p>{statistics?.minQuestionCountAI || "no value"}</p>
                        <p className="col-span-2">Max. Questions Human:</p>
                        <p>{statistics?.maxQuestionCountHuman || "no value"}</p>
                        <p className="col-span-2">Max. Questions AI:</p>
                        <p>{statistics?.maxQuestionCountAI || "no value"}</p>
                        <p className="col-span-2">Avg. Questions Human:</p>
                        <p>{statistics?.avgQuestionCountHuman || "no value"}</p>
                        <p className="col-span-2">Avg. Questions AI:</p>
                        <p>{statistics?.avgQuestionCountAI || "no value"}</p>
                        <p className="col-span-2">Median Questions Human:</p>
                        <p>{statistics?.medQuestionCountHuman || "no value"}</p>
                        <p className="col-span-2">Median Questions AI:</p>
                        <p>{statistics?.medQuestionCountAI || "no value"}</p>
                        <p className="col-span-2">Total Given-Up games:</p>
                        <p>{statistics?.totalGivenUp || "no value"}</p>
                    </div>
                    {statistics?.winsByCategory?.map((categoryWins) => (
                        <>
                            <h3 className="box-blue text-xl text-center text-white flex items-center justify-between">
                                <FontAwesomeIcon icon={categoryWins.category.icon} className="icon-margin" />
                                {categoryWins.category.name}
                                <FontAwesomeIcon icon={categoryWins.category.icon} className="icon-margin" />
                            </h3>
                            <div className="grid grid-cols-3 gap-1 m-4">
                                <p className="col-span-2">Human Wins:</p>
                                <p>{categoryWins.humanWins || "no value"}</p>
                                <p className="col-span-2">AI Wins:</p>
                                <p>{categoryWins.aiWins || "no value"}</p>
                                <p className="col-span-2">Avg. Questions Human:</p>
                                <p>{categoryWins.avgQuestionCountHuman || "no value"}</p>
                                <p className="col-span-2">Avg. Questions AI:</p>
                                <p>{categoryWins.avgQuestionCountAI || "no value"}</p>
                            </div>
                        </>
                    ))}
                </>
            ) : loading ? (
                <p className="center-spinner">
                    <span className="loading-spinner"></span>
                </p>
            ) : (
                <p className="text-red">{error}</p>
            )}
        </div>
    )
}