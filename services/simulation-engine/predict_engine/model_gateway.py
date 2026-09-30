"""Provider-neutral, structured decision boundary for optional AI reasoning."""

from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum
from typing import Protocol


class Action(StrEnum):
    SUPPORT = "support"
    RESIST = "resist"
    WAIT = "wait"
    INFLUENCE = "influence"
    EXIT = "exit"


class ModelBudgetExceededError(RuntimeError):
    pass


@dataclass(frozen=True)
class ModelBudget:
    max_calls: int
    max_tokens: int
    calls_used: int = 0
    tokens_used: int = 0

    def reserve(self, estimated_tokens: int) -> "ModelBudget":
        if estimated_tokens < 0:
            raise ValueError("estimated_tokens cannot be negative")
        if self.calls_used + 1 > self.max_calls or self.tokens_used + estimated_tokens > self.max_tokens:
            raise ModelBudgetExceededError("Model budget exceeded")
        return ModelBudget(self.max_calls, self.max_tokens, self.calls_used + 1, self.tokens_used + estimated_tokens)


@dataclass(frozen=True)
class AgentReasoningRequest:
    agent_id: str
    trust: float
    adoption: float
    observed_event_ids: tuple[str, ...]
    allowed_actions: tuple[Action, ...]
    relevant_memory_ids: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if not 0 <= self.trust <= 1 or not 0 <= self.adoption <= 1:
            raise ValueError("Agent state values must be within [0, 1]")
        if not self.allowed_actions:
            raise ValueError("At least one allowed action is required")


@dataclass(frozen=True)
class AgentDecision:
    action: Action
    intensity: float
    confidence: float
    reason_codes: tuple[str, ...]
    evidence_ids: tuple[str, ...]

    def __post_init__(self) -> None:
        if not 0 <= self.intensity <= 1 or not 0 <= self.confidence <= 1:
            raise ValueError("Decision values must be within [0, 1]")
        if not self.reason_codes:
            raise ValueError("At least one reason code is required")


class ModelGateway(Protocol):
    """Adapters may call a provider internally but must return a validated decision."""

    def generate_structured(self, request: AgentReasoningRequest, budget: ModelBudget) -> tuple[AgentDecision, ModelBudget]:
        ...


class DeterministicModelGateway:
    """Safe fallback used when AI is disabled, unavailable, or budget-constrained."""

    def generate_structured(self, request: AgentReasoningRequest, budget: ModelBudget) -> tuple[AgentDecision, ModelBudget]:
        updated_budget = budget.reserve(0)
        preferred = Action.SUPPORT if request.trust >= 0.5 else Action.RESIST
        action = preferred if preferred in request.allowed_actions else Action.WAIT if Action.WAIT in request.allowed_actions else request.allowed_actions[0]
        return AgentDecision(action, abs(request.trust - request.adoption), 1.0, ("DETERMINISTIC_FALLBACK",), request.observed_event_ids), updated_budget
