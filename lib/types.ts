type MaybeAsync = void | Promise<void>;
type ContextSetupFunction = (name: string) => MaybeAsync;
type TestSetupFunction = (name: string) => MaybeAsync;
// deno-lint-ignore no-explicit-any
type TestOptions = Record<string, any>;
type Runs = Array<MaybeAsync>;
