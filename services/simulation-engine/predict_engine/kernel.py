from __future__ import annotations

from dataclasses import dataclass
from random import Random
from statistics import mean, median, pstdev


@dataclass(frozen=True)
class AgentState:
    agent_id: str
    trust: float
    adoption: float
    influence: float


@dataclass(frozen=True)
class RunSpecification:
    run_id: str
    seed: int
    rounds: int
    event_impact: float
    social_influence_weight: float = 0.15
    noise_amplitude: float = 0.02
    engine_version: str = "0.1.0"


@dataclass(frozen=True)
class RoundMetric:
    round_number: int
    mean_adoption: float


@dataclass(frozen=True)
class SocialEdge:
    source_id: str
    target_id: str
    strength: float
    contact_probability: float = 1.0


@dataclass(frozen=True)
class SimulationEvent:
    round_number: int
    impact: float
    audience_ids: frozenset[str] | None = None


@dataclass(frozen=True)
class MonteCarloSummary:
    run_count: int
    mean_final_adoption: float
    median_final_adoption: float
    standard_deviation: float
    p05_final_adoption: float
    p95_final_adoption: float


def _clip(value: float) -> float:
    return max(0.0, min(1.0, value))


def _percentile(sorted_values: list[float], percentile: float) -> float:
    if not sorted_values:
        return 0.0
    index = (len(sorted_values) - 1) * percentile
    lower, upper = int(index), min(int(index) + 1, len(sorted_values) - 1)
    return sorted_values[lower] + (sorted_values[upper] - sorted_values[lower]) * (index - lower)


def run(
    specification: RunSpecification,
    agents: list[AgentState],
    edges: list[SocialEdge] | None = None,
    events: list[SimulationEvent] | None = None,
) -> list[RoundMetric]:
    """Advance a seeded simulation through event, influence and simultaneous state stages."""
    rng = Random(specification.seed)
    states = list(agents)
    edges = edges or []
    events_by_round: dict[int, list[SimulationEvent]] = {}
    for event in events or []:
        events_by_round.setdefault(event.round_number, []).append(event)
    metrics: list[RoundMetric] = []
    for tick in range(1, specification.rounds + 1):
        previous_mean = sum(agent.adoption for agent in states) / len(states) if states else 0.0
        state_by_id = {agent.agent_id: agent for agent in states}
        social_effects = {agent.agent_id: 0.0 for agent in states}
        for edge in edges:
            source = state_by_id.get(edge.source_id)
            if source is None or edge.target_id not in social_effects:
                continue
            if rng.random() <= edge.contact_probability:
                social_effects[edge.target_id] += edge.strength * source.influence * (source.adoption - previous_mean)
        next_states = []
        for agent in states:
            event_effect = specification.event_impact
            for event in events_by_round.get(tick, []):
                if event.audience_ids is None or agent.agent_id in event.audience_ids:
                    event_effect += event.impact
            noise = rng.uniform(-specification.noise_amplitude, specification.noise_amplitude)
            delta = event_effect * agent.trust + specification.social_influence_weight * (agent.influence * previous_mean + social_effects[agent.agent_id]) + noise
            next_states.append(AgentState(agent.agent_id, agent.trust, _clip(agent.adoption + delta), agent.influence))
        states = next_states
        metrics.append(RoundMetric(tick, sum(agent.adoption for agent in states) / len(states) if states else 0.0))
    return metrics


def run_monte_carlo(
    specification: RunSpecification,
    agents: list[AgentState],
    runs: int,
    edges: list[SocialEdge] | None = None,
    events: list[SimulationEvent] | None = None,
) -> MonteCarloSummary:
    """Aggregate independent seeded runs; this is a model distribution, not a factual probability."""
    if runs < 1:
        raise ValueError("runs must be at least one")
    final_adoptions = []
    for offset in range(runs):
        seeded_specification = RunSpecification(
            run_id=f"{specification.run_id}:{offset}", seed=specification.seed + offset,
            rounds=specification.rounds, event_impact=specification.event_impact,
            social_influence_weight=specification.social_influence_weight,
            noise_amplitude=specification.noise_amplitude, engine_version=specification.engine_version,
        )
        final_adoptions.append(run(seeded_specification, agents, edges, events)[-1].mean_adoption if agents else 0.0)
    ordered = sorted(final_adoptions)
    return MonteCarloSummary(runs, mean(final_adoptions), median(final_adoptions), pstdev(final_adoptions), _percentile(ordered, 0.05), _percentile(ordered, 0.95))

