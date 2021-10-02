type MaybeAsync = void | Promise<void>;
type TestSetupFunction = (name: string) => MaybeAsync;
