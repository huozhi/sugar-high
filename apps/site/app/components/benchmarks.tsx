import results from '../../../../docs/benchmark-results.json'
import './benchmarks.css'

export default function Benchmarks() {
  const sizes = [...new Set(results.results.map(result => result.targetKiB))].filter(size => size === 500)

  const metrics = [
    ...(['minified', 'gzip'] as const).map(metric => ({
      id: metric,
      label: metric === 'gzip' ? 'Gzip bundle' : 'Minified bundle',
      unit: 'KiB',
      values: results.engines.map(engine => ({
        ...engine,
        value: results.bundles?.results.find(bundle => bundle.engine === engine.id)?.[metric],
      })).map(engine => ({ ...engine, value: engine.value === undefined ? undefined : engine.value / 1024 })),
    })),
    ...sizes.map(size => ({
      id: `time-${size}`,
      label: `${Math.round(results.results.find(result => result.targetKiB === size)!.sourceBytes / 1024)} KiB file`,
      unit: 'ms',
      values: results.engines.map(engine => ({
        ...engine,
        value: results.results.find(result => result.engine === engine.id && result.targetKiB === size)?.milliseconds,
      })),
    })),
  ]

  return (
    <section className="benchmarks" id="benchmarks" aria-labelledby="benchmarks-title">
      <div className="benchmarks__heading">
        <h2 id="benchmarks-title">Benchmark</h2>
      </div>
      <div className="benchmarks__libraries" aria-label="Highlighter colors">
        {results.engines.map(engine => (
          <span key={engine.id} data-engine={engine.id} title={`${engine.label} ${engine.version}`}>
            <i aria-hidden="true" />{engine.label}
          </span>
        ))}
      </div>
      <div className="benchmarks__charts">
        {metrics.map(metric => {
          const values = metric.values
          const measured = values.flatMap(row => row.value === undefined ? [] : [row.value])
          const highest = Math.max(...measured)
          return (
            <section className="benchmarks__chart" key={metric.id} aria-labelledby={`benchmark-${metric.id}`}>
              <h3 id={`benchmark-${metric.id}`}>{metric.label}</h3>
              <dl>
                {values.map(row => {
                  return (
                    <div className="benchmarks__row" data-engine={row.id} key={row.id}>
                      <dt className="benchmarks__sr-only">{row.label}</dt>
                      <dd>
                        <span className="benchmarks__track" aria-hidden="true">
                          {row.value !== undefined && (
                            <span style={{ width: `${highest > 0 ? row.value / highest * 100 : 0}%` }} />
                          )}
                        </span>
                        <span className="benchmarks__value">
                          {row.value === undefined ? <span aria-label="Not measured">—</span> : (
                            <>{row.value.toFixed(2)} <span className="benchmarks__unit">{metric.unit}</span></>
                          )}
                        </span>
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </section>
          )
        })}
      </div>
      <p className="benchmarks__caption">
        Measured {results.measuredAt.slice(0, 10)}.
      </p>
    </section>
  )
}
