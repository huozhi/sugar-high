import results from '../../../../docs/benchmark-results.json'
import './benchmarks.css'

const metrics = [
  ...(['gzip', 'minified'] as const).map(metric => ({
    id: metric,
    label: metric === 'gzip' ? 'Gzip · KiB' : 'Minified · KiB',
    values: results.engines.map(engine => {
      const value = results.bundles.results.find(bundle => bundle.engine === engine.id)?.[metric]
      return value === undefined ? undefined : value / 1024
    }),
  })),
  {
    id: 'time',
    label: '500 KiB TypeScript · ms',
    values: results.engines.map(engine =>
      results.results.find(row => row.engine === engine.id && row.targetKiB === 500)?.milliseconds
    ),
  },
]
const maxima = metrics.map(metric => Math.max(0, ...metric.values.map(value => value ?? 0)))

export default function Benchmarks() {
  return (
    <section className="benchmarks" id="benchmarks" aria-labelledby="benchmarks-title">
      <h2 id="benchmarks-title">Benchmark</h2>
      <div className="benchmarks__scroll" tabIndex={0} role="region" aria-label="Benchmark comparison">
        <table className="benchmarks__table">
          <thead>
            <tr>
              <th scope="col"><span className="benchmarks__sr-only">Library</span></th>
              {metrics.map(metric => <th scope="col" key={metric.id}>{metric.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {results.engines.map((engine, index) => (
              <tr key={engine.id} data-engine={engine.id}>
                <th scope="row" title={`${engine.label} ${engine.version}`}>{engine.label}</th>
                {metrics.map((metric, metricIndex) => {
                  const value = metric.values[index]
                  return (
                    <td key={metric.id}>
                      <div className="benchmarks__measurement">
                        <span className="benchmarks__track" aria-hidden="true">
                          {value !== undefined && <span style={{ width: `${maxima[metricIndex] ? value / maxima[metricIndex] * 100 : 0}%` }} />}
                        </span>
                        <span className="benchmarks__value">{value === undefined ? '—' : value.toFixed(2)}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a className="benchmarks__methodology" href="https://github.com/huozhi/sugar-high/blob/main/docs/BENCHMARK.md">Methodology ↗</a>
    </section>
  )
}
