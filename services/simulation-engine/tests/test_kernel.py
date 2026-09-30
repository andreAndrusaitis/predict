import unittest

from predict_engine.kernel import AgentState, RunSpecification, SimulationEvent, SocialEdge, run, run_monte_carlo


class KernelTests(unittest.TestCase):
    def test_same_seed_reproduces_metrics(self) -> None:
        agents = [AgentState("a", 0.5, 0.1, 0.8), AgentState("b", 0.4, 0.2, 0.2)]
        spec = RunSpecification("run-1", seed=42, rounds=5, event_impact=0.1)
        self.assertEqual(run(spec, agents), run(spec, agents))

    def test_adoption_is_bounded(self) -> None:
        metrics = run(RunSpecification("run-1", 1, 3, 10), [AgentState("a", 1, 0.9, 1)])
        self.assertTrue(all(0 <= metric.mean_adoption <= 1 for metric in metrics))

    def test_event_is_visible_only_to_its_audience(self) -> None:
        agents = [AgentState("a", 1, 0, 0), AgentState("b", 1, 0, 0)]
        results = run(RunSpecification("run-1", 7, 1, 0, noise_amplitude=0), agents, events=[SimulationEvent(1, 1, frozenset({"a"}))])
        self.assertEqual(results[0].mean_adoption, 0.5)

    def test_social_graph_changes_the_trajectory_deterministically(self) -> None:
        agents = [AgentState("leader", 0, 1, 1), AgentState("peer", 0, 0, 1)]
        specification = RunSpecification("run-1", 3, 1, 0, noise_amplitude=0)
        connected = run(specification, agents, [SocialEdge("leader", "peer", 1)])[0]
        disconnected = run(specification, agents)[0]
        self.assertGreater(connected.mean_adoption, disconnected.mean_adoption)

    def test_monte_carlo_is_reproducible_and_reports_distribution(self) -> None:
        agents = [AgentState("a", 0.5, 0.1, 0.8)]
        specification = RunSpecification("batch", 42, 5, 0.1)
        result = run_monte_carlo(specification, agents, 10)
        self.assertEqual(result, run_monte_carlo(specification, agents, 10))
        self.assertEqual(result.run_count, 10)
        self.assertLessEqual(result.p05_final_adoption, result.p95_final_adoption)


if __name__ == "__main__":
    unittest.main()

