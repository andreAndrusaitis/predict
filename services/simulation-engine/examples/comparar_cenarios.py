"""Exemplo: compara dois cenários fictícios e desenha a distribuição das execuções.

Uso (a partir de services/simulation-engine):
    python -m examples.comparar_cenarios --saida ../../docs/vitrine

Os números são do modelo, não uma previsão do mundo real.
"""
from __future__ import annotations

import argparse
from pathlib import Path
from random import Random

from predict_engine.kernel import AgentState, RunSpecification, SimulationEvent, SocialEdge, run

RODADAS, EXECUCOES, AGENTES = 12, 300, 80
TEMAS = {
    "escuro": {"tinta": "#f0f6fc", "suave": "#9198a1", "grade": "#2a313a", "a": "#3987e5", "b": "#d95926"},
    "claro": {"tinta": "#1f2328", "suave": "#59636e", "grade": "#d8dee4", "a": "#2a78d6", "b": "#eb6834"},
}


def populacao(seed: int) -> tuple[list[AgentState], list[SocialEdge], frozenset[str]]:
    """População sintética: 8 pessoas influentes ligadas a todo o resto."""
    rng = Random(seed)
    agentes = [
        AgentState(f"p{i}", rng.uniform(0.2, 0.7), rng.uniform(0.02, 0.12), 0.9 if i < 8 else rng.uniform(0.05, 0.25))
        for i in range(AGENTES)
    ]
    lideres = [a.agent_id for a in agentes[:8]]
    arestas = [SocialEdge(rng.choice(lideres), a.agent_id, 0.55, 0.6) for a in agentes[8:] for _ in range(2)]
    return agentes, arestas, frozenset(lideres)


def cenario(eventos: list[SimulationEvent], agentes: list[AgentState], arestas: list[SocialEdge], nome: str) -> list[list[float]]:
    """Uma trajetória por execução, cada uma com a própria semente."""
    return [
        [m.mean_adoption for m in run(RunSpecification(f"{nome}:{i}", 1000 + i, RODADAS, 0.0, 0.18, 0.05), agentes, arestas, eventos)]
        for i in range(EXECUCOES)
    ]


def faixas(series: list[list[float]]) -> list[tuple[float, float, float]]:
    saida = []
    for rodada in zip(*series):
        o = sorted(rodada)
        saida.append((o[int(0.05 * (len(o) - 1))], o[len(o) // 2], o[int(0.95 * (len(o) - 1))]))
    return saida


def grafico(a: list[tuple[float, float, float]], b: list[tuple[float, float, float]], t: dict[str, str]) -> str:
    L, T, W, H = 52, 64, 600, 250
    topo = max(p[2] for p in a + b)
    teto = next(v for v in (0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0) if v >= topo)
    x = lambda i: L + W * i / (RODADAS - 1)
    y = lambda v: T + H * (1 - v / teto)
    fonte = 'font-family="-apple-system,Segoe UI,Helvetica,Arial,sans-serif"'
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 372" width="820" height="372" role="img" aria-label="Adoção média por rodada em dois cenários" {fonte}>']
    o.append(f'<text x="0" y="20" font-size="16" font-weight="600" fill="{t["tinta"]}">Adoção média por rodada</text>')
    o.append(f'<text x="0" y="41" font-size="13" fill="{t["suave"]}">Mediana de {EXECUCOES} execuções; a faixa vai do 5º ao 95º percentil. População fictícia.</text>')
    for k in range(5):
        v = teto * k / 4
        o.append(f'<line x1="{L}" x2="{L + W}" y1="{y(v):.1f}" y2="{y(v):.1f}" stroke="{t["grade"]}" stroke-width="1"/>')
        o.append(f'<text x="{L - 8}" y="{y(v) + 4:.1f}" font-size="12" text-anchor="end" fill="{t["suave"]}">{v * 100:.0f}%</text>')
    for i in range(RODADAS):
        if i % 2 == 0 or i == RODADAS - 1:
            o.append(f'<text x="{x(i):.1f}" y="{T + H + 20}" font-size="12" text-anchor="middle" fill="{t["suave"]}">{i + 1}</text>')
    o.append(f'<text x="{L + W / 2}" y="{T + H + 40}" font-size="12" text-anchor="middle" fill="{t["suave"]}">rodada</text>')
    for s, c in ((a, t["a"]), (b, t["b"])):
        area = " ".join(f"{x(i):.1f},{y(p[2]):.1f}" for i, p in enumerate(s)) + " " + " ".join(f"{x(i):.1f},{y(p[0]):.1f}" for i, p in reversed(list(enumerate(s))))
        o.append(f'<polygon points="{area}" fill="{c}" fill-opacity="0.16"/>')
        o.append(f'<polyline points="{" ".join(f"{x(i):.1f},{y(p[1]):.1f}" for i, p in enumerate(s))}" fill="none" stroke="{c}" stroke-width="2" stroke-linejoin="round"/>')
    ya, yb = y(a[-1][1]), y(b[-1][1])
    if abs(ya - yb) < 40:
        meio = (ya + yb) / 2
        ya, yb = (meio - 20, meio + 20) if ya < yb else (meio + 20, meio - 20)
    for s, c, rot, yy in ((a, t["a"], "Anúncio para todos", ya), (b, t["b"], "Só os influentes", yb)):
        o.append(f'<circle cx="{x(RODADAS - 1):.1f}" cy="{y(s[-1][1]):.1f}" r="4" fill="{c}"/>')
        o.append(f'<circle cx="{L + W + 22}" cy="{yy - 4:.1f}" r="5" fill="{c}"/><text x="{L + W + 34}" y="{yy:.1f}" font-size="13" fill="{t["tinta"]}">{rot}</text>')
        o.append(f'<text x="{L + W + 34}" y="{yy + 16:.1f}" font-size="12" fill="{t["suave"]}">{s[-1][1] * 100:.0f}% no fim</text>')
    return "".join(o) + "</svg>"


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--saida", type=Path, default=Path("."))
    args = p.parse_args()
    agentes, arestas, lideres = populacao(7)
    todos = cenario([SimulationEvent(3, 0.12)], agentes, arestas, "todos")
    alvo = cenario([SimulationEvent(3, 0.45, lideres)], agentes, arestas, "influentes")
    fa, fb = faixas(todos), faixas(alvo)
    args.saida.mkdir(parents=True, exist_ok=True)
    for nome, t in TEMAS.items():
        (args.saida / f"cenarios-{nome}.svg").write_text(grafico(fa, fb, t), encoding="utf-8")
    for nome, f in (("anuncio para todos", fa), ("so os influentes", fb)):
        print(f"{nome:20s} p05={f[-1][0]:.3f} mediana={f[-1][1]:.3f} p95={f[-1][2]:.3f}")


if __name__ == "__main__":
    main()
