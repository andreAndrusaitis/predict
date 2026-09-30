from __future__ import annotations

from dataclasses import dataclass
from random import Random


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
    engine_version: str = "0.1.0"


@dataclass(frozen=True)
class RoundMetric:
    round_number: int
    mean_adoption: float


def _clip(value: float) -> float:
    return max(0.0, min(1.0, value))


def run(specification: RunSpecification, agents: list[AgentState]) -> list[RoundMetric]:
    """Advance agents with a seeded, simultaneous deterministic state transition."""
    rng = Random(specification.seed)
    states = list(agents)
    metrics: list[RoundMetric] = []
    for tick in range(1, specification.rounds + 1):
        previous_mean = sum(agent.adoption for agent in states) / len(states) if states else 0.0
        next_states = []
        for agent in states:
            noise = rng.uniform(-0.02, 0.02)
            delta = specification.event_impact * agent.trust + 0.15 * agent.influence * previous_mean + noise
            next_states.append(AgentState(agent.agent_id, agent.trust, _clip(agent.adoption + delta), agent.influence))
        states = next_states
        metrics.append(RoundMetric(tick, sum(agent.adoption for agent in states) / len(states) if states else 0.0))
    return metrics

