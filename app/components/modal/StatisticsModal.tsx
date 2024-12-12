import { Statistics } from "@/model/Statistics";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatisticsModal() {
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const onInit = async () => {
        const response = await fetch("/api/statistics");
        const data = await response.json();
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
    };

    useEffect(() => {
        onInit();
    }, []);

    const pieData = {
        datasets: [
            {
                data: [statistics?.totalAIWins || 0, statistics?.totalHumanWins || 0],
                backgroundColor: ['#FFC864', '#ADD8E6'],
                hoverBackgroundColor: ['#FFC864', '#ADD8E6'],
            },
        ],
    };

    const iconPlugin = {
        id: 'iconPlugin',
        afterDraw: (chart: Chart) => {
            const ctx = chart.ctx;
            const humanIcon = new Image();
            const aiIcon = new Image();
            humanIcon.src = 'images/user-icon.png'; // Replace with the path to your human icon
            aiIcon.src = 'images/assistant-icon.png'; // Replace with the path to your AI icon

            const dataset = chart.getDatasetMeta(0).data;

            const humanElement = dataset[1].getProps(['x', 'y', 'startAngle', 'endAngle', 'outerRadius']);
            const aiElement = dataset[0].getProps(['x', 'y', 'startAngle', 'endAngle', 'outerRadius']);

            const humanAngle = (humanElement.startAngle + humanElement.endAngle) / 2;
            const aiAngle = (aiElement.startAngle + aiElement.endAngle) / 2;

            const humanX = humanElement.x + (Math.cos(humanAngle) * (humanElement.outerRadius / 2));
            const humanY = humanElement.y + (Math.sin(humanAngle) * (humanElement.outerRadius / 2));
            const aiX = aiElement.x + (Math.cos(aiAngle) * (aiElement.outerRadius / 2));
            const aiY = aiElement.y + (Math.sin(aiAngle) * (aiElement.outerRadius / 2));

            ctx.drawImage(humanIcon, humanX - 20, humanY - 20, 40, 40); // Adjust the size as needed
            ctx.drawImage(aiIcon, aiX - 20, aiY - 20, 40, 40); // Adjust the size as needed
        }
    };

    const pieOptions = {
        plugins: {
            tooltip: {
                enabled: false
            },
            iconPlugin: {} // Enable the custom plugin
        }
    };

    return (
        <div className="statistics p-4">
            <h1 className="text-3xl font-bold mb-4">Statistics</h1>
            {!loading && !error ? (
                <>
                    <h2 className="box-orange p-4 text-2xl text-center flex items-center justify-between">
                        <FontAwesomeIcon icon={faChartSimple} className="icon-margin" />
                        General Statistics
                        <FontAwesomeIcon icon={faChartSimple} className="icon-margin" />
                    </h2>
                    <div className="flex m-4 justify-center">
                        <div className="w-4/5 md:w-1/2">
                            <Pie data={pieData} options={pieOptions} plugins={[iconPlugin]} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 m-4">
                        <p className="col-span-1 text-xl font-bold"><span className="hidden sm:inline">Total </span>Finished:</p>
                        <p className="text-xl font-bold">{statistics?.totalGames ? statistics?.totalGames + " Games" : "no value"}</p>
                        <p className="col-span-1 text-xl font-bold"><span className="hidden sm:inline">Total </span>Player Wins:</p>
                        <p className="text-xl font-bold">{statistics?.totalHumanWins ? statistics?.totalHumanWins + " Games" : "no value"}</p>
                        <p className="col-span-1 text-xl font-bold"><span className="hidden sm:inline">Total </span>AI Wins:</p>
                        <p className="text-xl font-bold">{statistics?.totalAIWins ? statistics?.totalAIWins + " Games" : "no value"}</p>
                        <p className="col-span-1 text-xl font-bold"><span className="hidden sm:inline">Total </span>Given-Up:</p>
                        <p className="text-xl font-bold">{statistics?.totalGivenUp ? statistics?.totalGivenUp + " Games" : "no value"}</p>
                        <h3 className="col-span-2 text-xl font-bold">Questions used to win: (Player)</h3>
                        <p className="col-span-1">Low:</p>
                        <p>{statistics?.minQuestionCountHuman && statistics?.minQuestionCountHuman > 0 ? statistics?.minQuestionCountHuman + " Questions" : "no value"}</p>
                        <p className="col-span-1">Max:</p>
                        <p>{statistics?.maxQuestionCountHuman ? statistics?.maxQuestionCountHuman + " Questions" : "no value"}</p>
                        <p className="col-span-1">Average:</p>
                        <p>{statistics?.avgQuestionCountHuman ? statistics?.avgQuestionCountHuman.toFixed(1) + " Questions" : "no value"}</p>
                        <p className="col-span-1">Median:</p>
                        <p>{statistics?.medQuestionCountHuman ? statistics?.medQuestionCountHuman + " Questions" : "no value"}</p>
                        <h3 className="col-span-2 text-xl font-bold">Questions used to win: (AI)</h3>
                        <p className="col-span-1">Low:</p>
                        <p>{statistics?.minQuestionCountAI && statistics?.minQuestionCountAI > 0 ? statistics?.minQuestionCountAI + " Questions" : "no value"}</p>
                        <p className="col-span-1">Max:</p>
                        <p>{statistics?.maxQuestionCountAI ? statistics?.maxQuestionCountAI + " Questions" : "no value"}</p>
                        <p className="col-span-1">Average:</p>
                        <p>{statistics?.avgQuestionCountAI ? statistics?.avgQuestionCountAI + " Questions" : "no value"}</p>
                        <p className="col-span-1">Median:</p>
                        <p>{statistics?.medQuestionCountAI ? statistics?.medQuestionCountAI + " Questions" : "no value"}</p>
                    </div>
                    {statistics?.winsByCategory?.map((categoryWins) => (
                        <>
                            <h3 className="box-blue text-xl text-center text-white flex items-center justify-between font-bold">
                                <FontAwesomeIcon icon={categoryWins.category.icon} className="icon-margin" />
                                {categoryWins.category.name}
                                <FontAwesomeIcon icon={categoryWins.category.icon} className="icon-margin" />
                            </h3>
                            <div className="grid grid-cols-2 gap-1 m-4">
                                <p className="col-span-1 text-xl font-bold">Player Wins:</p>
                                <p className="text-xl font-bold">{categoryWins.humanWins ? categoryWins.humanWins + " Wins" : "no value"}</p>
                                <p className="col-span-1 text-xl font-bold">AI Wins:</p>
                                <p className="text-xl font-bold">{categoryWins.aiWins ? categoryWins.aiWins + " Wins" : "no value"}</p>
                                <h3 className="col-span-2 text-xl font-bold">Questions used to win: (Human)</h3>
                                <p className="col-span-1">Low:</p>
                                <p>{categoryWins.minQuestionCountHuman && categoryWins.minQuestionCountHuman > 0 ? categoryWins.minQuestionCountHuman + " Questions" : "no value"}</p>
                                <p className="col-span-1">Max:</p>
                                <p>{categoryWins.maxQuestionCountHuman ? categoryWins.maxQuestionCountHuman + " Questions" : "no value"}</p>
                                <p className="col-span-1">Average:</p>
                                <p>{categoryWins.avgQuestionCountHuman ? categoryWins.avgQuestionCountHuman.toFixed(1) + " Questions" : "no value"}</p>
                                <p className="col-span-1">Median:</p>
                                <p>{categoryWins.medQuestionCountHuman ? categoryWins.medQuestionCountHuman + " Questions" : "no value"}</p>
                                <h3 className="col-span-2 text-xl font-bold">Questions used to win: (AI)</h3>
                                <p className="col-span-1">Low:</p>
                                <p>{categoryWins.minQuestionCountAI && categoryWins.minQuestionCountAI > 0 ? categoryWins.minQuestionCountAI + " Questions" : "no value"}</p>
                                <p className="col-span-1">Max:</p>
                                <p>{categoryWins.maxQuestionCountAI ? categoryWins.maxQuestionCountAI + " Questions" : "no value"}</p>
                                <p className="col-span-1">Average:</p>
                                <p>{categoryWins.avgQuestionCountAI ? categoryWins.avgQuestionCountAI.toFixed(1) + " Questions" : "no value"}</p>
                                <p className="col-span-1">Median:</p>
                                <p>{categoryWins.medQuestionCountAI ? categoryWins.medQuestionCountAI + " Questions" : "no value"}</p>
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
            )
            }
        </div >
    )
}