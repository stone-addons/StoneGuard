import { system, MySystem } from "./system";

declare function resolve(
  name: string
): { register(input: IStoneServerSystem<MySystem> & MySystem): void };

system.initialize = function() {
  this.registerRegionNames();
  resolve("commands/query-region").register(this);
  resolve("commands/create-region").register(this);
  resolve("actions/check-ability").register(this);
};
