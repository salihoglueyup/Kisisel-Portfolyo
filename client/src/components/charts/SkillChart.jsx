import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

const data = [
    { subject: 'AI / RAG', A: 90, fullMark: 100 },
    { subject: 'Backend', A: 88, fullMark: 100 },
    { subject: 'Frontend', A: 85, fullMark: 100 },
    { subject: 'Güvenlik', A: 78, fullMark: 100 },
    { subject: 'Veri', A: 80, fullMark: 100 },
    { subject: 'DevOps', A: 72, fullMark: 100 },
];

const SkillChart = () => {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Yetenek Seviyesi"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="#3b82f6"
                        fillOpacity={0.4}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        itemStyle={{ color: '#60a5fa' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillChart;