import React, { useEffect, useState } from 'react';

const ActivityMap = () => {
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);

    const username = "salihoglueyup";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
                const data = await response.json();

                if (data && data.contributions) {
                    const chunkedWeeks = [];
                    let currentMonth = null;

                    for (let i = 0; i < data.contributions.length; i += 7) {
                        const weekData = data.contributions.slice(i, i + 7);
                        const firstDayDate = new Date(weekData[0].date);
                        const monthName = firstDayDate.toLocaleString('en-US', { month: 'short' });

                        let label = "";
                        if (monthName !== currentMonth) {
                            label = monthName;
                            currentMonth = monthName;
                        }

                        chunkedWeeks.push({
                            days: weekData,
                            label: label
                        });
                    }
                    setWeeks(chunkedWeeks);
                }
            } catch (error) {
                console.error("Veri çekilemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    const getLevelColor = (level) => {
        switch (level) {
            case 0: return 'bg-slate-800';
            case 1: return 'bg-blue-900';
            case 2: return 'bg-blue-700';
            case 3: return 'bg-blue-500';
            case 4: return 'bg-blue-300';
            default: return 'bg-slate-800';
        }
    };

    return (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 backdrop-blur-sm w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-300 font-mono text-sm uppercase tracking-wider">
                    Kodlama Aktivitesi (Son 1 Yıl)
                </h3>
                <span className="text-xs text-gray-500 hidden sm:block">GitHub: {username}</span>
            </div>

            <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
                {loading ? (
                    <div className="h-32 flex items-center justify-center text-blue-400 animate-pulse text-sm">
                        Veriler yükleniyor...
                    </div>
                ) : (
                    <div className="flex gap-1 w-max">
                        {weeks.map((week, wIndex) => (
                            <div key={wIndex} className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-400 h-4 w-3 overflow-visible whitespace-nowrap">
                                    {week.label}
                                </span>

                                {week.days.map((day, dIndex) => (
                                    <div
                                        key={dIndex}
                                        className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} hover:ring-1 hover:ring-white transition-all`}
                                        title={`${day.date}: ${day.count} katkı`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end items-center gap-2 mt-3 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-slate-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-900"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-300"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityMap;