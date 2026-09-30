export default function HomePage() {
  return (
    <main>
      <div className="eyebrow">Predict / Decision intelligence</div>
      <h1>Test assumptions before they become decisions.</h1>
      <p className="lede">A controlled simulation workspace for scenarios, synthetic populations and model distributions. Results are traceable to their assumptions and never presented as certainty.</p>
      <section className="grid" aria-label="Platform principles">
        <article className="card"><div className="eyebrow">01 / Reproducible</div><h2>Every run has a seed and snapshot.</h2><p>Scenario input, engine version and execution configuration remain attached to the resulting run.</p></article>
        <article className="card"><div className="eyebrow">02 / Controlled</div><h2>AI informs decisions, not official state.</h2><p>Structured outputs and deterministic constraints protect the simulation kernel from uncontrolled model behavior.</p></article>
        <article className="card"><div className="eyebrow">03 / Honest</div><h2>Distributions before conclusions.</h2><p>Predict distinguishes simulation frequency from a calibrated real-world estimate.</p></article>
      </section>
    </main>
  );
}

