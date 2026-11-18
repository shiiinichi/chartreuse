import { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, RefreshCw, RotateCcw, XCircle } from 'lucide-react';
import { Badge, Button, Card, Flex, Grid, GridItem, Masonry, Progress, Select, Stat, StatGroup, Timeline } from '../../system';
import type { TimelineItem } from '../../system';
import './metrics-pattern.css';

type TimeWindow = 'hour' | 'day' | 'week';
type ServiceId = 'gateway' | 'worker' | 'indexer';
type ServiceFilter = 'all' | ServiceId;

interface Service {
  id: ServiceId;
  name: string;
  costCents: number;
  durationMs: number;
}

interface ServiceSample {
  buckets: readonly number[];
  failed: number;
  meanDurationMs: number;
  costCents: number;
}

interface WindowSample {
  label: string;
  interval: string;
  buckets: readonly string[];
  services: Record<ServiceId, ServiceSample>;
}

interface RunResult {
  id: string;
  serviceId: ServiceId;
  successful: boolean;
  durationMs: number;
  costCents: number;
  completedAt: number;
}

interface ServiceMetrics {
  service: Service;
  buckets: number[];
  finished: number;
  successful: number;
  durationMs: number;
  costCents: number;
}

const services: readonly Service[] = [
  { id: 'gateway', name: 'Gateway', costCents: 9, durationMs: 310 },
  { id: 'worker', name: 'Job worker', costCents: 19, durationMs: 1080 },
  { id: 'indexer', name: 'Indexer', costCents: 14, durationMs: 690 },
];

const windows: Record<TimeWindow, WindowSample> = {
  hour: {
    label: 'Last hour', interval: '10-minute intervals',
    buckets: ['11:10', '11:20', '11:30', '11:40', '11:50', '12:00'],
    services: {
      gateway: { buckets: [18, 22, 25, 20, 24, 27], failed: 2, meanDurationMs: 320, costCents: 1224 },
      worker: { buckets: [9, 12, 14, 11, 13, 16], failed: 3, meanDurationMs: 1120, costCents: 1425 },
      indexer: { buckets: [4, 5, 7, 6, 5, 7], failed: 0, meanDurationMs: 680, costCents: 476 },
    },
  },
  day: {
    label: 'Last 24 hours', interval: '4-hour intervals',
    buckets: ['16:00', '20:00', '00:00', '04:00', '08:00', '12:00'],
    services: {
      gateway: { buckets: [104, 130, 146, 168, 132, 136], failed: 10, meanDurationMs: 315, costCents: 7344 },
      worker: { buckets: [45, 71, 85, 90, 62, 75], failed: 12, meanDurationMs: 1080, costCents: 8132 },
      indexer: { buckets: [28, 31, 36, 30, 29, 34], failed: 3, meanDurationMs: 710, costCents: 2632 },
    },
  },
  week: {
    label: 'Last 7 days', interval: 'Daily intervals',
    buckets: ['Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16', 'Nov 17', 'Nov 18'],
    services: {
      gateway: { buckets: [700, 740, 680, 860, 820, 780, 816], failed: 73, meanDurationMs: 325, costCents: 48564 },
      worker: { buckets: [390, 420, 360, 470, 490, 450, 428], failed: 91, meanDurationMs: 1100, costCents: 57152 },
      indexer: { buckets: [170, 185, 160, 210, 190, 176, 188], failed: 17, meanDurationMs: 700, costCents: 17906 },
    },
  },
};

const initialSnapshot = Date.parse('2026-11-18T12:00:00Z');
const initialResults: readonly RunResult[] = [
  { id: 'RUN-2046', serviceId: 'worker', successful: false, durationMs: 1460, costCents: 19, completedAt: initialSnapshot - 12 * 60_000 },
  { id: 'RUN-2047', serviceId: 'gateway', successful: true, durationMs: 306, costCents: 9, completedAt: initialSnapshot - 6 * 60_000 },
  { id: 'RUN-2048', serviceId: 'indexer', successful: true, durationMs: 664, costCents: 14, completedAt: initialSnapshot - 2 * 60_000 },
];
const number = new Intl.NumberFormat('en-US');
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const clock = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' });

function metricsFor(service: Service, sample: WindowSample, results: readonly RunResult[]): ServiceMetrics {
  const fixture = sample.services[service.id];
  const buckets = [...fixture.buckets];
  const finished = buckets.reduce((total, count) => total + count, 0);
  const metrics = {
    service, buckets, finished, successful: finished - fixture.failed,
    durationMs: finished * fixture.meanDurationMs, costCents: fixture.costCents,
  };
  for (const result of results) {
    if (result.serviceId !== service.id) continue;
    metrics.buckets[metrics.buckets.length - 1] += 1;
    metrics.finished += 1;
    metrics.successful += Number(result.successful);
    metrics.durationMs += result.durationMs;
    metrics.costCents += result.costCents;
  }
  return metrics;
}

export function MetricsPattern() {
  const id = useId();
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('hour');
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const [results, setResults] = useState<RunResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState('Starting snapshot loaded.');
  const refreshTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => () => {
    if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
  }, []);

  const sample = windows[timeWindow];
  const selectedServices = services.filter(service => serviceFilter === 'all' || service.id === serviceFilter);
  const serviceMetrics = selectedServices.map(service => metricsFor(service, sample, results));
  const total = serviceMetrics.reduce((summary, metrics) => ({
    finished: summary.finished + metrics.finished,
    successful: summary.successful + metrics.successful,
    durationMs: summary.durationMs + metrics.durationMs,
    costCents: summary.costCents + metrics.costCents,
  }), { finished: 0, successful: 0, durationMs: 0, costCents: 0 });
  const volume = sample.buckets.map((_, index) => serviceMetrics.reduce((sum, metrics) => sum + metrics.buckets[index], 0));
  const peakVolume = Math.max(1, ...volume);
  const scope = serviceFilter === 'all' ? 'All services' : selectedServices[0].name;
  const snapshot = initialSnapshot + results.length * 60_000;
  const successRate = total.successful / total.finished * 100;
  const recentResults = [...initialResults, ...results]
    .filter(result => serviceFilter === 'all' || result.serviceId === serviceFilter)
    .slice(-4);
  const timeline: TimelineItem[] = recentResults.map(result => ({
    id: result.id,
    title: `${result.id} ${result.successful ? 'completed' : 'failed'}`,
    date: `${clock.format(result.completedAt)} UTC`,
    dateTime: new Date(result.completedAt).toISOString(),
    icon: result.successful ? CheckCircle2 : XCircle,
    tone: result.successful ? 'success' : 'danger',
    content: `${services.find(service => service.id === result.serviceId)!.name} · ${number.format(result.durationMs)} ms · ${money.format(result.costCents / 100)} USD`,
  }));

  const refresh = () => {
    if (refreshTimer.current !== null) return;
    const sequence = results.length + 1;
    const service = serviceFilter === 'all'
      ? services[(sequence - 1) % services.length]
      : selectedServices[0];
    setRefreshing(true);
    setNotice('Refreshing the sample snapshot…');
    refreshTimer.current = window.setTimeout(() => {
      const result: RunResult = {
        id: `RUN-${2048 + sequence}`, serviceId: service.id,
        successful: sequence % 4 !== 0,
        durationMs: service.durationMs + sequence % 5 * 17,
        costCents: service.costCents,
        completedAt: initialSnapshot + sequence * 60_000,
      };
      setResults(previous => [...previous, result]);
      setNotice(`${result.id} ${result.successful ? 'completed' : 'failed'} for ${service.name}. Snapshot ${sequence + 1} is ready.`);
      setRefreshing(false);
      refreshTimer.current = null;
    }, 650);
  };

  const reset = () => {
    if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
    refreshTimer.current = null;
    setRefreshing(false);
    setResults([]);
    setTimeWindow('hour');
    setServiceFilter('all');
    setNotice('Example reset to the starting snapshot.');
  };

  return <section className="metrics-pattern" aria-labelledby={`${id}-title`}>
    <Flex align="center" justify="space-between" wrap gap={4} className="metrics-pattern-header">
      <div className="metrics-pattern-heading">
        <p className="metrics-pattern-eyebrow">Execution overview</p>
        <h3 id={`${id}-title`}>Run metrics</h3>
        <p>Volume, reliability, duration, and execution cost.</p>
      </div>
      <Badge tone="info" dot>Sample dataset</Badge>
    </Flex>

    <Card className="metrics-pattern-filter-card" aria-label="Metric filters">
      <Grid columns={{ base: 1, sm: 2 }} gap={4}>
        <GridItem span={1}>
          <Select label="Time window" value={timeWindow} disabled={refreshing}
            onChange={event => setTimeWindow(event.currentTarget.value as TimeWindow)}>
            {(Object.keys(windows) as TimeWindow[]).map(key => <option value={key} key={key}>{windows[key].label}</option>)}
          </Select>
        </GridItem>
        <GridItem span={1}>
          <Select label="Service" value={serviceFilter} disabled={refreshing}
            onChange={event => setServiceFilter(event.currentTarget.value as ServiceFilter)}>
            <option value="all">All services</option>
            {services.map(service => <option value={service.id} key={service.id}>{service.name}</option>)}
          </Select>
        </GridItem>
      </Grid>
      <Flex align="center" justify="space-between" wrap gap={3}>
        <p className="metrics-pattern-caption">Refresh adds one finished run. Reset restores the starting snapshot.</p>
        <div className="metrics-pattern-actions">
          <Button size="sm" variant="secondary" icon={RefreshCw} loading={refreshing} onClick={refresh}>
            {refreshing ? 'Refreshing…' : 'Refresh snapshot'}
          </Button>
          <Button size="sm" variant="ghost" icon={RotateCcw} onClick={reset}>Reset example</Button>
        </div>
      </Flex>
    </Card>

    <p className="metrics-pattern-status" role="status">{notice}</p>

    <div className="metrics-pattern-results" aria-busy={refreshing}>
      <Flex align="center" justify="space-between" wrap gap={2} className="metrics-pattern-scope">
        <p><strong>{sample.label}</strong><span aria-hidden="true"> · </span>{scope}</p>
        <p>Snapshot {results.length + 1} · <time dateTime={new Date(snapshot).toISOString()}>18 Nov · {clock.format(snapshot)} UTC</time></p>
      </Flex>

      <StatGroup columns={{ base: 1, sm: 2, lg: 4 }} gap={4} aria-label={`${sample.label}: ${scope}`}>
        <Card className="metrics-pattern-stat-card"><Stat label="Finished runs" value={total.finished} loading={refreshing}
          description={`${number.format(total.successful)} succeeded · ${number.format(total.finished - total.successful)} failed`} /></Card>
        <Card className="metrics-pattern-stat-card"><Stat label="Success rate" value={successRate} precision={1} suffix="%"
          tone={successRate >= 98 ? 'success' : 'warning'} loading={refreshing} description="Successful runs / finished runs." /></Card>
        <Card className="metrics-pattern-stat-card"><Stat label="Mean duration" value={total.durationMs / total.finished} precision={0} suffix="ms"
          loading={refreshing} description="Elapsed time per finished run." /></Card>
        <Card className="metrics-pattern-stat-card"><Stat label="Compute cost (USD)" value={total.costCents / 100} precision={2} prefix="$"
          loading={refreshing} description="Execution charges for this scope." /></Card>
      </StatGroup>

      <Masonry columns={{ base: 1, md: 2 }} gap={4}>
        <Card className="metrics-pattern-content-card" aria-labelledby={`${id}-volume`}>
          <header className="metrics-pattern-card-heading">
            <h4 id={`${id}-volume`}>Finished run volume</h4>
            <p>{sample.interval} · UTC</p>
          </header>
          <ol className="metrics-pattern-bars" aria-label="Finished runs by interval">
            {sample.buckets.map((label, index) => <li key={label}>
              <span className="metrics-pattern-bar-value" aria-hidden="true">{number.format(volume[index])}</span>
              <span className="metrics-pattern-bar-track" aria-hidden="true"><span style={{ blockSize: `${volume[index] / peakVolume * 100}%` }} /></span>
              <span className="metrics-pattern-bar-label">{label}</span>
              <span className="cr-sr-only">: {number.format(volume[index])} finished runs.</span>
            </li>)}
          </ol>
          <p className="metrics-pattern-caption">{number.format(total.finished)} finished runs. New results enter the final interval.</p>
        </Card>

        <Card className="metrics-pattern-content-card" aria-labelledby={`${id}-reliability`}>
          <header className="metrics-pattern-card-heading">
            <h4 id={`${id}-reliability`}>Service reliability</h4>
            <p>Success rate within the selected window.</p>
          </header>
          <div className="metrics-pattern-service-list">
            {serviceMetrics.map(metrics => <Progress key={metrics.service.id} label={metrics.service.name} showLabel
              value={metrics.successful} max={metrics.finished}
              valueText={`${(metrics.successful / metrics.finished * 100).toFixed(1)}%`}
              aria-valuetext={`${number.format(metrics.successful)} successful of ${number.format(metrics.finished)} finished runs`}
              description={`${number.format(metrics.finished)} finished · ${number.format(metrics.finished - metrics.successful)} failed`} />)}
          </div>
        </Card>

        <Card className="metrics-pattern-content-card" aria-labelledby={`${id}-runs`}>
          <header className="metrics-pattern-card-heading">
            <h4 id={`${id}-runs`}>Recent run changes</h4>
            <p>Latest finished runs for {scope.toLowerCase()}.</p>
          </header>
          <Timeline items={timeline} reverse aria-label={`Recent run changes: ${scope}`}
            pending={refreshing ? 'Recording the next run result…' : undefined} />
        </Card>
      </Masonry>
    </div>
  </section>;
}
