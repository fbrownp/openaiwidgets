import './barplot.css';
import { Button, Card, Chart, Row, Select, Text } from './CustomComponents';

type MetricOption = {
    label: string;
    value: string;
};

type RowData = {
    period: string;
    [key: string]: number | string;
};

type Props = {
    title: string;
    metricOptions: MetricOption[];
    selectedMetric: string;
    rows: RowData[];
    onMetricChange?: (value: string) => void;
};

export default function BarplotWidget({
    title,
    metricOptions,
    selectedMetric,
    rows,
    onMetricChange,
}: Props) {
    console.log('BarplotWidget rendering:', { title, selectedMetric, rowCount: rows.length });

    // Handler for expand button
    const handleExpand = async () => {
        try {
            if (typeof window !== 'undefined' && window.openai?.requestDisplayMode) {
                const result = await window.openai.requestDisplayMode({ mode: 'fullscreen' });
                console.log('Display mode changed to:', result.mode);
            }
        } catch (error) {
            console.error('Failed to request fullscreen mode:', error);
        }
    };

    // Safety check for empty data
    if (!rows || rows.length === 0) {
        return (
            <div className="barplot-widget">
                <div className="barplot-card">
                    <div className="barplot-empty">
                        No data available
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="barplot-widget">
            <Card size="md">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Row align="center">
                        <Text weight="semibold">{title}</Text>
                        <div style={{ flex: 1 }} />
                        <Select
                            name="dashboard.metric"
                            options={metricOptions}
                            value={selectedMetric}
                            clearable={false}
                            onChange={onMetricChange}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExpand}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 2L6 2M6 2L6 6M6 2L2 6M14 2L10 2M10 2L10 6M10 2L14 6M2 14L6 14M6 14L6 10M6 14L2 10M14 14L10 14M10 14L10 10M10 14L14 10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Button>
                    </Row>

                    <Chart
                        data={rows}
                        series={[
                            {
                                type: "bar",
                                dataKey: selectedMetric,
                                color: "blue",
                            },
                        ]}
                        xAxis={{ dataKey: "period" }}
                        showYAxis
                        height={180}
                    />
                </div>
            </Card>
        </div>
    );
}