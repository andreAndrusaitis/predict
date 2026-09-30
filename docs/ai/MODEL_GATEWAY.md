# Model Gateway

The engine exposes a provider-neutral `ModelGateway` protocol. Its only decision output is a validated action, intensity, confidence, reason codes and evidence IDs. Providers cannot write simulation state, metrics or traces directly. `ModelBudget` enforces per-run call/token limits, while `DeterministicModelGateway` is the safe no-provider fallback. Provider adapters, prompt registry and tracing will be added behind this same interface.
