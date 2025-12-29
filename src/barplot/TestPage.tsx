import React from 'react';
import BarplotWidget from './barplot';

/**
 * Test page for development with npm run dev
 */
export default function TestPage() {
    const [selectedMetric, setSelectedMetric] = React.useState("inversion_total");

    const testData = {
        title: "Monthly Performance Dashboard",
        metricOptions: [
            { label: "Inversión Total", value: "inversion_total" },
            { label: "Cantidad de Proyectos", value: "cantidad_proyectos" }
        ],
        selectedMetric: selectedMetric,
        rows: [
            { period: "Jan", inversion_total: 12000, cantidad_proyectos: 150, year: 2024, region: "Nacional" },
            { period: "Feb", inversion_total: 15000, cantidad_proyectos: 200, year: 2024, region: "Nacional" },
            { period: "Mar", inversion_total: 11000, cantidad_proyectos: 140, year: 2024, region: "Nacional" },
            { period: "Apr", inversion_total: 18000, cantidad_proyectos: 250, year: 2024, region: "Nacional" },
            { period: "May", inversion_total: 16000, cantidad_proyectos: 220, year: 2024, region: "Nacional" },
            { period: "Jun", inversion_total: 20000, cantidad_proyectos: 280, year: 2024, region: "Nacional" }
        ]
    };

    return (
        <div style={{
            padding: 40,
            backgroundColor: '#f3f4f6',
            minHeight: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <h1 style={{
                    marginBottom: 10,
                    color: '#111827',
                    fontSize: 32,
                    fontWeight: 700
                }}>
                    Widget Test Environment
                </h1>
                <p style={{
                    marginBottom: 30,
                    color: '#6b7280',
                    fontSize: 16
                }}>
                    Testing BarplotWidget with interactive data
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 20
                }}>
                    {/* Main Widget */}
                    <BarplotWidget
                        {...testData}
                        onMetricChange={setSelectedMetric}
                    />

                    {/* Info Panel */}
                    <div style={{
                        padding: 20,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{
                            marginTop: 0,
                            marginBottom: 12,
                            color: '#111827',
                            fontSize: 18
                        }}>
                            Widget Information
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 12,
                            fontSize: 14
                        }}>
                            <div>
                                <strong style={{ color: '#374151' }}>Current Metric:</strong>
                                <p style={{ margin: '4px 0', color: '#3b82f6', fontWeight: 600 }}>
                                    {testData.metricOptions.find(m => m.value === selectedMetric)?.label}
                                </p>
                            </div>
                            <div>
                                <strong style={{ color: '#374151' }}>Data Points:</strong>
                                <p style={{ margin: '4px 0', color: '#10b981', fontWeight: 600 }}>
                                    {testData.rows.length}
                                </p>
                            </div>
                            <div>
                                <strong style={{ color: '#374151' }}>Total Revenue:</strong>
                                <p style={{ margin: '4px 0', color: '#374151' }}>
                                    ${testData.rows.reduce((sum, r) => sum + (r.revenue as number), 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <strong style={{ color: '#374151' }}>Total Units:</strong>
                                <p style={{ margin: '4px 0', color: '#374151' }}>
                                    {testData.rows.reduce((sum, r) => sum + (r.units as number), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Multiple Widgets Example */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 20
                    }}>
                        <BarplotWidget
                            title="Q1 Revenue"
                            metricOptions={[{ label: "Revenue", value: "revenue" }]}
                            selectedMetric="revenue"
                            rows={testData.rows.slice(0, 3)}
                        />
                        <BarplotWidget
                            title="Q2 Revenue"
                            metricOptions={[{ label: "Revenue", value: "revenue" }]}
                            selectedMetric="revenue"
                            rows={testData.rows.slice(3, 6)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}