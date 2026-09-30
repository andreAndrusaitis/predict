# Worker runtime

`createSimulationWorker` binds BullMQ delivery to the idempotent processor. It has limited concurrency and receives repository and engine adapters by dependency injection, keeping Redis out of business-state ownership.
