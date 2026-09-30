import unittest

from predict_engine.model_gateway import Action, AgentDecision, AgentReasoningRequest, DeterministicModelGateway, ModelBudget, ModelBudgetExceededError


class ModelGatewayTests(unittest.TestCase):
    def test_fallback_respects_allowed_actions_and_records_budget(self) -> None:
        request = AgentReasoningRequest("a", 0.8, 0.2, ("event-1",), (Action.WAIT, Action.RESIST))
        decision, budget = DeterministicModelGateway().generate_structured(request, ModelBudget(2, 100))
        self.assertEqual(decision.action, Action.WAIT)
        self.assertEqual(decision.reason_codes, ("DETERMINISTIC_FALLBACK",))
        self.assertEqual(budget.calls_used, 1)

    def test_budget_cannot_exceed_configured_limit(self) -> None:
        with self.assertRaises(ModelBudgetExceededError):
            ModelBudget(0, 10).reserve(0)

    def test_decision_rejects_out_of_range_values(self) -> None:
        with self.assertRaises(ValueError):
            AgentDecision(Action.SUPPORT, 1.1, 0.5, ("TEST",), ())


if __name__ == "__main__":
    unittest.main()
