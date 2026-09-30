from fastapi import FastAPI
from pydantic import BaseModel, Field

from predict_engine.kernel import AgentState, RunSpecification, run

app = FastAPI(title="Predict Simulation Engine", version="0.1.0")


class AgentInput(BaseModel):
    agent_id: str
    trust: float = Field(ge=0, le=1)
    adoption: float = Field(ge=0, le=1)
    influence: float = Field(ge=0, le=1)


class RunInput(BaseModel):
    run_id: str
    seed: int
    rounds: int = Field(ge=1, le=10_000)
    event_impact: float = Field(ge=-1, le=1)
    agents: list[AgentInput]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "predict-simulation-engine"}


@app.post("/v1/runs")
def execute_run(payload: RunInput) -> dict[str, object]:
    specification = RunSpecification(payload.run_id, payload.seed, payload.rounds, payload.event_impact)
    agents = [AgentState(agent.agent_id, agent.trust, agent.adoption, agent.influence) for agent in payload.agents]
    metrics = run(specification, agents)
    return {"runId": payload.run_id, "engineVersion": specification.engine_version, "metrics": metrics}

