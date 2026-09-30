import unittest

from predict_engine.kernel import AgentState, RunSpecification, run


class KernelTests(unittest.TestCase):
    def test_same_seed_reproduces_metrics(self) -> None:
        agents = [AgentState("a", 0.5, 0.1, 0.8), AgentState("b", 0.4, 0.2, 0.2)]
        spec = RunSpecification("run-1", seed=42, rounds=5, event_impact=0.1)
        self.assertEqual(run(spec, agents), run(spec, agents))

    def test_adoption_is_bounded(self) -> None:
        metrics = run(RunSpecification("run-1", 1, 3, 10), [AgentState("a", 1, 0.9, 1)])
        self.assertTrue(all(0 <= metric.mean_adoption <= 1 for metric in metrics))


if __name__ == "__main__":
    unittest.main()

