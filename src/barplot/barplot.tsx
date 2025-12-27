import './barplot.css';
import { Card, Chart, Row, Select, Text } from './CustomComponents';

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